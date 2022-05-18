import React,{useState} from 'react';
import { MenuProvider } from 'src/context/menu-context-provider';
import MenuHeader from './menu-header';
import MenuPanel from './menu-panel';

const Menu = ()=>{
    const [show, setShow] = useState(false);
    
    const toggleShow = ()=>{
        setShow(prev=>!prev);
    }

    return <MenuProvider>
        <MenuHeader onClick={toggleShow} shown={show}/>
        <MenuPanel hidden={!show}/>
    </MenuProvider>
}

export default Menu;