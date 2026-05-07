import { useEffect, useState } from 'react'
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
import ProductDetail from './components/common/ProductDetail';
import baseApi from './js/BaseApi';
import ScrollToTop from './components/common/ScrollToTop';
import Cart from './pages/user/Cart';
import AddressContact from './pages/user/AddressContact';
import Payment from './pages/user/Payment';
import CarouselForm from './components/admin/CarouselForm';
import AdminDashboard from './components/admin/AdminDashboard';
import Users from './components/admin/Users';
import EditProduct from './pages/vendor/EditProduct';
import MyOrders from './pages/user/MyOrders';
import AdminProducts from './components/admin/AdminProducts';
import AdminOrders from './components/admin/AdminOrders';
import Stores from './components/admin/Stores';

function App() {

  const [categories, setCategories] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
   const [products, setProducts] = useState([]);
 
  useEffect(()=>{
    const fetchProducts = async () =>{
      try{
        const response = await baseApi.get("/products");
        console.log(response.data);
        setProducts(response.data.content);
        setFeaturedProducts(response.data.content.slice(0, 4));
      }catch(error){
        console.log(error);
      }
    }
    fetchProducts();
  },[]);

    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const res = await baseApi.get("/categories");
          setCategories(res.data);
        } catch (err) {
          console.error("Failed to fetch categories:", err);
        }
      };
      fetchCategories();
    }, []);

  return (
    <BrowserRouter>
    <ScrollToTop/>
    <ToastContainer />
     
      <Routes>
        {/* routes for user page  */}
        <Route path="/" element={<UserPage  categories={categories} featuredProducts={featuredProducts}/>} >
          <Route index element={<Index categories={categories} featuredProducts={featuredProducts}/>}/>
          <Route path="/products" element={<Products products={products}/>}/>
          <Route path="/categories" element={<Categories Categories={categories} products={products} />}>
            <Route path=":categoryId" element={<Categories Categories={categories} products={products} />} />
          </Route>
          <Route path='/cart' element={<Cart/>}></Route>
          <Route path='/address' element={<AddressContact/>}></Route>
          <Route path='/payment' element={<Payment/>}></Route>
          <Route path="/about" element={<About/>}></Route>
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/register' element={<Register/>}></Route>
          <Route path='/store-registration' element={<StoreRegistration/>}></Route>
          <Route path='/products/:productId' element={<ProductDetail/>}></Route>
          <Route path='/orders' element={<MyOrders/>}></Route>
        </Route>
        
          
          {/* routes for vendor page  */}
        <Route path='/vendor' element={<VendorPage/>}>
          <Route index element={<VendorDashboard/>}></Route>
          <Route path='add-product' element={<AddProduct/>}></Route>
          <Route path='products' element={<VendorProducts/>}></Route>
          <Route path='orders' element={<Orders/>}></Route>
          <Route path='products/edit/:productId' element={<EditProduct/>}></Route>
        </Route>
        
        {/* routes for admin page  */}
        <Route path='/admin' element={<AdminPage />}>
  <Route index path='dashboard' element={<AdminDashboard />} />
  <Route path='carousel' element={<CarouselForm />} />
  <Route path='products' element={<AdminProducts products={products} />} />
  <Route path='orders' element={<AdminOrders />} />
  <Route path='users' element={<Users />} />
  <Route path='stores' element={<Stores/>} />
</Route>
      </Routes>
    
    </BrowserRouter>
  )
}

export default App
