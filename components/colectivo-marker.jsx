import { InfoWindow, Marker } from '@react-google-maps/api';
import React, {useState} from 'react';

const MARKER_SIZE = 56;

const ColectivoMarker = ({
    colectivoEntity
})=>{

    return <>
        <Marker
            position={colectivoEntity.position}
            icon={{
                url:`markers/colectivo.svg`,
                scaledSize:new google.maps.Size(MARKER_SIZE, MARKER_SIZE),
                anchor:new google.maps.Point(MARKER_SIZE/2, MARKER_SIZE/2),
            }}
        />
    </>
}

export default ColectivoMarker;