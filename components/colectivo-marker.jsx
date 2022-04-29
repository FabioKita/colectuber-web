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
                url:`markers/colectivo/colectivo-${colectivoEntity.recorrido.color}.svg`,
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
                <h1>Colectivo N°{colectivoEntity.number} </h1>
                <p>Linea {colectivoEntity.line}</p>
                <p>Destino: {colectivoEntity.destination}</p>
                <p>{colectivoEntity.company}</p>
            </div>
        </InfoWindow>
    }

    const renderExtraInfoWindow = ()=>{
        let [distance, time] = colectivoEntity.getDistanceAndTimeToParada(state.relatedEntity.id);
        let renderDistance, renderTime;

        //Process distance
        if(distance > 1000){
            renderDistance = "Aprox. " + Math.round(distance/100)/10 + "Km";
        }else if (distance > 100){
            renderDistance = "Aprox. " + Math.round(distance/100)*100 + "m";
        }else{
            renderTime = "Menos de 100m";
        }

        //Process time
        if(time > 3600){
            renderTime = "Aprox. " + Math.round(time/3600) + "h";
        }else if(time > 60){
            renderTime = "Aprox. " + Math.round(time/60) + "min";
        }else{
            renderTime = "Menos de 1min";
        }
        
        return <ExtraInfoWindow
            position={colectivoEntity.position}
        >
            <div>
                <b>Distancia:</b> {renderDistance}
            </div>
            <div>
                <b>Tiempo:</b> {renderTime}
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