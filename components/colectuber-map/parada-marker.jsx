import { InfoWindow, Marker, OverlayView } from '@react-google-maps/api';
import React, {useState, useEffect, useReducer, useRef} from 'react';
import { useDataContext } from 'src/context/data-context-provider';
import { useSelectionContext } from 'src/context/selection-context-provider';
import ExtraInfoWindow from './extra-info-window';

const MARKER_SIZE = 24;
const SELECTED_SIZE = 48;

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

const ParadaMarker = ({
    paradaEntity
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
        handleStateChange();
    },[selectionContext.selectedMarker, selectionContext.filter, dataContext])

    const handleStateChange = ()=>{
        const isFiltered = ()=>{
            return (selectionContext.filter && !selectionContext.filter.includes(paradaEntity.id));
        }

        let id = selectionContext.selectedMarker;
        if(!id){
            if(isFiltered()) return dispatch({ type:ACTION.HIDE });
            return dispatch({ type:ACTION.SHOW });
        }else if(id == paradaEntity.id){
            return dispatch({ type:ACTION.SELECT });
        }else if(id.startsWith("c-")){
            let colectivo = dataContext.colectivos[id];
            let colectivoData = dataContext.colectivosData[id];
            if(!colectivo || !colectivoData){
                return dispatch({ type:ACTION.HIDE });
            }else if(colectivoData.isColectivoBeforeParada(paradaEntity.id)){
                return dispatch({ type:ACTION.RELATE, relatedEntity:colectivo })
            }
        }
        return dispatch({ type:ACTION.HIDE });
    }
    
    const select = ()=>{
        selectionContext.selectMarker(paradaEntity.id);
    }

    const deselect = ()=>{
        selectionContext.deselectMarker(paradaEntity.id);
    }

    const unmount = ()=>{
        selectionContext.removeFromFilter(paradaEntity.id);
        selectionContext.deselectMarker(paradaEntity.id);
    }

    const renderMarker = (size, hidden = false)=>{
        return <Marker
            position={paradaEntity.position}
            icon={{
                url:`markers/parada.svg`,
                scaledSize:new google.maps.Size(size, size),
                anchor:new google.maps.Point(size/2, size/2)
            }}
            opacity={hidden?0.5:1}
            onClick={select}
            onUnmount={unmount}
        />
    }

    const renderInfoWindow = ()=>{
        return <InfoWindow
            position={paradaEntity.position}
            onCloseClick={deselect}
            options={{
                pixelOffset:new google.maps.Size(0, -25),
                disableAutoPan:true
            }}
        >
            <div>
                <h1> {paradaEntity.name} </h1>
                <p> {paradaEntity.description} </p>
            </div>
        </InfoWindow>
    }
    
    const renderExtraInfoWindow = ()=>{
        let colectivoId = state.relatedEntity.id;
        let colectivoData = dataContext.colectivosData[colectivoId];
        if(!colectivoData) return <></>;

        let [distance, time] = colectivoData.getDistanceAndTimeToParada(paradaEntity.id);
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
            markerId={paradaEntity.id}
            position={paradaEntity.position}
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
                return renderMarker(MARKER_SIZE, true);
            case STATE.SELECTED:
                return <>
                    {renderMarker(SELECTED_SIZE)}
                    {renderInfoWindow()}
                </>
            case STATE.RELATED:
                return <>
                    {renderMarker(MARKER_SIZE)}
                    {renderExtraInfoWindow()}
                </>
            case STATE.SHOWN:
                return renderMarker(MARKER_SIZE);
        }
    }

    return renderAccordingToState();
}

export default ParadaMarker;