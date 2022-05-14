import { InfoWindow, Marker } from '@react-google-maps/api';
import React, {useState, useEffect, useReducer, useRef} from 'react';
import { useDataContext } from 'src/context/data-context-provider';
import { useSelectionContext } from 'src/context/selection-context-provider';
import ExtraInfoWindow from './extra-info-window';

const MARKER_SIZE = 32;

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

const ColectivoMarker = ({
    colectivoEntity
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

    useEffect(()=>{
        if(!colectivoEntity || !colectivoEntity.isValid()) return;
        handleStateChange();
    },[selectionContext.selectedMarker, selectionContext.filter, dataContext])

    const handleStateChange = ()=>{
        const isFiltered = ()=>{
            return (selectionContext.filter && !selectionContext.filter.includes(colectivoEntity.id));
        }

        let id = selectionContext.selectedMarker;
        if(!id){
            if(isFiltered()) return dispatch({ type:ACTION.HIDE });
            return dispatch({ type:ACTION.SHOW });
        }else if(id == colectivoEntity.id){
            return dispatch({ type:ACTION.SELECT });
        }else if(id.startsWith("p-")){
            let parada = dataContext.paradas[id];
            if(colectivoEntity.isColectivoBeforeParada(parada.id)){
                return dispatch({ type:ACTION.RELATE, relatedEntity:parada })
            }
        }

        return dispatch({ type:ACTION.HIDE });
    }

    //Debug
    const ref = useRef(false);

    const select = ()=>{
        if(selectionContext.filtrar){
            if(ref.current){
                selectionContext.removeFromFilter(colectivoEntity.id);
            }else{
                selectionContext.addToFilter(colectivoEntity.id);
            }
            ref.current = !ref.current;
        }else{
            selectionContext.selectMarker(colectivoEntity.id);
        }
    }

    const deselect = ()=>{
        selectionContext.deselectCurrent();
    }

    const unmount = ()=>{
        selectionContext.removeFromFilter(colectivoEntity.id);
        if (selectionContext.selectedMarker==colectivoEntity.id) selectionContext.deselectCurrent();
    }

    const renderMarker = (hidden = false)=>{
        return <Marker
            position={colectivoEntity.position}
            icon={{
                url:`markers/colectivo/colectivo-${colectivoEntity.recorrido.color}.svg`,
                scaledSize:new google.maps.Size(MARKER_SIZE, MARKER_SIZE),
                anchor:new google.maps.Point(MARKER_SIZE/2, MARKER_SIZE/2),
            }}
            options={{
                zIndex:1000,
            }}
            opacity={hidden?0.5:1}
            onClick={select}
            onUnmount={unmount}
        />
    }

    const renderInfoWindow = ()=>{
        return <InfoWindow 
            position={colectivoEntity.position}
            onCloseClick={deselect}
            options={{
                pixelOffset:new google.maps.Size(0, -25),
                disableAutoPan:true
            }}
        >
            <div>
                <h1>Colectivo N°{colectivoEntity.number} </h1>
                <p>Linea {colectivoEntity.line}</p>
                <p>Destino: {colectivoEntity.destination}</p>
                <p>{colectivoEntity.company}</p>
            </div>
        </InfoWindow>
    }

    const renderExtraInfoWindow = ()=>{
        let [distance, time] = colectivoEntity.getDistanceAndTimeToParada(state.relatedEntity.id);
        let renderDistance, renderTime;

        //Process distance
        if(distance > 1000){
            renderDistance = "Aprox. " + Math.round(distance/100)/10 + "Km";
        }else if (distance > 100){
            renderDistance = "Aprox. " + Math.round(distance/100)*100 + "m";
        }else{
            renderDistance = "Menos de 100m";
        }

        //Process time
        if(time > 3600){
            renderTime = "Aprox. " + Math.round(time/3600) + "h";
        }else if(time > 60){
            renderTime = "Aprox. " + Math.round(time/60) + "min";
        }else{
            renderTime = "Menos de 1min";
        }
        
        return <ExtraInfoWindow
            position={colectivoEntity.position}
        >
            <div>
                <b>Distancia:</b> {renderDistance}
            </div>
            <div>
                <b>Tiempo:</b> {renderTime}
            </div>
        </ExtraInfoWindow>
    }

    const renderAccordingToState = ()=>{
        switch(state.state){
            case STATE.HIDDEN: 
                return renderMarker(true);
            case STATE.SELECTED:
                return <>
                    {renderMarker()}
                    {renderInfoWindow()}
                </>
            case STATE.RELATED:
                return <>
                    {renderMarker()}
                    {renderExtraInfoWindow()}
                </>
            case STATE.SHOWN:
                return renderMarker();
        }
    }

    if(colectivoEntity && colectivoEntity.isValid()){
        return renderAccordingToState();
    }else{
        return <></>
    }
}

export default ColectivoMarker;