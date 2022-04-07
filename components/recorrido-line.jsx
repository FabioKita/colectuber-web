import React, {useState} from 'react';
import { Polyline } from '@react-google-maps/api';

const RecorridoLine = ({
    recorridoEntity,
    hide
})=>{
    return <>
        <Polyline
            path={recorridoEntity.getPath()}
            options={{
                strokeColor:'red',
                strokeOpacity:hide?0.2:1,
                strokeWeight:4
            }}
        />
        <Polyline
            path={recorridoEntity.getPath()}
            options={{
                strokeColor:'white',
                strokeOpacity:hide?0.1:1,
                strokeWeight:8,
                zIndex:-1000
            }}
        />
    </>
}

export default RecorridoLine;