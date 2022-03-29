import { InfoWindow, Marker } from '@react-google-maps/api';
import React, {useState} from 'react';

const MARKER_SIZE = 56;
const MARKER_ZINDEX = 100;

const ColectivoMarker = ({
    colectivoEntity
})=>{
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
        />
    </>
}

export default ColectivoMarker;