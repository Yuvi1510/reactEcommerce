import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import baseApi from "../../js/BaseApi";
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart } from "lucide-react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addToOrderList, removeFromOrderList, setOrderItems } from "../../js/OrderSlice";
import { clearCart, removeFromCart } from "../../js/cartSlice";

export default function Cart() {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const dispatch = useDispatch();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const debounceTimers = useRef({});

  const fetchCartItems = async () => {
    if(!isLoggedIn){
      toast.error("Please login to view cart");
      navigate("/");
      return;
    }
    try {
      
      const res = await baseApi.get("/cart");
      const itemsWithSelection = res.data.map(item => ({...item, isSelected: true}));
      setCartItems(itemsWithSelection);
      dispatch(setOrderItems(itemsWithSelection));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleQuantityChange = (cartItemId, productId, newQuantity) => {
    if (newQuantity < 1) return;

    // Optimistically update the UI
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.cartItemId === cartItemId) {
          return {
            ...item,
            quantity: newQuantity,
            totalPrice: newQuantity * item.unitPrice,
          };
        }
        return item;
      })
    );

    // Clear existing timer
    if (debounceTimers.current[productId]) {
      clearTimeout(debounceTimers.current[productId]);
    }

    // Set new timer
    debounceTimers.current[productId] = setTimeout(async () => {
      try {
        await baseApi.post(`/cart/add?productId=${productId}&quantity=${newQuantity}`);
        toast.success("Quantity updated", { autoClose: 1000 });
      } catch (error) {
        console.error("Failed to update quantity", error);
        toast.error("Failed to update quantity");
        // Fallback: fetch cart items again if it fails
        fetchCartItems();
      }
    }, 500);
  };

  // if checkbox is changed then that item should be added or removed from to order list
 const handleToggleSelection = (productId) => {
  setCartItems(prev => {
    const updatedItems = prev.map(item => {
      if (item.id === productId) {
        return { ...item, isSelected: !item.isSelected };
      }
      return item;
    });

    // 🔥 CORRECT WAY:
    // 1️⃣ Filter selected items
    const selectedItems = updatedItems.filter(item => item.isSelected);

    // 2️⃣ Dispatch SET action instead of individual ones
    dispatch(setOrderItems(selectedItems));

    return updatedItems;
  });
};

  const handleRemoveItem = async (cartItemId) => {
    try {
      setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
      dispatch(removeFromCart(cartItemId))
      await baseApi.delete(`/cart/remove/${cartItemId}`);
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Failed to remove item", error);
      toast.error("Failed to remove item");
      fetchCartItems(); // restore state on fail
    }
  };

  const handleClearCart = async () => {
    try {
      setCartItems([]);
      await baseApi.delete("/cart/clear");
      dispatch(clearCart());
      toast.success("Cart cleared");
    } catch (error) {
      console.error("Failed to clear cart", error);
      toast.error("Failed to clear cart");
      fetchCartItems(); // restore state on fail
    }
  };

  const calculateGrandTotal = () => {
    return cartItems
      .filter(item => item.isSelected)
      .reduce((total, item) => total + item.totalPrice, 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-zinc-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-emerald-50/30 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-600 tracking-tight mb-8">
          Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-12 text-center flex flex-col items-center border border-zinc-100">
            <ShoppingCart className="w-24 h-24 text-zinc-300 mb-6" />
            <h2 className="text-2xl font-bold text-zinc-700 mb-2">Your cart is empty</h2>
            <p className="text-zinc-500 mb-8">Looks like you haven't added any products yet.</p>
            <button
              onClick={() => navigate("/products")}
              className="bg-zinc-900 hover:bg-emerald-600 text-white font-semibold py-3 px-8 rounded-xl transition-colors duration-300 shadow-md active:scale-95"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-zinc-100">
                <div className="flex justify-between items-center p-6 border-b border-zinc-100">
                  <h2 className="text-xl font-bold text-zinc-800">Cart Items ({cartItems.length})</h2>
                  <button
                    onClick={handleClearCart}
                    className="text-red-500 hover:text-red-600 font-medium text-sm transition-colors px-3 py-1 rounded-lg hover:bg-red-50"
                  >
                    Clear All
                  </button>
                </div>
                
                <div className="divide-y divide-zinc-100">
                  {cartItems.map((item) => (
                    <div key={item.id} className={`p-6 flex flex-col sm:flex-row items-center gap-6 transition-colors ${item.isSelected ? 'hover:bg-zinc-50/50' : 'bg-zinc-50/50 opacity-60'}`}>
                      <input 
                        type="checkbox" 
                        checked={item.isSelected} 
                        onChange={() => handleToggleSelection(item.id)}
                        className="w-5 h-5 text-emerald-600 bg-white border-zinc-300 rounded focus:ring-emerald-500 focus:ring-2 cursor-pointer accent-emerald-600 shrink-0"
                      />
                      <div className="w-24 h-24 flex-shrink-0 bg-zinc-100 rounded-xl overflow-hidden shadow-inner">
                        <img
                          src={item.images && item.images.length > 0 ? `${baseApi.defaults.baseURL}/images/${item.images[0].imageName}` : "https://via.placeholder.com/150"}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop";
                          }}
                        />
                      </div>
                      
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-lg font-bold text-zinc-900 mb-1 line-clamp-1">{item.productName}</h3>
                        <p className="text-emerald-600 font-black">Rs. {item.unitPrice.toFixed(2)}</p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-zinc-200 rounded-xl bg-white shadow-sm overflow-hidden">
                          <button
                            onClick={() => handleQuantityChange(item.cartItemId, item.quantity - 1)}
                            className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-bold text-zinc-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.cartItemId,item.productId, item.quantity + 1)}
                            className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="w-28 text-right">
                          <p className="text-lg font-black text-zinc-900">
                            Rs. {item.totalPrice.toFixed(2)}
                          </p>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item.cartItemId)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sticky top-6 border border-zinc-100">
                <h2 className="text-xl font-bold text-zinc-800 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-zinc-600 font-medium">
                    <span>Subtotal</span>
                    <span>Rs. {calculateGrandTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600 font-medium">
                    <span>Shipping</span>
                    <span className="text-emerald-500 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">Free</span>
                  </div>
                  <div className="border-t border-zinc-100 pt-6 flex justify-between items-center mt-2">
                    <span className="text-lg font-bold text-zinc-900">Total</span>
                    <span className="text-3xl font-black text-emerald-600">
                      Rs. {calculateGrandTotal().toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (cartItems.some(item => item.isSelected)) {
                      navigate("/address");
                    } else {
                      toast.error("Please select at least one item to proceed.");
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-emerald-600 text-white font-bold py-4 px-6 rounded-xl transition-colors duration-300 shadow-md active:scale-95"
                >
                  Place Order <ArrowRight className="w-5 h-5" />
                </button>
                
                <p className="text-center text-xs font-medium text-zinc-400 mt-6 flex items-center justify-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                  Secure checkout
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}