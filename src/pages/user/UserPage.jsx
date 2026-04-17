import { Routes, Route, Outlet  } from 'react-router-dom';

import Navbar from '../../components/common/navbax';
import Footer from '../../components/common/Footer';

export default function UserPage(){
    return(
    <>
     <Navbar/>
      <Outlet/>
      <Footer/>
    </>
    
    );
}