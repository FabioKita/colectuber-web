import { InfoWindow, Marker } from '@react-google-maps/api';
import React, {useState, useEffect, useReducer, useRef} from 'react';
import { useDataContext } from 'src/context/data-context-provider';
import { useSelectionContext } from 'src/context/selection-context-provider';
import ExtraInfoWindow from './extra-info-window';

const MARKER_SIZE = 32;
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

const ColectivoMarker = ({
    colectivoEntity,
    colectivoData,
    colectivoLocation
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
    },[selectionContext.selectedMarker, selectionContext.filter, colectivoData])

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
            if(colectivoData.isColectivoBeforeParada(parada.id)){
                return dispatch({ type:ACTION.RELATE, relatedEntity:parada })
            }
        }

        return dispatch({ type:ACTION.HIDE });
    }

    const select = ()=>{
        selectionContext.selectMarker(colectivoEntity.id);
    }

    const deselect = ()=>{
        selectionContext.deselectMarker(colectivoEntity.id);
    }

    const unmount = ()=>{
        selectionContext.removeFromFilter(colectivoEntity.id);
        selectionContext.deselectMarker(colectivoEntity.id);
    }

    const renderMarker = (size, hidden = false)=>{
        return <Marker
            position={colectivoLocation.position}
            icon={{
                url:`markers/colectivo/colectivo-${colectivoData.recorrido.color}.svg`,
                scaledSize:new google.maps.Size(size, size),
                anchor:new google.maps.Point(size/2, size/2),
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
            position={colectivoLocation.position}
            onCloseClick={deselect}
            options={{
                pixelOffset:new google.maps.Size(0, -25),
                disableAutoPan:true
            }}
        >
            <div>
                <h1>Colectivo N°{colectivoEntity.number} </h1>
                <p>Linea {colectivoEntity.line}</p>
                <p>Destino: {colectivoData.destination}</p>
                <p>{colectivoEntity.company}</p>
            </div>
        </InfoWindow>
    }

    const renderExtraInfoWindow = ()=>{
        let [distance, time] = colectivoData.getDistanceAndTimeToParada(state.relatedEntity.id);
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
            markerId={colectivoEntity.id}
            position={colectivoLocation.position}
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

export default ColectivoMarker;