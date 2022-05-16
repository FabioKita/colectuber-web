import React,{useState} from 'react';
import MenuHeader from './menu-header';
import MenuPanel from './menu-panel';

const Menu = ()=>{
    const [show, setShow] = useState(false);
    
    const toggleShow = ()=>{
        setShow(prev=>!prev);
    }

    return <>
        <MenuHeader onClick={toggleShow} shown={show}/>
        <MenuPanel hidden={!show}/>
    </>
}

export default Menu;