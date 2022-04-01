import React, {useState} from 'react';
import { Polyline } from '@react-google-maps/api';

const RecorridoLine = ({
    recorridoEntity
})=>{
    return <>
        <Polyline
            path={recorridoEntity.getPath()}
        />
    </>
}

export default RecorridoLine;