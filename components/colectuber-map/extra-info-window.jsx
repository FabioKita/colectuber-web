import { OverlayView } from '@react-google-maps/api';
import React from 'react'
import styles from 'styles/extra-info-window.module.scss'
import {FaEllipsisH} from 'react-icons/fa'
import { useSelectionContext } from 'src/context/selection-context-provider';

const ExtraInfoWindow = ({
    children,
    markerId,
    position
})=>{
    const selectionContext = useSelectionContext();

    const offsetFunction = React.useCallback((w, h)=>{
        return {
            x: -w/2,
            y: -h-25
        }
    }, [])

    const select = ()=>{
        selectionContext.extraSelectMarker(markerId);
    }

    const deselect = ()=>{
        selectionContext.extraDeselectMarker(markerId);
    }

    const renderContent = ()=>{
        let selectedId = selectionContext.extraSelectedMarker;
        if(!selectedId || selectedId != markerId){
            return <div 
                className={styles.content + " " + styles.hidden}
                onClick={select}
            >
                <FaEllipsisH/>
            </div>
        }else{
            return <div 
                className={styles.content}
                onClick={deselect}
            >
                {children}
            </div>
        }
    }

    return <OverlayView
        position={position}
        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        getPixelPositionOffset={offsetFunction}
        onUnmount={deselect}
    >
        <div 
            className={styles.container}
        >
            {renderContent()}
        </div>
    </OverlayView>
}

export default ExtraInfoWindow;