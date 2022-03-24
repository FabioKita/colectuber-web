import React, {useState, useEffect, useRef, useMemo} from 'react';
import { Circle, GoogleMap, Marker, Polyline } from '@react-google-maps/api';
import styles from 'styles/colectuber-map.module.scss'

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

    //Colectivo
    const [colectivos, setColectivos] = useState({});

    const createOrUpdateColectivos = (prevColectivos)=>{
        let newColectivos = {};

        fetchedColectivos.forEach((fetchedColectivo)=>{
            let colectivo = prevColectivos[fetchedColectivo.id];
            
            if(colectivo){
                colectivo.position = {...colectivo.position_to}
                colectivo.position_from  = {...colectivo.position_to}
                colectivo.position_to = {...fetchedColectivo.position}
            }else{
                //Create new Colectivo
                let newColectivo = {
                    id:fetchedColectivo.id,
                    position:{...fetchedColectivo.position},
                    position_from:{...fetchedColectivo.position},
                    position_to:{...fetchedColectivo.position},
                };

                newColectivos[newColectivo.id] = newColectivo;
            }
        })

        return newColectivos;
    }

    useEffect(()=>{
        setColectivos(createOrUpdateColectivos);
    },[fetchedColectivos])

    //INTERPOLATION
    const thenRef = useRef(0);

    useEffect(()=>{
        startInterpolation();
    },[]);

    const startInterpolation = ()=>{
        thenRef.current = Date.now();
        processInterpolation();
    }

    const processInterpolation = ()=>{
        requestAnimationFrame(processInterpolation)
        
        let now = Date.now();
        let enlapsed = now - thenRef.current;

        if (enlapsed > SPF){
            thenRef.current = now - (enlapsed%SPF);
            step(enlapsed);
        }
    }

    const step = (delta)=>{
        console.log("step: " + delta);
    }
    

    //RENDER
    //Render Colectivos
    const renderColectivos = ()=>{
        return Object.values(colectivos).map((colectivo)=>{
            return <Marker
                key={`marker-${colectivo.id}}`}
                position={{
                    lat:colectivo.position.lat,
                    lng:colectivo.position.lng
                }}
                icon={{
                    url:`test-icons/test_icon_${marker.id%5}.png`,
                    scaledSize:new google.maps.Size(64, 64),
                    anchor:new google.maps.Point(32, 32),
                }}
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
            </GoogleMap>
        </div>
    );
}

export default ColectuberMap;