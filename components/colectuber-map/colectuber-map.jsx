import React, {useState, useEffect, useRef, useMemo, useReducer} from 'react';
import { Circle, GoogleMap, Marker, Polyline } from '@react-google-maps/api';
import styles from 'styles/colectuber-map.module.scss'
import ColectivoMarker from './colectivo-marker';
import ParadaMarker from './parada-marker';
import RecorridoLine from './recorrido-line';
import UserMarker from './user-marker';
import { useDataContext } from 'src/context/data-context-provider';
import { useSelectionContext } from 'src/context/selection-context-provider';

const FPS = 15;
const SPF = 1000/FPS;

const BOUNDS = {
    north: -27.28831571374801,
    south: -27.379767219135722,
    east: -55.80048608276117,
    west: -55.92708070367843,
}

const SELECT_ZOOM = 16;

const ColectuberMap = ({
    className
})=>{
    //INITIAL VALUES
    const mapParams = useMemo(()=>{
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
    
    //DATA
    const dataContext = useDataContext();

    //Selection and Panning
    const selectionContext = useSelectionContext();
    const mapRef = useRef();
    
    const moveToMarker = (position, zoom = undefined)=>{
        let map = mapRef.current;
        if(!map) return;
        if(zoom) map.setZoom(zoom);
        map.panTo(position);
    }

    useEffect(()=>{
        let id = selectionContext.selectedMarker;
        if(!id) return;

        let markerPosition;
        if(id.startsWith("c-")){
            //es un colectivo
            let colectivo = dataContext.colectivosLocation[id];
            if(!colectivo) return;
            markerPosition = colectivo.position;
        }else if(id.startsWith("p-")){
            //es una parada
            let parada = dataContext.paradas[id];
            markerPosition = parada.position;
        }

        moveToMarker(markerPosition, SELECT_ZOOM);

    },[selectionContext.selectedMarker])

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
        dataContext.moveColectivos(delta);
    }
    
    //RENDER
    const renderColectivos = ()=>{
        return Object.values(dataContext.colectivos)
        .filter((colectivo)=>{
            let colectivoData = dataContext.colectivosData[colectivo.id];
            let colectivoLocation = dataContext.colectivosLocation[colectivo.id];
            return (colectivoData && colectivoLocation);
        })
        .map((colectivo)=>{
            let colectivoData = dataContext.colectivosData[colectivo.id];
            let colectivoLocation = dataContext.colectivosLocation[colectivo.id];

            return <ColectivoMarker
                key={colectivo.id}
                colectivoEntity={colectivo}
                colectivoData={colectivoData}
                colectivoLocation={colectivoLocation}
            />
        })
    }

    const renderParadas = ()=>{
        return Object.values(dataContext.paradas).map((parada)=>{
            return <ParadaMarker
                key={parada.id}
                paradaEntity={parada}
            />
        })
    }

    const renderRecorridos = ()=>{
        return Object.values(dataContext.recorridos).map((recorrido)=>{
            return <RecorridoLine
                key={recorrido.id}
                recorridoEntity={recorrido}
            />
        })
    }

    const renderUser = ()=>{
        return <UserMarker/>
    }

    //Return
    return (
        <div className={styles.container + " " + className}>
            <GoogleMap
                center={mapParams.center}
                zoom={mapParams.zoom}
                mapContainerClassName={mapParams.mapContainerClassName}
                options={mapParams.options}
                onLoad={(mapEntity)=>{
                    mapRef.current = mapEntity;
                }}
            >
                {renderColectivos()}
                {renderParadas()}
                {renderRecorridos()}
                {renderUser()}
            </GoogleMap>
        </div>
    );
}

export default ColectuberMap;