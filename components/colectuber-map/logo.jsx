import Image from 'next/image';
import React from 'react';
import styles from 'styles/colectuber-map.module.scss'

const Logo = ()=>{
    return <div className={styles.Logo}>
        <Image src={"/Logo.svg"} width={150} height={75}/>
    </div>
}

export default Logo;