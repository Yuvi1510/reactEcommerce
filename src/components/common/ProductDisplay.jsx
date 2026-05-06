import { NavLink } from "react-router-dom";
import baseApi from "../../js/BaseApi";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../js/cartSlice";
import { useState } from "react";

export default function ProductDisplay({ products, title, subtitle }) {

  const dispatch = useDispatch();
  const {items} = useSelector(state => state.cart)
  const [orderItems, setOrderItems] = useState([]);

  const addProductToCart = async (productId) => {
    console.log("Items in cart:", items);
    try {
      dispatch(addToCart(productId));
      const res = await baseApi.post(`/cart/add?productId=${productId}`);
      console.log(res.data);
      toast.success(res.data.message);
    } catch (error) {
      console.log(error)
      toast.error("Login to add product to cart!");
    }
  }

  const buyNow = async (productId, quantity) => {
    const item = { "productId": productId, "quantity": quantity };
    const updatedOrderItems = [...orderItems, item];
    setOrderItems(updatedOrderItems);
    console.log(updatedOrderItems) 
    try {
      // navigate("/payment");
      const res = await baseApi.post("/orders", updatedOrderItems);
      console.log(res.data);
      toast.success(res.data.message);
    } catch (error) {
      console.log(error)
      toast.error("Login to buy product!");
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-emerald-50/30 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Header Section */}
      {title && (
        <div className="max-w-7xl mx-auto mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-600 tracking-tight mb-2">
            {title}
          </h2>
          {subtitle && (
            <p className="text-md text-zinc-500 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product, index) => (
          <NavLink
            to={`/products/${product.productId}`}
            key={index}
            className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 transform hover:-translate-y-2 border border-zinc-100"
          >
            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                src={`${baseApi.defaults.baseURL}/images/${product.images[0].imageName}`}
                alt={product.alt || product.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop";
                }}
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-zinc-900 shadow-sm uppercase tracking-wider">
                New
              </div>
            </div>

            {/* Content Container */}
            <div className="p-6 flex flex-col flex-grow">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-zinc-900 mb-2 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                  {product.title}
                </h3>
                <p className="text-zinc-500 text-sm line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Price and Rating (Visual Additions) */}
              <div className="flex items-center justify-between mt-auto mb-6">
                <span className="text-2xl font-black text-zinc-900">
                  {product.price}
                </span>
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                  <svg
                    className="w-4 h-4 text-amber-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-bold text-amber-700">4.9</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    buyNow(product.productId, 1);
                  }}
                  className="hover:cursor-pointer flex-1 bg-zinc-900 text-white px-4 py-3 rounded-xl font-semibold hover:bg-emerald-600 transition-colors duration-300 shadow-md active:scale-95 flex justify-center items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  Buy Now
                </button>
                <button
                  onClick={(e) =>{
                    e.preventDefault();
                    e.stopPropagation();
                    dispatch(addToCart(product.productId))
                    addProductToCart(product.productId)
        
                  }}
                  className="hover:cursor-pointer flex-1 bg-white text-zinc-700 px-4 py-3 rounded-xl font-semibold hover:bg-zinc-50 transition-colors duration-300 active:scale-95 flex justify-center items-center gap-2 border border-zinc-200 hover:border-zinc-300 hover:text-zinc-900"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Cart
                </button>
              </div>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
