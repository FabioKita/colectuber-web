import React, {useState, useEffect, useRef, useMemo} from 'react';
import { Circle, GoogleMap, Marker, Polyline } from '@react-google-maps/api';
import styles from 'styles/colectuber-map.module.scss'
import ColectivoEntity from 'src/beans/colectivoEntity';

const FPS = 60;
const SPF = 1000/FPS;

const ColectuberMap = ({
    className,
    initialValues,
    fetchedColectivos
})=>{
    //Initial Values
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

        let retValues;
        if (initialValues && typeof initialValues === 'object'){
            retValues = {...retValues, ...initialValues};
        }else{
            retValues = DEF_VALUES
        }
        return retValues;
    },[]);

    //COLECTIVO
    const [colectivos, setColectivos] = useState({});

    const createOrUpdateColectivos = (prevColectivos)=>{
        let newColectivos = {};

        fetchedColectivos.forEach((fetchedColectivo)=>{
            let colectivo = prevColectivos[fetchedColectivo.id];
            
            if(colectivo){
                colectivo.updatePosition(fetchedColectivo.position);
                newColectivos[colectivo.id] = colectivo;
            }else{
                //Create new Colectivo
                let newColectivo = new ColectivoEntity(fetchedColectivo.id, fetchedColectivo.position);
                newColectivos[newColectivo.id] = newColectivo;
            }
        })
        return newColectivos;
    }

    useEffect(()=>{
        setColectivos(createOrUpdateColectivos);
    },[fetchedColectivos])

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

    //step interpolation
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

    //RENDER
    //Render Colectivos
    const renderColectivos = ()=>{
        return Object.values(colectivos).map((colectivo)=>{
            return <Marker
                key={`marker-${colectivo.id}}`}
                position={colectivo.position}
                icon={{
                    url:`test-icons/test_icon_${colectivo.id%5}.png`,
                    scaledSize:new google.maps.Size(64, 64),
                    anchor:new google.maps.Point(32, 32),
                }}
            />
        })
    }

    const renderCircle = ()=>{
        return fetchedColectivos.map((fetchedColectivo)=>{
            return <Circle
                key={`circle-${fetchedColectivo.id}`}
                center = {{
                    lat: fetchedColectivo.position.lat,
                    lng: fetchedColectivo.position.lng
                }}
                radius={5}
            />
        })
    }

    return (
        <div className={styles.container + " " + className}>
            <GoogleMap
                center={mapParams.center}
                zoom={mapParams.zoom}
                mapContainerClassName={mapParams.mapContainerClassName}
                options={mapParams.options}
            >
                {renderColectivos()}
                {renderCircle()}
            </GoogleMap>
        </div>
    );
}

export default ColectuberMap;