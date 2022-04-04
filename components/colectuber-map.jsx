import React, {useState, useEffect, useRef, useMemo} from 'react';
import { Circle, GoogleMap, Marker, Polyline } from '@react-google-maps/api';
import styles from 'styles/colectuber-map.module.scss'
import ColectivoMapEntity from 'src/entities/colectivo-map-entity';
import ColectivoMarker from './colectivo-marker';
import ParadaMarker from './parada-marker';
import ParadaMapEntity from 'src/entities/parada-map-entity';
import RecorridoMapEntity from 'src/entities/recorrido-map-entity';
import RecorridoLine from './recorrido-line';

const FPS = 60;
const SPF = 1000/FPS;

const ColectuberMap = ({
    className,

    //Data
    fetchedColectivos,
    fetchedParadas,
    fetchedRecorridos,

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

    //COLECTIVOS
    const [colectivos, setColectivos] = useState({});

    const createOrUpdateColectivos = (prevColectivos)=>{
        let newColectivos = {};

        fetchedColectivos.forEach((fetchedColectivo)=>{
            if(!fetchedColectivo.position) return;
            
            let colectivo = prevColectivos[fetchedColectivo.id];
            if(colectivo){
                //Update colectivo data
                colectivo.update(fetchedColectivo);
                newColectivos[colectivo.id] = colectivo;
            }else{
                //Create new Colectivo
                let newColectivo = new ColectivoMapEntity(fetchedColectivo);
                newColectivos[newColectivo.id] = newColectivo;
            }
        });

        return newColectivos;
    }

    useEffect(()=>{
        setColectivos(createOrUpdateColectivos);
    },[fetchedColectivos]);

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
                colectivo.move(delta);
                newColectivos[colectivo.id] = colectivo;
            })
            return newColectivos;
        })
    }

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
            let newRecorrido = new RecorridoMapEntity(fetchedRecorrido);
            newRecorridos[newRecorrido.id] = newRecorrido;
        })

        return newRecorridos;
    }

    useEffect(()=>{
        setRecorridos(createRecorridos);
    },[fetchedRecorridos])

    //RENDER
    //Render Colectivos
    const renderColectivos = ()=>{
        return Object.values(colectivos).map((colectivo)=>{
            return <ColectivoMarker 
                key={colectivo.id} 
                colectivoEntity={colectivo}
                
                selected={selectedMarker == colectivo.id}
                hide={selectedMarker && selectedMarker != colectivo.id}

                onClick={()=>{selectMarker(colectivo.id)}}
                onCloseClick={()=>{selectMarker(null)}}
            />
        })
    }

    //Render Paradas
    const renderParadas = ()=>{
        return Object.values(paradas).map((parada)=>{
            return <ParadaMarker
                key={parada.id}
                paradaEntity={parada}
                selected={selectedMarker == parada.id}
                hide={selectedMarker && selectedMarker != parada.id}
                onClick={()=>{selectMarker(parada.id)}}
                onCloseClick={()=>{selectMarker(null)}}
            />
        })
    }

    //Render Recorridos
    const renderRecorridos = ()=>{
        return Object.values(recorridos).map((recorrido)=>{
            return <RecorridoLine
                key={recorrido.id}
                hide={selectedMarker && selectedMarker != recorrido.id}
                recorridoEntity={recorrido}
            />
        })
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
                {renderCircle()}
            </GoogleMap>
        </div>
    );
}

export default ColectuberMap;