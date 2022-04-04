import { InfoWindow, Marker } from '@react-google-maps/api';
import React, {useState, useEffect} from 'react';

const MARKER_SIZE = 56;

const ColectivoMarker = ({
    colectivoEntity,
    selected,
    hide,
    onClick,
    onCloseClick
})=>{
    const renderInfoIfSelected = ()=>{
        if (selected){
            return <InfoWindow 
                position={colectivoEntity.position}
                onCloseClick={onCloseClick}
                options={{
                    pixelOffset:new google.maps.Size(0, -25)
                }}
            >
                <div>
                    <h1> Colectivo N°{colectivoEntity.number} </h1>
                    <p>Linea N°{colectivoEntity.line}</p>
                    <p>Empresa {colectivoEntity.company}</p>
                </div>
            </InfoWindow>
        }else{
            return "";
        }
    }

    return <>
        <Marker
            position={colectivoEntity.position}
            icon={{
                url:`test-icons/test_icon_3.png`,
                scaledSize:new google.maps.Size(MARKER_SIZE, MARKER_SIZE),
                anchor:new google.maps.Point(MARKER_SIZE/2, MARKER_SIZE/2),
            }}
            options={{
                zIndex:1000
            }}
            opacity={hide?0.5:1}
            onClick={onClick}
            onUnmount={onCloseClick}
        />
        {renderInfoIfSelected()}
    </>
}

export default ColectivoMarker;