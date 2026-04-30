import { useParams, Outlet, Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import ProductDisplay from "../../components/common/ProductDisplay";
import baseApi from "../../js/BaseApi";
import { useDispatch } from "react-redux";

export default function Categories({ Categories = [], products = [] }) {
  const { categoryId } = useParams();
  const [selectedCategoryId, setSelectedCategoryId] = useState(categoryId || null);
  const [categoryName, setCategoryName] = useState("All");
  const [productsOfSelectedCategory, setProductsOfSelectedCategory] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
    const dispatch = useDispatch();
  // Check if mobile view
//   useEffect(() => {
//     const checkMobile = () => {
//       const mobile = window.innerWidth < 768;
//       setIsMobile(mobile);
//       if (!mobile) {
//         setIsSidebarOpen(true);
//       } else {
//         setIsSidebarOpen(false);
//       }
//     };
    
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

  // Update selected category when URL param changes
  useEffect(() => {
    if (categoryId) {
      setSelectedCategoryId(categoryId);
      if (isMobile) {
        setIsSidebarOpen(false);
      }
    } else {
      setSelectedCategoryId(null);
    }
  }, [categoryId, isMobile]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  useEffect(()=>{
    const fetchPorducts = async () => {
        if(selectedCategoryId != null){
            const res = await baseApi.get(`/products/categories/${selectedCategoryId}`)
        
                setProductsOfSelectedCategory(res.data.content);
                console.log(res.data)
            }
    }
    fetchPorducts();
  },[selectedCategoryId]);

  return (
  <div className="flex">

    {/* Sidebar */}
{ isSidebarOpen && (
    <div className="min-h-screen w-[260px] bg-white border-r border-gray-200 shadow-sm flex flex-col">

  {/* Header */}
  <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
    <h2 className="text-lg font-bold text-gray-800 tracking-wide">
      Categories
    </h2>

    <button
      onClick={toggleSidebar}
      className="hover:cursor-pointer md:hidden text-gray-500 hover:text-red-500 transition"
    >
      ✕
    </button>
  </div>

  {/* Category List */}
  <div className="flex-1 overflow-y-auto py-2">
      <NavLink
        key={"all"}
        to={`/categories`}
        end
        onClick={()=> {setSelectedCategoryId(null); setCategoryName("All");}}
        className={({ isActive }) =>
    isActive
      ? "flex items-center justify-between px-4 py-3 mx-2 my-1 rounded-lg text-white bg-green-500 transition group"
      : "flex items-center justify-between px-4 py-3 mx-2 my-1 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-green-700 transition group"
  }
      >
        {/* Left side */}
        <div className="flex items-center gap-3">
          {/* Icon placeholder */}
          <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-md group-hover:bg-green-50">
            🛒
          </div>

          <span className="text-sm font-medium">
            All Categories
          </span>
        </div>

        {/* Right arrow */}
        <span className="text-gray-400 group-hover:text-green-600 transition">
          →
        </span>
      </NavLink>
    {Categories.map((category) => (
      <NavLink
        key={category.categoryId}
        to={`${category.categoryId}`}
        onClick={()=> {setSelectedCategoryId(category.categoryId); setCategoryName(category.name);}}
        className={({ isActive }) =>
    isActive
      ? "flex items-center justify-between px-4 py-3 mx-2 my-1 rounded-lg text-white bg-green-500 transition group"
      : "flex items-center justify-between px-4 py-3 mx-2 my-1 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-green-700 transition group"
  }
      >
        {/* Left side */}
        <div className="flex items-center gap-3">
          {/* Icon placeholder */}
          <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-md group-hover:bg-green-50">
            🛒
          </div>

          <span className="text-sm font-medium">
            {category.name}
          </span>
        </div>

        {/* Right arrow */}
        <span className="text-gray-400 group-hover:text-green-600 transition">
          →
        </span>
      </NavLink>
    ))}
  </div>

  {/* Footer (optional) */}
  <div className="p-3 border-t border-gray-200 text-xs text-gray-500">
    Browse all collections
  </div>
</div>
)}

<div>
    <ProductDisplay 
    products={selectedCategoryId == null ? products : productsOfSelectedCategory}
    title={`${categoryName} Categories`} subtitle={`Explore our wide range of ${categoryName} Products.`} 
    />
</div>

  </div>
  );
}