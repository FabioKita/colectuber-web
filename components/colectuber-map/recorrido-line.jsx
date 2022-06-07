import React, {useState, useEffect, useReducer, useMemo} from 'react';
import { Polyline } from '@react-google-maps/api';
import { useDataContext } from 'src/context/data-context-provider';
import { useSelectionContext } from 'src/context/selection-context-provider';

const ACTION = {
    SHOW:0,
    HIDE:1,
    SELECT:2,
    RELATE:3
}

const STATE = {
    SHOWN:0,
    HIDDEN:1,
    SELECTED:2,
    RELATED:3
}

const RecorridoLine = ({
    recorridoEntity
})=>{
    const dataContext = useDataContext();
    const selectionContext = useSelectionContext();

    const [state, dispatch] = useReducer((state, action)=>{
        switch(action.type){
            case ACTION.SHOW:{
                state.state = STATE.SHOWN;
                break;
            }
            case ACTION.HIDE:{
                state.state = STATE.HIDDEN;
                break;
            }
            case ACTION.SELECT:{
                state.state = STATE.SELECTED;
                break;
            }
            case ACTION.RELATE:{
                state.state = STATE.RELATED;
                state.relatedEntity = action.relatedEntity;
                break;
            }
        }
        return {...state};
    }, {
        state:STATE.SHOWN,
        relatedEntity:null
    })
    
    const handleStateChange = ()=>{
        const isFiltered = ()=>{
            if(!selectionContext.filter) return false;
            let shouldFilter = true;
            selectionContext.filter.forEach(id=>{
                if(id.startsWith("c-")){
                    let colectivoData = dataContext.colectivosData[id];
                    if(colectivoData && recorridoEntity.hasColectivo(colectivoData)){
                        shouldFilter = false;
                    }
                }else if(id.startsWith("p-")){
                    let parada = dataContext.paradas[id];
                    if(recorridoEntity.hasParada(parada)){
                        shouldFilter = false;
                    }
                }
            })
            return shouldFilter;
        }

        let id = selectionContext.selectedMarker;
        if(!id){
            //Se muestra
            if(isFiltered()) return dispatch({ type:ACTION.HIDE })
            return dispatch({ type:ACTION.SHOW });
        }else if(id.startsWith("c-")){
            let colectivo = dataContext.colectivos[id];
            let colectivoData = dataContext.colectivosData[id];
            if(recorridoEntity.hasColectivo(colectivoData)){
                return dispatch({ type:ACTION.RELATE, relatedEntity:colectivo });
            }
        }else if(id.startsWith("p-")){
            let parada = dataContext.paradas[id];
            if(recorridoEntity.hasParada(parada)){
                return dispatch({ type:ACTION.RELATE, relatedEntity:parada });
            }
        }

        return dispatch({ type:ACTION.HIDE });
    }

    useEffect(()=>{
        handleStateChange();
    },[selectionContext.selectedMarker, selectionContext.filter, dataContext.colectivosData])

    const drawLineWithPath = (path, hidden = false)=>{
        return <>
            <Polyline
                path={path}
                options={{
                    strokeColor:recorridoEntity.color,
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

    const drawLineWithRelatedEntity = ()=>{
        let relatedEntity = state.relatedEntity;
        if(relatedEntity.id.startsWith("p-")){
            //Es una parada
            return drawLineWithPath(recorridoEntity.getPathWithParada(relatedEntity.id));
        }else if(relatedEntity.id.startsWith("c-")){
            //Es un colectivo
            let colectivoLocation = dataContext.colectivosLocation[relatedEntity.id];
            if(!colectivoLocation) return <></>;
            return drawLineWithPath(recorridoEntity.getPathWithColectivo(colectivoLocation))
        }
    }

    const renderAccordingToState = ()=>{
        switch (state.state) {
            case STATE.HIDDEN:
                return drawLineWithPath(recorridoEntity.path, true);
            case STATE.RELATED:
                let relatedEntity = state.relatedEntity;
                return <>
                    {drawLineWithPath(recorridoEntity.path, true)}
                    {drawLineWithRelatedEntity()}
                </>
            case STATE.SHOWN:
                return drawLineWithPath(recorridoEntity.path);
        }
    }

    return renderAccordingToState();
}

export default RecorridoLine;