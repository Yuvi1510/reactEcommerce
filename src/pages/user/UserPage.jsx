import { Routes, Route, Outlet  } from 'react-router-dom';

import Navbar from '../../components/common/navbax';
import Footer from '../../components/common/Footer';

export default function UserPage({categories, featuredProducts}){
    return(
    <>
     <Navbar categories={categories} />
      <Outlet />
      <Footer/>
    </>
    
    );
}