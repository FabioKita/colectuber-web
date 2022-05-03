import { InfoWindow, Marker, OverlayView } from '@react-google-maps/api';
import React, {useState} from 'react';
import ExtraInfoWindow from './extra-info-window';

const MARKER_SIZE = 40;

const ParadaMarker = ({
    paradaEntity,
    state,
    onSelect,
    onDeselect
})=>{
    const renderMarker = (hidden = false)=>{
        return <Marker
            position={paradaEntity.position}
            icon={{
                url:`markers/parada.svg`,
                scaledSize:new google.maps.Size(MARKER_SIZE, MARKER_SIZE),
                anchor:new google.maps.Point(MARKER_SIZE/2, MARKER_SIZE/2)
            }}
            opacity={hidden?0.5:1}
            onClick={onSelect}
            onUnmount={onDeselect}
        />
    }

    const renderInfoWindow = ()=>{
        return <InfoWindow
            position={paradaEntity.position}
            onCloseClick={onDeselect}
            options={{
                pixelOffset:new google.maps.Size(0, -25),
                disableAutoPan:true
            }}
        >
            <div>
                <h1> {paradaEntity.name} </h1>
                <p> {paradaEntity.description} </p>
            </div>
        </InfoWindow>
    }
    
    const renderExtraInfoWindow = ()=>{
        let [distance, time] = state.relatedEntity.getDistanceAndTimeToParada(paradaEntity.id);
        let renderDistance, renderTime;

        //Process distance
        if(distance > 1000){
            renderDistance = "Aprox. " + Math.round(distance/100)/10 + "Km";
        }else if (distance > 100){
            renderDistance = "Aprox. " + Math.round(distance/100)*100 + "m";
        }else{
            renderDistance = "Menos de 100m";
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
            position={paradaEntity.position}
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

export default ParadaMarker;