import React, { useState, useEffect, useContext, useReducer } from 'react';
import ColectivoDatosMapEntity from 'src/entities/colectivo-datos-map-entity';
import ColectivoMapEntity from 'src/entities/colectivo-map-entity';
import ColectivoUbicacionMapEntity from 'src/entities/colectivo-ubicacion_map_entity';
import ParadaMapEntity from 'src/entities/parada-map-entity';
import RecorridoMapEntity from 'src/entities/recorrido-map-entity';
import ColectuberService from 'src/services/colectuber-service';
import { useGoogleScript } from './google-context-provider';

const DataContext = React.createContext();

const ACTIONS = {
    LOAD_INITIAL_DATA: 0,
    UPDATE_LOCATION_DATA: 1,
    MOVE_COLECTIVOS: 2
}

const createParadas = (paradasData) => {
    let newParadas = {};
    paradasData.forEach((paradaData) => {
        let newParada = new ParadaMapEntity(paradaData);
        newParadas[newParada.id] = newParada;
    })
    return newParadas;
}

const createRecorridos = (recorridosData, paradas) => {
    let newRecorridos = {};
    recorridosData.forEach((recorridoData) => {
        let newRecorrido = new RecorridoMapEntity(recorridoData, paradas);
        newRecorridos[newRecorrido.id] = newRecorrido;
    })
    return newRecorridos;
}

const createColectivos = (colectivosData, recorridos) => {
    let newColectivos = {};
    colectivosData.forEach((colectivoData) => {
        let newColectivo = new ColectivoMapEntity(colectivoData, recorridos);
        newColectivos[newColectivo.id] = newColectivo;
    })
    return newColectivos;
}

const createColectivosData = (colectivosData, recorridos) => {
    let newColectivosData = {};
    colectivosData.forEach((colectivoData) => {
        let newColectivoData = new ColectivoDatosMapEntity(colectivoData, recorridos);
        newColectivosData[newColectivoData.colectivoId] = newColectivoData;
    })
    return newColectivosData;
}

const createOrUpdateColectivosLocation = (colectivosData, oldLocations, recorridos)=>{
    let newLocations = {};

    colectivosData.forEach((colectivoData)=>{
        let oldLocation = oldLocations[colectivoData.colectivoId];
        if(oldLocation){
            oldLocation.update(colectivoData, recorridos);
            newLocations[colectivoData.colectivoId] = oldLocation;
        }else{
            let newLocation = new ColectivoUbicacionMapEntity(colectivoData, recorridos);
            newLocations[colectivoData.colectivoId] = newLocation;
        }
    })

    return newLocations;
}

const reducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.LOAD_INITIAL_DATA: {
            return {
                colectivos: action.result.colectivos,
                colectivosData: action.result.colectivosData,
                colectivosLocation: action.result.colectivosLocation,
                paradas: action.result.paradas,
                recorridos: action.result.recorridos
            };
        }
        case ACTIONS.UPDATE_LOCATION_DATA: {
            let locationsData = action.data;
            let colectivosData = createColectivosData(locationsData, state.recorridos);
            state.colectivosData = colectivosData;
            let newLocationsData = createOrUpdateColectivosLocation(locationsData, state.colectivosLocation, state.recorridos);
            state.colectivosLocation = newLocationsData;
            return { ...state };
        }
        case ACTIONS.MOVE_COLECTIVOS: {
            Object.values(state.colectivosLocation).forEach((colectivoLocation)=>{
                colectivoLocation.step(action.delta);
            })
            state.colectivosLocation = {...state.colectivosLocation}

            return { ...state };
        }
    }
}

export const useDataContext = () => {
    return useContext(DataContext);
}

export const DataProvider = ({
    children
}) => {
    const script = useGoogleScript();
    const [isLoaded, setLoaded] = useState(false);

    //Data
    const [state, dispatch] = useReducer(reducer, {
        colectivos: {},
        colectivosData: {},
        colectivosLocation: {},
        paradas: {},
        recorridos: {}
    })

    //LOAD INITIAL DATA
    const loadInitialData = async () => {
        let result = await ColectuberService.fetchInitialData();

        let paradas = createParadas(result.paradas);
        let recorridos = createRecorridos(result.recorridos, paradas);
        let colectivos = createColectivos(result.colectivos, recorridos);
        let colectivosData = createColectivosData(result.colectivosData, recorridos)
        let colectivosLocation = createOrUpdateColectivosLocation(result.colectivosData, {}, recorridos);

        dispatch({
            type: ACTIONS.LOAD_INITIAL_DATA,
            result: {
                colectivos,
                colectivosData,
                colectivosLocation,
                paradas,
                recorridos
            }
        })
    }

    useEffect(() => {
        if (script.isLoaded) {
            loadInitialData()
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
                    setLoaded(true);
                })
        }
    }, [script.isLoaded])

    //UPDATE DATA
    const loadNewLocations = async () => {
        let locationsData = await ColectuberService.fetchLocations();
        dispatch({
            type: ACTIONS.UPDATE_LOCATION_DATA,
            data: locationsData
        })
    }

    const moveColectivos = (delta) => {
        dispatch({
            type: ACTIONS.MOVE_COLECTIVOS,
            delta: delta
        })
    }

    //RETURN DATA
    return <DataContext.Provider
        value={{
            isLoaded,

            colectivos: state.colectivos,
            colectivosData: state.colectivosData,
            colectivosLocation: state.colectivosLocation,
            paradas: state.paradas,
            recorridos: state.recorridos,

            loadNewLocations,
            moveColectivos
        }}
    >
        {children}
    </DataContext.Provider>;
}