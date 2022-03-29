import { InfoWindow, Marker } from '@react-google-maps/api';
import React, {useState} from 'react';

const MARKER_SIZE = 56;
const MARKER_ZINDEX = 100;

const ColectivoMarker = ({
    colectivoEntity,
    selected,
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
                    <h1> {colectivoEntity.id} </h1>
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
                zIndex:MARKER_ZINDEX
            }}
            onClick={onClick}
        />
        {renderInfoIfSelected()}
    </>
}

export default ColectivoMarker;