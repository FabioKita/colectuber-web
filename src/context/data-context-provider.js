import React,{ useState, useEffect, useContext, useReducer } from 'react';
import ColectivoMapEntity from 'src/entities/colectivo-map-entity';
import ParadaMapEntity from 'src/entities/parada-map-entity';
import RecorridoMapEntity from 'src/entities/recorrido-map-entity';
import ColectuberService from 'src/services/colectuber-service';
import { useGoogleScript } from './google-context-provider';

const DataContext = React.createContext();

const ACTIONS = {
    LOAD_INITIAL_DATA:0,
    UPDATE_LOCATION_DATA:1,
    MOVE_COLECTIVOS:2
}

export const useDataContext = ()=>{
    return useContext(DataContext);
}

export const DataProvider = ({
    children
})=>{
    const script = useGoogleScript();
    const [isLoaded, setLoaded] = useState(false);

    //Data
    const [state, dispatch] = useReducer((state, action)=>{
        switch(action.type){
            case ACTIONS.LOAD_INITIAL_DATA:{
                return {
                    colectivos: action.result.colectivos,
                    paradas: action.result.paradas,
                    recorridos: action.result.recorridos
                };
            }
            case ACTIONS.UPDATE_LOCATION_DATA:{
                let locationsData = action.data;

                Object.values(state.colectivos).forEach((colectivo)=>{
                    let location = locationsData.find(l=>l.colectivoId==colectivo.id);
                    if(location) colectivo.update(location, state.recorridos);
                    else colectivo.update({}, state.recorridos);
                })

                return {...state}
            }
            case ACTIONS.MOVE_COLECTIVOS:{
                Object.values(state.colectivos).forEach((colectivo)=>{
                    colectivo.step(action.delta);
                })
                return {...state};
            }
        }
    }, {
        colectivos:{},
        paradas:{},
        recorridos:{}
    })

    //LOAD INITIAL DATA
    const createParadas = (paradasData)=>{
        let newParadas = {};
        paradasData.forEach((paradaData)=>{
            let newParada = new ParadaMapEntity(paradaData);
            newParadas[newParada.id] = newParada;
        })
        return newParadas;
    }

    const createRecorridos = (recorridosData, paradas)=>{
        let newRecorridos = {};
        recorridosData.forEach((recorridoData)=>{
            let newRecorrido = new RecorridoMapEntity(recorridoData, paradas);
            newRecorridos[newRecorrido.id] = newRecorrido;
        })
        return newRecorridos;
    }

    const createColectivos = (colectivosData, recorridos)=>{
        let newColectivos = {};
        colectivosData.forEach((colectivoData)=>{
            let newColectivo = new ColectivoMapEntity(colectivoData, recorridos);
            newColectivos[newColectivo.id] = newColectivo;
        })
        return newColectivos;
    }
    
    const loadInitialData = async ()=>{
        let result = await ColectuberService.fetchInitialData();

        let paradas = createParadas(result.paradas);
        let recorridos = createRecorridos(result.recorridos, paradas);
        let colectivos = createColectivos(result.colectivos, recorridos);

        dispatch({
            type: ACTIONS.LOAD_INITIAL_DATA,
            result: {
                colectivos,
                paradas,
                recorridos
            }
        })
    }

    useEffect(()=>{
        if(script.isLoaded){
            loadInitialData()
                .catch((err)=>{
                    console.error(err);
                })
                .finally(()=>{
                    setLoaded(true);
                })
        }
    },[script.isLoaded])

    //UPDATE DATA
    const loadNewLocations = async ()=>{
        let locationsData = await ColectuberService.fetchLocations();
        dispatch({
            type: ACTIONS.UPDATE_LOCATION_DATA,
            data:locationsData
        })
    }

    const moveColectivos = (delta)=>{
        dispatch({
            type: ACTIONS.MOVE_COLECTIVOS,
            delta:delta
        })
    }

    //RETURN DATA
    return <DataContext.Provider 
        value={{
            isLoaded,

            colectivos:state.colectivos,
            paradas:state.paradas,
            recorridos:state.recorridos,
            
            loadNewLocations,
            moveColectivos
        }}
    >
        {children}
    </DataContext.Provider>;
}