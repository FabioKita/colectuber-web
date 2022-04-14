import { OverlayView } from '@react-google-maps/api';
import React from 'react'
import styles from 'styles/extra-info-window.module.scss'

const ExtraInfoWindow = ({
    children,
    position
})=>{
    const offsetFunction = React.useCallback((w, h)=>{
        return {
            x: -w/2,
            y: -h-25
        }
    }, [])

    return <OverlayView
        position={position}
        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        getPixelPositionOffset={offsetFunction}
    >
        <div className={styles.container}>
            {children}
        </div>
    </OverlayView>
}

export default ExtraInfoWindow;