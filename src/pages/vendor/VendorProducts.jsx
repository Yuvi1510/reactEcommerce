import React, { useState, useEffect } from 'react';
import baseApi from '../../js/BaseApi';
import { Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function VendorProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Hardcoded store ID as requested
  const [storeId, setStoreId] = useState(1);

  useEffect(() => {
    if (!storeId) return; 

    const fetchStoreProducts = async () => {
      try {
        setIsLoading(true);
        const res = await baseApi.get(`/stores/products`);
        
        // Handle common API response patterns for "store" endpoint
        // It might return an array of products directly, or a store object with a products array.
        let fetchedProducts = [];
        if (Array.isArray(res.data)) {
            fetchedProducts = res.data;
        } else if (res.data && Array.isArray(res.data.products)) {
            fetchedProducts = res.data.products;
        } else if (res.data) {
            // Unlikely but if it's a single item wrap it or fallback
            fetchedProducts = [res.data];
        }

        console.log(res.data);

        setProducts(fetchedProducts);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Could not load products. Please check the network or server.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreProducts();
  }, [storeId]);

  const deleteProduct = async (productId) => {
    try {
      await baseApi.delete(`/products/${productId}`);
      setProducts(products.filter(p => p.productId !== productId));
      toast.success("Product deleted Successfully!", {
    autoClose: 1000 // 1 second
})
    } catch (err) {
      console.error("Failed to delete product", err);
      toast.error("Failed to delete product", {
    autoClose: 1000 // 1 second
});
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
              Your Products
            </h1>
            <p className="mt-3 text-lg text-zinc-500">
              Manage and view all the products currently listed in your store.
            </p>
          </div>
          <button className="px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-200">
            Export List
          </button>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl font-medium">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <svg className="animate-spin h-10 w-10 text-emerald-500 mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-zinc-500 font-medium animate-pulse">Loading products...</p>
          </div>
        ) : products.length === 0 && !error ? (
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 p-16 text-center">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-zinc-800 mb-2">No products found</h3>
            <p className="text-zinc-500 max-w-sm mx-auto mb-8">
              You haven't listed any products yet. Add your first product to start selling!
            </p>
            <a href="/vendor/add-product" className="inline-block px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-200">
              Add New Product
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <div key={product.id || index} className="group bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all duration-300 flex flex-col">
                <div className="aspect-square bg-zinc-100 relative overflow-hidden">
                  {/* Fallback image if product doesn't have an image or images array */}
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={`${baseApi.defaults.baseURL}/images/${product.images[0].imageName}`} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-300 bg-zinc-100">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {/* Stock badge */}
                  {(product.quantity !== undefined || product.stock !== undefined) && (
                    <div className="absolute top-3 right-3">
                      {(product.quantity > 0 || product.stock > 0) ? (
                        <span className="px-2.5 py-1 text-xs font-bold bg-white/90 text-emerald-600 rounded-lg shadow-sm backdrop-blur-sm">
                          In Stock ({product.quantity || product.stock})
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 text-xs font-bold bg-white/90 text-red-600 rounded-lg shadow-sm backdrop-blur-sm">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  {product.brand && (
                    <span className="text-xs font-bold tracking-wider text-emerald-600 uppercase mb-2">
                      {product.brand}
                    </span>
                  )}
                  <h3 className="text-lg font-bold text-zinc-800 leading-tight mb-2 line-clamp-2">
                    {product.name || 'Unnamed Product'}
                  </h3>
                  
                  {product.description && (
                    <p className="text-sm text-zinc-500 line-clamp-2 mb-4 flex-1">
                      {product.description}
                    </p>
                  )}
                  
                  <div className="mt-auto pt-4 border-t border-zinc-100 flex items-center justify-between">
                    <span className="text-xl font-extrabold text-zinc-900">
                      ${Number(product.price || 0).toFixed(2)}
                    </span>
                    <Link to={`/vendor/products/edit/${product.productId}`} 
                    className="p-2 text-zinc-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </Link>
                    <button
                      onClick={()=> deleteProduct(product.productId)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}