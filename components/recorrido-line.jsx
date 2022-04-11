import React, {useState} from 'react';
import { Polyline } from '@react-google-maps/api';

const RecorridoLine = ({
    recorridoEntity,
    state
})=>{
    const drawLineWithPath = (path, hidden = false)=>{
        return <>
            <Polyline
                path={path}
                options={{
                    strokeColor:'red',
                    strokeOpacity:hidden?0.2:1,
                    strokeWeight:4,
                    zIndex:hidden?-1000:0
                }}
            />
            <Polyline
                path={path}
                options={{
                    strokeColor:'white',
                    strokeWeight:8,
                    strokeOpacity:hidden?0.2:1,
                    zIndex:-2000
                }}
            />
        </>
    }

    const renderAccordingToState = ()=>{
        switch (state.state) {
            case "HIDDEN":
                return drawLineWithPath(recorridoEntity.path, true);
            case "RELATED":
                let relatedEntity = state.relatedEntity;
                return <>
                    {drawLineWithPath(recorridoEntity.path, true)}
                    {drawLineWithPath(recorridoEntity.getPathWithRelatedEntity(relatedEntity))}
                </>
            default:
                return drawLineWithPath(recorridoEntity.path);
        }
    }

    return renderAccordingToState();
}

export default RecorridoLine;