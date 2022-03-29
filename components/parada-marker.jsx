import { InfoWindow, Marker } from '@react-google-maps/api';
import React, {useState} from 'react';

const MARKER_SIZE = 56;

const ParadaMarker = ({
    paradaEntity
})=>{
    return <>
        <Marker
            position={paradaEntity.position}
            icon={{
                url:`test-icons/test_icon_0.png`,
                scaledSize:new google.maps.Size(MARKER_SIZE, MARKER_SIZE),
                anchor:new google.maps.Point(MARKER_SIZE/2, MARKER_SIZE/2),
            }}
        />
    </>
}

export default ParadaMarker;