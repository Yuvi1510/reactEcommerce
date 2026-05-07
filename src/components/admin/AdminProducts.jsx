import { useEffect, useState } from 'react';
import baseApi from '../../js/BaseApi';
import { 
  Search, 
  Filter, 
  Package, 
  Edit, 
  Trash2, 
  Eye,
  Plus,
  RefreshCw,
  Image as ImageIcon,
  Tag,
  DollarSign,
  Box,
  Star,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function AdminProducts({products}) {
//   const [products, setProducts] = useState([]);
const [filteredProducts, setFilteredProducts] = useState([]);
const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [error, setError] = useState(null);

  const tabs = [
    { id: 'all', label: 'All Products', icon: Package, count: products.length },
    { id: 'low-stock', label: 'Low Stock', icon: AlertCircle, count: products.filter(p => p.quantity < 10).length },
    { id: 'out-of-stock', label: 'Out of Stock', icon: Box, count: products.filter(p => p.quantity === 0).length },
    { id: 'in-stock', label: 'In Stock', icon: Package, count: products.filter(p => p.quantity > 0).length }
];


  useEffect(() => {
    filterProducts();
  }, [activeTab, products, searchTerm]);

  const filterProducts = () => {
    let filtered = products;
    
    // Filter by tab
    if (activeTab === 'low-stock') {
      filtered = filtered.filter(p => p.quantity < 10 && p.quantity > 0);
    } else if (activeTab === 'out-of-stock') {
      filtered = filtered.filter(p => p.quantity === 0);
    } else if (activeTab === 'in-stock') {
      filtered = filtered.filter(p => p.quantity > 0);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.productId?.toString().includes(searchTerm)
      );
    }
    
    setFilteredProducts(filtered);
  };

  const deleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await baseApi.delete(`/admin/products/${productId}`);
        setProducts(products.filter(p => p.productId !== productId));
        toast.success("Product deleted successfully!", { autoClose: 1000 });
      } catch (error) {
        console.error('Failed to delete product:', error);
        toast.error("Failed to delete product", { autoClose: 1000 });
      }
    }
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) {
      return { label: 'Out of Stock', color: 'bg-red-100 text-red-700', icon: AlertCircle };
    } else if (quantity < 10) {
      return { label: 'Low Stock', color: 'bg-amber-100 text-amber-700', icon: AlertCircle };
    } else {
      return { label: 'In Stock', color: 'bg-emerald-100 text-emerald-700', icon: Package };
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getPrimaryImage = (images) => {
    if (!images || images.length === 0) return null;
    const primary = images.find(img => img.primary === true);
    return primary || images[0];
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-500 mt-1">Manage all products across your store.</p>
          </div>
          {/* <div className="flex gap-3">
            <button 
              onClick={fetchProducts}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all">
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div> */}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl font-medium">
            {error}
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by product name, brand, SKU, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <nav className="flex flex-wrap gap-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200
                    ${activeTab === tab.id
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  <span className={`
                    ml-1 px-2 py-0.5 rounded-full text-xs font-bold
                    ${activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-600'
                    }
                  `}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <svg className="animate-spin h-10 w-10 text-emerald-500 mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-500 font-medium animate-pulse">Loading products...</p>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.quantity);
                const StockIcon = stockStatus.icon;
                const primaryImage = getPrimaryImage(product.images);
                
                return (
                  <div key={product.productId} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all duration-300 flex flex-col">
                    {/* Product Image */}
                    <div className="aspect-square bg-gray-100 relative overflow-hidden">
                      {primaryImage ? (
                        <img 
                          src={`http://localhost:8082/images/${primaryImage.imageName}`} 
                          alt={primaryImage.altText || product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-100">
                          <ImageIcon className="w-16 h-16" />
                        </div>
                      )}
                      
                      {/* Stock Badge */}
                      <div className="absolute top-3 right-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-white/90 rounded-lg shadow-sm backdrop-blur-sm ${stockStatus.color}`}>
                          <StockIcon className="w-3 h-3" />
                          {stockStatus.label} {product.quantity > 0 && `(${product.quantity})`}
                        </span>
                      </div>
                    </div>
                    
                    {/* Product Details */}
                    <div className="p-5 flex-1 flex flex-col">
                      {product.brand && (
                        <div className="flex items-center gap-1 mb-2">
                          <Tag className="w-3 h-3 text-emerald-500" />
                          <span className="text-xs font-medium text-emerald-600 uppercase tracking-wider">
                            {product.brand}
                          </span>
                        </div>
                      )}
                      
                      <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      
                      {product.description && (
                        <p className="text-sm text-gray-500 line-clamp-2 mb-3 flex-1">
                          {product.description}
                        </p>
                      )}
                      
                      {/* Product Meta Info */}
                      <div className="space-y-1 mb-4">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Box className="w-3 h-3" />
                          <span>SKU: {product.sku}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Star className="w-3 h-3" />
                          <span>ID: #{product.productId}</span>
                        </div>
                      </div>
                      
                      {/* Price and Actions */}
                      <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div>
                          <span className="text-xl font-extrabold text-gray-900">
                            {formatCurrency(product.price)}
                          </span>
                          {product.quantity > 0 && product.quantity < 10 && (
                            <p className="text-xs text-amber-600 mt-1">
                              Only {product.quantity} left!
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button 
                            className="p-2 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="View Product"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button 
                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => deleteProduct(product.productId)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                  {searchTerm ? 'No products match your search criteria.' : 'No products available in this category.'}
                </p>
              </div>
            )}
          </>
        )}
        
        {/* Summary Cards */}
        {!isLoading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-4 text-white">
              <p className="text-sm opacity-90">Total Products</p>
              <p className="text-2xl font-bold">{products.length}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-4 text-white">
              <p className="text-sm opacity-90">Total Value</p>
              <p className="text-2xl font-bold">{formatCurrency(products.reduce((sum, p) => sum + (p.price * p.quantity), 0))}</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white">
              <p className="text-sm opacity-90">Low Stock Items</p>
              <p className="text-2xl font-bold">{products.filter(p => p.quantity < 10 && p.quantity > 0).length}</p>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-4 text-white">
              <p className="text-sm opacity-90">Out of Stock</p>
              <p className="text-2xl font-bold">{products.filter(p => p.quantity === 0).length}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}