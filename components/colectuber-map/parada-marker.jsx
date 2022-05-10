import { InfoWindow, Marker, OverlayView } from '@react-google-maps/api';
import React, {useState, useEffect, useReducer} from 'react';
import { useDataContext } from 'src/context/data-context-provider';
import { useSelectionContext } from 'src/context/selection-context-provider';
import ExtraInfoWindow from './extra-info-window';

const MARKER_SIZE = 24;

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
        let id = selectionContext.selectedMarker;
        if(!id){
            return dispatch({ type:ACTION.SHOW });
        }else if(id == paradaEntity.id){
            return dispatch({ type:ACTION.SELECT });
        }else if(id.startsWith("c-")){
            let colectivo = dataContext.colectivos[id];
            if(colectivo.isColectivoBeforeParada(paradaEntity.id)){
                return dispatch({ type:ACTION.RELATE, relatedEntity:colectivo })
            }
        }
        return dispatch({ type:ACTION.HIDE });
    },[selectionContext.selectedMarker, dataContext])

    const select = ()=>{
        selectionContext.selectMarker(paradaEntity.id);
    }

    const deselect = ()=>{
        selectionContext.deselectCurrent();
    }

    const renderMarker = (hidden = false)=>{
        return <Marker
            position={paradaEntity.position}
            icon={{
                url:`markers/parada.svg`,
                scaledSize:new google.maps.Size(MARKER_SIZE, MARKER_SIZE),
                anchor:new google.maps.Point(MARKER_SIZE/2, MARKER_SIZE/2)
            }}
            opacity={hidden?0.5:1}
            onClick={select}
            onUnmount={deselect}
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
        let [distance, time] = state.relatedEntity.getDistanceAndTimeToParada(paradaEntity.id);
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

    return renderAccordingToState();
}

export default ParadaMarker;