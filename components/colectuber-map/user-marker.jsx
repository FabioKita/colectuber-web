import { InfoWindow, Marker, Polyline } from '@react-google-maps/api';
import React, {useState, useEffect, useReducer} from 'react';
import { useDataContext } from 'src/context/data-context-provider';
import { useSelectionContext } from 'src/context/selection-context-provider';
import { useUserLocationContext } from 'src/context/user-location-context-provider';

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

const UserMarker = ()=>{
    const dataContext = useDataContext();
    const selectionContext = useSelectionContext();
    const userLocationContext = useUserLocationContext();

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

    const getNearestParada = (position, paradaList)=>{
        const getDistanceDirect = (pos1, pos2)=>{
            let dlat = pos1.lat-pos2.lat;
            let dlng = pos1.lng-pos2.lng;
            return Math.sqrt(dlat*dlat + dlng*dlng);
        }

        let nearest = {
            distance: undefined,
            parada: undefined
        }
        paradaList.forEach(parada=>{
            let newDistance = getDistanceDirect(position, parada.position);
            if(!nearest.parada){
                nearest.parada = parada;
                nearest.distance = newDistance;
            }else{
                if(nearest.distance > newDistance){
                    nearest.parada = parada;
                    nearest.distance = newDistance;
                }
            }
        });
        
        return nearest.parada;
    }

    const getNearestParadaFromColectivo = (position, colectivo)=>{
        let colectivoData = dataContext.colectivosData[colectivo.id];
        if(!colectivoData) return null;
        let paradaList = colectivoData.getParadasAfterColectivo();
        return getNearestParada(position, paradaList);
    }

    const getNearestParadaFromParada = (position, parada, recorridos)=>{
        let paradaList = parada.getParadasBeforeParada(recorridos);
        return getNearestParada(position, paradaList);
    }

    const handleStateChange = ()=>{
        if(!userLocationContext.lastKnownLocation) return dispatch({type:ACTION.HIDE});

        let id = selectionContext.selectedMarker;
        if(!id) return dispatch({type:ACTION.SHOW});
        else if(id.startsWith("p-")){
            //get nearest parada that get to selected parada;
            let parada = dataContext.paradas[id];
            let position = userLocationContext.lastKnownLocation;
            let nearestParada = getNearestParadaFromParada(position, parada, dataContext.recorridos);
            return dispatch({type:ACTION.RELATE, relatedEntity:nearestParada})
        }else if(id.startsWith("c-")){
            //get nearest parada that the selected colectivo will pass;
            let colectivo = dataContext.colectivos[id];
            let position = userLocationContext.lastKnownLocation;
            let nearestParada = getNearestParadaFromColectivo(position, colectivo);
            return dispatch({type:ACTION.RELATE, relatedEntity:nearestParada})
        }
        
        return dispatch({type:ACTION.HIDE});
    }

    useEffect(()=>{
        handleStateChange();
    },[selectionContext.selectedMarker, userLocationContext.lastKnownLocation, dataContext.colectivosData]);

    const renderLineToNearestParada = ()=>{
        if(!userLocationContext.lastKnownLocation || !state.relatedEntity){
            return <></>
        }else{
            return <Polyline
                path={[
                    userLocationContext.lastKnownLocation,
                    state.relatedEntity.position
                ]}
                options={{
                    strokeColor:'#666666',
                    strokeWeight:4
                }}
            />
        }
    }

    const renderMarker = (hidden = false)=>{
        return <Marker
            position={userLocationContext.lastKnownLocation}
            icon={{
                url:`markers/user.svg`,
                scaledSize:new google.maps.Size(MARKER_SIZE, MARKER_SIZE),
                anchor:new google.maps.Point(MARKER_SIZE/2, MARKER_SIZE/2),
            }}
            options={{
                zIndex:2000,
            }}
            opacity={hidden?0.5:1}
        />
    }

    const renderAccordingToState = ()=>{
        switch(state.state){
            case STATE.HIDDEN: 
                return renderMarker(true);
            case STATE.SHOWN:
                return renderMarker();
            case STATE.RELATED:
                return <>
                    {renderMarker()}
                    {renderLineToNearestParada()}
                </>;
        }
    }

    if(userLocationContext.lastKnownLocation){
        return renderAccordingToState();
    }else{
        return <></>
    }
}

export default UserMarker;