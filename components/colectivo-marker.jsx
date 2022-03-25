import { Marker } from '@react-google-maps/api';
import React from 'react';

const ColectivoMarker = ({
    coelctivoEntity
})=>{
    return <Marker
        position={coelctivoEntity.position}
        icon={{
            url:`test-icons/test_icon_${coelctivoEntity.id%5}.png`,
            scaledSize:new google.maps.Size(64, 64),
            anchor:new google.maps.Point(32, 32),
        }}
    />
}

export default ColectivoMarker;