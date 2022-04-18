import { InfoWindow, Marker } from '@react-google-maps/api';
import React, {useState, useEffect} from 'react';
import ExtraInfoWindow from './extra-info-window';

const MARKER_SIZE = 48;

const ColectivoMarker = ({
    colectivoEntity,
    state,
    onSelect,
    onDeselect
})=>{
    const renderMarker = (hidden = false)=>{
        return <Marker
            position={colectivoEntity.position}
            icon={{
                url:`markers/colectivo.svg`,
                scaledSize:new google.maps.Size(MARKER_SIZE, MARKER_SIZE),
                anchor:new google.maps.Point(MARKER_SIZE/2, MARKER_SIZE/2),
            }}
            options={{
                zIndex:1000,
            }}
            opacity={hidden?0.5:1}
            onClick={onSelect}
            onUnmount={onDeselect}
        />
    }

    const renderInfoWindow = ()=>{
        return <InfoWindow 
            position={colectivoEntity.position}
            onCloseClick={onDeselect}
            options={{
                pixelOffset:new google.maps.Size(0, -25),
                disableAutoPan:true
            }}
        >
            <div>
                <h1> Colectivo N°{colectivoEntity.number} </h1>
                <p>Linea N°{colectivoEntity.line}</p>
                <p>Empresa {colectivoEntity.company}</p>
            </div>
        </InfoWindow>
    }

    const renderExtraInfoWindow = ()=>{
        const renderDistance = ()=>{
            let distance = colectivoEntity.getDistanceToParada(state.relatedEntity.id);
            if (distance > 1000){
                distance = Math.trunc(distance/100)/10;
                return distance + "km"
            }else{
                distance = Math.trunc(distance);
                return distance + "m"
            }
        }
        
        return <ExtraInfoWindow
            position={colectivoEntity.position}
        >
            <div>
                Distancia: {renderDistance()}
            </div>
        </ExtraInfoWindow>
    }

    const renderAccordingToState = ()=>{
        switch(state.state){
            case "HIDDEN": 
                return renderMarker(true);
            case "SELECTED":
                return <>
                    {renderMarker()}
                    {renderInfoWindow()}
                </>
            case "RELATED":
                return <>
                    {renderMarker()}
                    {renderExtraInfoWindow()}
                </>
            default:
                return renderMarker();
        }
    }

    return renderAccordingToState();
}

export default ColectivoMarker;