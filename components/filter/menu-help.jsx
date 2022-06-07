import Image from 'next/image';
import React, { useRef, useEffect, useState } from 'react';
import styles from 'styles/menu.module.scss'

const MenuHelp = () => {
    return <div className={styles.MenuHelp}>
        <div className={styles.Image}>
            <Image src={"/logo.png"} height={254} width={328}/>
        </div>
        <p>
            <b>Colectúber</b> es una Aplicación Web que te permite ver las posiciones e información de los colectivos, 
            paradas, líneas, recorridos, etc.; todo esto en tiempo real.
        </p>
        <p>
            Comienza clickeando algún marcador dentro del mapa para ver más información sobre el mismo.
        </p>
    </div>
}

export default MenuHelp;