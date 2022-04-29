import React, {useState, useEffect, useRef, useMemo} from 'react';
import { Circle, GoogleMap, Marker, Polyline } from '@react-google-maps/api';
import styles from 'styles/colectuber-map.module.scss'
import ColectivoMapEntity from 'src/entities/colectivo-map-entity';
import ColectivoMarker from './colectivo-marker';
import ParadaMarker from './parada-marker';
import ParadaMapEntity from 'src/entities/parada-map-entity';
import RecorridoMapEntity from 'src/entities/recorrido-map-entity';
import RecorridoLine from './recorrido-line';
import UserMapEntity from 'src/entities/user-map-entity';
import UserMarker from './user-marker';

const FPS = 60;
const SPF = 1000/FPS;

const ColectuberMap = ({
    className,

    //Data
    fetchedColectivos,
    fetchedParadas,
    fetchedRecorridos,
    fetchedUser,

    //Selection
    selectedMarker,
    selectMarker
})=>{
    //INITIAL VALUES
    const mapParams = useMemo(()=>{
        const BOUNDS = {
            north: -27.28831571374801,
            south: -27.379767219135722,
            east: -55.80048608276117,
            west: -55.92708070367843,
        }
        
        const DEF_VALUES = {
            center: { lat: (BOUNDS.north + BOUNDS.south)/2, lng: (BOUNDS.west + BOUNDS.east)/2 },
            zoom: 14,
            mapContainerClassName: styles.map,
            options: {
                maxZoom: 18,
                mapId: 'c0f2df849cf82a64',
                disableDefaultUI:true,
                gestureHandling: "greedy",
            }
        };
        return DEF_VALUES;
    },[]);

    //PARADAS
    const [paradas, setParadas] = useState({});
    
    const createParadas = (prevParadas)=>{
        let newParadas = {};

        fetchedParadas.forEach((fetchedParada)=>{
            let newParada = new ParadaMapEntity(fetchedParada);
            newParadas[newParada.id] = newParada;
        })

        return newParadas;
    }

    useEffect(()=>{
        setParadas(createParadas);
    },[fetchedParadas]);

    //RECORRIDOS
    const [recorridos, setRecorridos] = useState({});

    const createRecorridos = (prevRecorridos)=>{
        let newRecorridos = {};

        fetchedRecorridos.forEach((fetchedRecorrido)=>{
            let newRecorrido = new RecorridoMapEntity(fetchedRecorrido, paradas);
            newRecorridos[newRecorrido.id] = newRecorrido;
        })

        return newRecorridos;
    }

    useEffect(()=>{
        setRecorridos(createRecorridos);
    },[fetchedRecorridos, paradas])

    //COLECTIVOS
    const [colectivos, setColectivos] = useState({});

    const createOrUpdateColectivos = (prevColectivos)=>{
        let newColectivos = {};

        fetchedColectivos.forEach((fetchedColectivo)=>{
            if(isNaN(fetchedColectivo.ip)) return;
            
            let recorrido = recorridos[fetchedColectivo.recorridoId];
            if(!recorrido) return;

            let colectivo = prevColectivos[fetchedColectivo.id];
            if(colectivo){
                //Update colectivo data
                colectivo.update(fetchedColectivo, recorrido);
                newColectivos[colectivo.id] = colectivo;
            }else{
                //Create new Colectivo
                let newColectivo = new ColectivoMapEntity(fetchedColectivo, recorrido);
                newColectivos[newColectivo.id] = newColectivo;
            }
        });

        return newColectivos;
    }

    useEffect(()=>{
        setColectivos(createOrUpdateColectivos);
    },[fetchedColectivos, recorridos]);

    //Interpolation
    const thenRef = useRef(0);

    useEffect(()=>{
        startClock();
    },[]);

    const startClock = ()=>{
        thenRef.current = Date.now();
        processClock();
    }

    const processClock = ()=>{
        requestAnimationFrame(processClock)
        
        let now = Date.now();
        let enlapsed = now - thenRef.current;

        if (enlapsed > SPF){
            let newThen = now - (enlapsed%SPF);
            let delta = newThen - thenRef.current;
            thenRef.current = newThen;

            step(delta);
        }
    }

    const step = (delta)=>{
        setColectivos((prevColectivos)=>{
            let newColectivos = {};
            Object.values(prevColectivos).forEach((colectivo)=>{
                colectivo.step(delta);
                newColectivos[colectivo.id] = colectivo;
            })
            return newColectivos;
        })
    }

    //USER
    const [user, setUser] = useState(null);

    const createOrUpdateUser = (prevUser)=>{
        if(prevUser){
            prevUser.update(fetchedUser);
            return prevUser;
        }else{
            if(!fetchedUser) return null;
            return new UserMapEntity(fetchedUser);
        }
    }

    useEffect(()=>{
        setUser(createOrUpdateUser);
    },[fetchedUser]);

    //RENDER
    //Render Colectivos
    const renderColectivos = ()=>{
        const getColectivoState = (colectivo)=>{
            let id = selectedMarker;
            if(!id){
                return {
                    state: "SHOWN"
                };
            }else if(id == colectivo.id){
                return {
                    state:"SELECTED"
                };
            }else if(id.startsWith("p-")){
                let parada = paradas[id];
                //Parada
                if(colectivo.isColectivoBeforeParada(parada.id)){
                    return {
                        state:"RELATED",
                        relatedEntity:parada
                    }
                }
            }

            return {
                state:"HIDDEN"
            };
        }

        return Object.values(colectivos).map((colectivo)=>{
            return <ColectivoMarker 
                key={colectivo.id} 
                colectivoEntity={colectivo}
                state={getColectivoState(colectivo)}
                onSelect={()=>{selectMarker(colectivo.id)}}
                onDeselect={()=>{selectMarker(null)}}
            />
        })
    }

    //Render Paradas
    const renderParadas = ()=>{
        const getParadaState = (parada)=>{
            let id = selectedMarker;
            if(!id){
                return {
                    state:"SHOWN"
                };
            }else if(id == parada.id){
                return {
                    state:"SELECTED"
                };
            }else if(id.startsWith("c-")){
                //Colectivo
                let colectivo = colectivos[id];
                if(colectivo.isColectivoBeforeParada(parada.id)){
                    return {
                        state:"RELATED",
                        relatedEntity:colectivo
                    };
                }
            }

            return {
                state:"HIDDEN"
            }
        }

        return Object.values(paradas).map((parada)=>{
            return <ParadaMarker
                key={parada.id}
                paradaEntity={parada}
                state={getParadaState(parada)}
                onSelect={()=>{selectMarker(parada.id)}}
                onDeselect={()=>{selectMarker(null)}}
            />
        })
    }

    //Render Recorridos
    const renderRecorridos = ()=>{
        const getRecorridoState = (recorrido)=>{
            let id = selectedMarker;
            if (!id){
                return {
                    state:"SHOWN"
                };
            }else if(id.startsWith("c-")){
                let colectivo = colectivos[id];
                if (colectivo.recorrido.id == recorrido.id){
                    return {
                        state:"RELATED",
                        relatedEntity:colectivo
                    }
                }
            }else if(id.startsWith("p-")){
                let parada = paradas[id];
                if(recorrido.paradas[parada.id]){
                    return {
                        state:"RELATED",
                        relatedEntity:parada
                    }
                }
            }

            return {
                state:"HIDDEN"
            }
        }

        return Object.values(recorridos).map((recorrido)=>{
            return <RecorridoLine
                key={recorrido.id}
                recorridoEntity={recorrido}
                state={getRecorridoState(recorrido)}
            />
        })
    }

    const renderUser = ()=>{
        const getUserState = ()=>{
            let id = selectedMarker;
            if(!id){
                return {
                    state:"SHOWN"
                };
            }

            return {
                state:"HIDDEN"
            }
        }

        if(!user) return <></>;
        return <UserMarker
            userEntity={user}
            state={getUserState()}
        />
    }

    //Debug
    const renderCircle = ()=>{
        return fetchedColectivos.map((fetchedColectivo)=>{
            if(!fetchedColectivo.position) return;
            return <Circle
                key={fetchedColectivo.id}
                center = {{
                    lat: fetchedColectivo.position.lat,
                    lng: fetchedColectivo.position.lng
                }}
                radius={5}
            />
        })
    }

    //Return
    return (
        <div className={styles.container + " " + className}>
            <GoogleMap
                center={mapParams.center}
                zoom={mapParams.zoom}
                mapContainerClassName={mapParams.mapContainerClassName}
                options={mapParams.options}
            >
                {renderColectivos()}
                {renderParadas()}
                {renderRecorridos()}
                {renderUser()}
                {renderCircle()}
            </GoogleMap>
        </div>
    );
}

export default ColectuberMap;