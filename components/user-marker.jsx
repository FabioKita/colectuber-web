import { InfoWindow, Marker } from '@react-google-maps/api';
import React, {useState, useEffect} from 'react';

const MARKER_SIZE = 48;

const UserMarker = ({
    userEntity,
    state,
    onSelect,
    onDeselect
})=>{
    const renderMarker = (hidden = false)=>{
        return <Marker
            position={userEntity.position}
            icon={{
                url:`markers/user.svg`,
                scaledSize:new google.maps.Size(MARKER_SIZE, MARKER_SIZE),
                anchor:new google.maps.Point(MARKER_SIZE/2, MARKER_SIZE/2),
            }}
            options={{
                zIndex:2000,
            }}
            opacity={hidden?0.5:1}
        />
    }

    const renderAccordingToState = ()=>{
        switch(state.state){
            case "HIDDEN": 
                return renderMarker(true);
            default:
                return renderMarker();
        }
    }

    return renderAccordingToState();
}

export default UserMarker;