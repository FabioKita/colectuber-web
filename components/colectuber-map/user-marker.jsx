import { InfoWindow, Marker } from '@react-google-maps/api';
import React, {useState, useEffect, useReducer} from 'react';
import { useSelectionContext } from 'src/context/selection-context-provider';
import { useUserLocationContext } from 'src/context/user-location-context-provider';

const MARKER_SIZE = 48;

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

    useEffect(()=>{
        let id = selectionContext.selectedMarker;
        if(!id){
            return dispatch({ type:ACTION.SHOW });
        }
        
        return dispatch({ type:ACTION.HIDE });
    },[selectionContext.selectedMarker])

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
        }
    }

    if(userLocationContext.lastKnownLocation){
        return renderAccordingToState();
    }else{
        return <></>
    }
}

export default UserMarker;