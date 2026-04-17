import { useState } from 'react'
import './App.css'
import Navbar from './components/common/navbax'
import { Routes, Route, BrowserRouter  } from 'react-router-dom';
import Index from './pages/user';
import Footer from './components/common/Footer';
import Products from './pages/user/Products';
import Categories from './pages/user/Categories';
import About from './pages/user/About';
import Login from './pages/user/Login';
import Register from './pages/user/Register';
import AdminPage from './pages/admin/AdminPage';
import { ToastContainer } from "react-toastify";
import StoreRegistration from './pages/user/StoreRegistration';
import UserPage from './pages/user/UserPage';
import VendorPage from './pages/vendor/VendorPage';
import AddProduct from './pages/vendor/AddProduct';
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorProducts from './pages/vendor/VendorProducts';
import Orders from './pages/vendor/Orders';

function App() {

  return (
    <BrowserRouter>
    <ToastContainer />
     
      <Routes>
        {/* routes for user page  */}
        <Route path="/" element={<UserPage/>} >
          <Route index element={<Index/>}/>
          <Route path="/products" element={<Products/>}/>
          <Route path="/categories" element={<  Categories/>}></Route>
          <Route path="/about" element={<About/>}></Route>
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/register' element={<Register/>}></Route>
          <Route path='/admin' element={<AdminPage/>}></Route>
          <Route path='/store-registration' element={<StoreRegistration/>}></Route>
        </Route>
          
          {/* routes for vendor page  */}
        <Route path='/vendor' element={<VendorPage/>}>
          <Route index element={<VendorDashboard/>}></Route>
          <Route path='add-product' element={<AddProduct/>}></Route>
          <Route path='products' element={<VendorProducts/>}></Route>
          <Route path='orders' element={<Orders/>}></Route>
        </Route>
        
      </Routes>
    
    </BrowserRouter>
  )
}

export default App
