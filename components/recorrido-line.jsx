import React, {useState} from 'react';
import { Polyline } from '@react-google-maps/api';

const RecorridoLine = ({
    recorridoEntity
})=>{
    return <>
        <Polyline
            path={recorridoEntity.getPath()}
            options={{
                strokeColor:'red',
                strokeWeight:6
            }}
        />
        <Polyline
            path={recorridoEntity.getPath()}
            options={{
                strokeColor:'white',
                strokeWeight:10,
                zIndex:-1000
            }}
        />
    </>
}

export default RecorridoLine;