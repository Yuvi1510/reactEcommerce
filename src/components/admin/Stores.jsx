import { useEffect, useState } from 'react';
import baseApi from '../../js/BaseApi';
import { 
  Search, 
  RefreshCw,
  Store,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  MoreVertical,
  Users,
  Package,
  DollarSign,
  AlertCircle,
  X,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Tag,
  Box
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [error, setError] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [expandedProduct, setExpandedProduct] = useState(null);

  const tabs = [
    { id: 'all', label: 'All Stores', icon: Store, count: stores.length },
    { id: 'active', label: 'Active', icon: CheckCircle, count: stores.filter(s => s.isActive !== false).length },
    { id: 'inactive', label: 'Inactive', icon: XCircle, count: stores.filter(s => s.isActive === false).length }
  ];

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    filterStores();
  }, [activeTab, stores, searchTerm]);

  const fetchStores = async () => {
    try {
      setIsLoading(true);
      const res = await baseApi.get('/admin/stores');
      console.log("stores:", res.data);
      setStores(res.data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch stores:', error);
      setError("Could not load stores. Please check the network or server.");
      toast.error("Failed to load stores", { autoClose: 1000 });
    } finally {
      setIsLoading(false);
    }
  };

  const filterStores = () => {
    let filtered = stores;
    
    // Filter by tab
    if (activeTab === 'active') {
      filtered = filtered.filter(store => store.isActive !== false);
    } else if (activeTab === 'inactive') {
      filtered = filtered.filter(store => store.isActive === false);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(store => 
        store.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.storeId?.toString().includes(searchTerm)
      );
    }
    
    setFilteredStores(filtered);
  };

  const toggleStoreStatus = async (storeId, currentStatus) => {
    try {
      const action = currentStatus === false ? 'enable' : 'disable';
      await baseApi.put(`/admin/stores/${storeId}/${action}`);
      setStores(stores.map(store => 
        store.storeId === storeId ? { ...store, isActive: !currentStatus } : store
      ));
      toast.success(`Store ${action}d successfully`, { autoClose: 1000 });
    } catch (error) {
      console.error('Failed to update store status:', error);
      toast.error("Failed to update store status", { autoClose: 1000 });
    }
    setOpenDropdown(null);
  };

  const handleViewProducts = (store) => {
    setSelectedStore(store);
    setShowProductsModal(true);
    setExpandedProduct(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
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

  const toggleProductExpand = (productId) => {
    setExpandedProduct(expandedProduct === productId ? null : productId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openDropdown]);

  // Products Modal Component
  const ProductsModal = ({ store, onClose }) => {
    const products = store?.products || [];
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          {/* Modal Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Products of {store?.name}</h2>
              <p className="text-sm text-gray-500 mt-1">Store ID: #{store?.storeId}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            {products.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-500">This store hasn't added any products yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((product) => {
                  const primaryImage = getPrimaryImage(product.images);
                  const stockStatus = product.quantity === 0 ? 'Out of Stock' : product.quantity < 10 ? 'Low Stock' : 'In Stock';
                  const stockColor = product.quantity === 0 ? 'bg-red-100 text-red-700' : product.quantity < 10 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700';
                  
                  return (
                    <div key={product.productId} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                      <div className="flex">
                        {/* Product Image */}
                        <div className="w-32 h-32 bg-gray-100 flex-shrink-0">
                          {primaryImage ? (
                            <img 
                              src={`http://localhost:8082/images/${primaryImage.imageName}`}
                              alt={primaryImage.altText || product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <ImageIcon className="w-8 h-8" />
                            </div>
                          )}
                        </div>
                        
                        {/* Product Details */}
                        <div className="flex-1 p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">{product.name}</h4>
                              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                <Tag className="w-3 h-3" />
                                <span>SKU: {product.sku}</span>
                              </div>
                              {product.brand && (
                                <p className="text-xs text-emerald-600 mb-2">Brand: {product.brand}</p>
                              )}
                            </div>
                            <button
                              onClick={() => toggleProductExpand(product.productId)}
                              className="p-1 hover:bg-gray-100 rounded-lg transition-colors ml-2"
                            >
                              {expandedProduct === product.productId ? (
                                <ChevronUp className="w-4 h-4 text-gray-400" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                              )}
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-lg font-bold text-gray-900">
                              {formatCurrency(product.price)}
                            </span>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${stockColor}`}>
                              {stockStatus} {product.quantity > 0 && `(${product.quantity})`}
                            </span>
                          </div>
                          
                          {/* Expanded Details */}
                          {expandedProduct === product.productId && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              {product.description && (
                                <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                              )}
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <span className="text-gray-500">Product ID:</span>
                                  <span className="ml-1 text-gray-700">#{product.productId}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Quantity:</span>
                                  <span className="ml-1 text-gray-700">{product.quantity}</span>
                                </div>
                                {product.createdAt && (
                                  <div className="col-span-2">
                                    <span className="text-gray-500">Added on:</span>
                                    <span className="ml-1 text-gray-700">{new Date(product.createdAt).toLocaleDateString()}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-between items-center">
            <p className="text-sm text-gray-500">Total Products: {products.length}</p>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Store Management</h1>
            <p className="text-gray-500 mt-1">Manage all vendor stores across your platform.</p>
          </div>
          <button 
            onClick={fetchStores}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl font-medium">
            {error}
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by store name, email, phone, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
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
            <p className="text-gray-500 font-medium animate-pulse">Loading stores...</p>
          </div>
        ) : (
          <>
            {/* Stores Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredStores.map((store) => (
                <div key={store.storeId} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all duration-300">
                  {/* Store Header */}
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4 relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                          <Store className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{store.name}</h3>
                          <p className="text-xs text-white/80">Store ID: #{store.storeId}</p>
                        </div>
                      </div>
                      <div className="dropdown-container relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdown(openDropdown === store.storeId ? null : store.storeId);
                          }}
                          className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        
                        {openDropdown === store.storeId && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                            <button
                              onClick={() => {
                                handleViewProducts(store);
                                setOpenDropdown(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Package className="w-4 h-4" />
                              View Products ({store.products?.length || 0})
                            </button>
                            <hr className="my-1 border-gray-100" />
                            {store.isActive === false ? (
                              <button
                                onClick={() => toggleStoreStatus(store.storeId, false)}
                                className="w-full px-4 py-2 text-left text-sm text-emerald-600 hover:bg-emerald-50 flex items-center gap-2"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Enable Store
                              </button>
                            ) : (
                              <button
                                onClick={() => toggleStoreStatus(store.storeId, true)}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <XCircle className="w-4 h-4" />
                                Disable Store
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Store Details */}
                  <div className="p-5 space-y-3">
                    {/* Contact Information */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4 text-emerald-500" />
                        <span className="truncate">{store.email || 'No email provided'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4 text-emerald-500" />
                        <span>{store.phone || 'No phone provided'}</span>
                      </div>
                    </div>
                    
                    {/* Store Stats */}
                    <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Package className="w-3 h-3 text-gray-400" />
                          <p className="text-xs text-gray-500">Products</p>
                        </div>
                        <p className="text-lg font-bold text-gray-900">{store.products?.length || 0}</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <DollarSign className="w-3 h-3 text-gray-400" />
                          <p className="text-xs text-gray-500">Revenue</p>
                        </div>
                        <p className="text-lg font-bold text-gray-900">
                          ₹{((store.revenue || 0) / 1000).toFixed(0)}K
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Users className="w-3 h-3 text-gray-400" />
                          <p className="text-xs text-gray-500">Orders</p>
                        </div>
                        <p className="text-lg font-bold text-gray-900">{store.orderCount || 0}</p>
                      </div>
                    </div>
                    
                    {/* Status and Date */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          Joined {formatDate(store.createdAt)}
                        </span>
                      </div>
                      {store.isActive === false ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                          <XCircle className="w-3 h-3" />
                          Inactive
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                          <CheckCircle className="w-3 h-3" />
                          Active
                        </span>
                      )}
                    </div>
                    
                    {/* View Products Button */}
                    <button
                      onClick={() => handleViewProducts(store)}
                      className="w-full mt-2 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-sm font-medium text-gray-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Package className="w-4 h-4" />
                      View All Products ({store.products?.length || 0})
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredStores.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Store className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No stores found</h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                  {searchTerm ? 'No stores match your search criteria.' : 'No stores available in this category.'}
                </p>
              </div>
            )}
          </>
        )}
        
        {/* Summary Cards */}
        {!isLoading && stores.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-4 text-white">
              <p className="text-sm opacity-90">Total Stores</p>
              <p className="text-2xl font-bold">{stores.length}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-4 text-white">
              <p className="text-sm opacity-90">Active Stores</p>
              <p className="text-2xl font-bold">{stores.filter(s => s.isActive !== false).length}</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white">
              <p className="text-sm opacity-90">Inactive Stores</p>
              <p className="text-2xl font-bold">{stores.filter(s => s.isActive === false).length}</p>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-4 text-white">
              <p className="text-sm opacity-90">Total Products</p>
              <p className="text-2xl font-bold">{stores.reduce((sum, store) => sum + (store.products?.length || 0), 0)}</p>
            </div>
          </div>
        )}
      </div>

      {/* Products Modal */}
      {showProductsModal && selectedStore && (
        <ProductsModal
          store={selectedStore}
          onClose={() => {
            setShowProductsModal(false);
            setSelectedStore(null);
            setExpandedProduct(null);
          }}
        />
      )}
    </div>
  );
}