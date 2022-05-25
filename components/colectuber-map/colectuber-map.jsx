import React, {useState, useEffect, useRef, useMemo} from 'react';
import { Circle, GoogleMap, Marker, Polyline } from '@react-google-maps/api';
import styles from 'styles/colectuber-map.module.scss'
import ColectivoMarker from './colectivo-marker';
import ParadaMarker from './parada-marker';
import RecorridoLine from './recorrido-line';
import UserMarker from './user-marker';
import { useDataContext } from 'src/context/data-context-provider';

const FPS = 15;
const SPF = 1000/FPS;

const ColectuberMap = ({
    className
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

    //DATA
    const dataContext = useDataContext();

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
        return Object.values(dataContext.colectivos).map((colectivo)=>{
            return <ColectivoMarker
                key={colectivo.id}
                colectivoEntity={colectivo}
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