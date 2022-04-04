import { InfoWindow, Marker } from '@react-google-maps/api';
import React, {useState} from 'react';

const MARKER_SIZE = 56;

const ParadaMarker = ({
    paradaEntity,
    selected,
    hide,
    onClick,
    onCloseClick
})=>{
    const renderInfoIfSelected = ()=>{
        if (selected){
            return <InfoWindow 
                position={paradaEntity.position}
                onCloseClick={onCloseClick}
                options={{
                    pixelOffset:new google.maps.Size(0, -25)
                }}
            >
                <div>
                    <h1> {paradaEntity.name} </h1>
                    <p> {paradaEntity.description} </p>
                </div>
            </InfoWindow>
        }else{
            return "";
        }
    }

    return <>
        <Marker
            position={paradaEntity.position}
            icon={{
                url:`test-icons/test_icon_0.png`,
                scaledSize:new google.maps.Size(MARKER_SIZE, MARKER_SIZE),
                anchor:new google.maps.Point(MARKER_SIZE/2, MARKER_SIZE/2)
            }}
            opacity={hide?0.5:1}
            onClick={onClick}
        />
        {renderInfoIfSelected()}
    </>
}

export default ParadaMarker;