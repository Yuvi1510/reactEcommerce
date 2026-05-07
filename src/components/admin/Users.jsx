import { useEffect, useState } from 'react';
import baseApi from '../../js/BaseApi';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  UserCheck, 
  Mail, 
  Calendar,
  Users as UsersIcon,
  Store,
  ShoppingBag,
  CheckCircle,
  XCircle,
  Eye,
  Ban,
  RefreshCw,
  Phone,
  MapPin,
  Package,
  ChevronDown,
  ChevronUp,
  Calendar as CalendarIcon,
  X
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMainTab, setActiveMainTab] = useState('all');
  const [activeSubTab, setActiveSubTab] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await baseApi.get('/users');
      console.log("users: ", res.data);
      setUsers(res.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const mainTabs = [
    { id: 'all', label: 'All Users', icon: UsersIcon, count: users.length },
    { id: 'vendor', label: 'Vendors', icon: Store, count: users.filter(u => u.store !== null).length },
    { id: 'customer', label: 'Customers', icon: ShoppingBag, count: users.filter(u => u.store === null).length }
  ];

  const getFilteredUsers = () => {
    let filtered = users;
    
    // Filter by main tab
    if (activeMainTab === 'vendor') {
      filtered = filtered.filter(user => user.store !== null);
    } else if (activeMainTab === 'customer') {
      filtered = filtered.filter(user => user.store === null);
    }
    
    // Filter by sub tab (active/inactive)
    if (activeSubTab === 'active') {
      filtered = filtered.filter(user => user.active !== false);
    } else if (activeSubTab === 'inactive') {
      filtered = filtered.filter(user => user.active === false);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user => 
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const handleUserAction = async (userId, action) => {
    try {
      if (action === 'disable') {
        await baseApi.put(`/users/${userId}/disable`);
        setUsers(users.map(user => 
          user.userId === userId ? { ...user, active: false } : user
        ));
        toast.success('User disabled successfully', { autoClose: 1000 });
      } else if (action === 'enable') {
        await baseApi.put(`/users/${userId}/enable`);
        setUsers(users.map(user => 
          user.userId === userId ? { ...user, active: true } : user
        ));
        toast.success('User enabled successfully', { autoClose: 1000 });
      }
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
      toast.error(`Failed to ${action} user`, { autoClose: 1000 });
    }
    setOpenDropdown(null);
  };

  const getUserFullName = (user) => {
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User';
  };

  const getUserInitials = (user) => {
    const first = user.firstName?.charAt(0) || '';
    const last = user.lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || 'U';
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "SHIPPED": return "bg-blue-100 text-blue-800";
      case "DELIVERED": return "bg-green-100 text-green-800";
      case "CANCELLED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    return status === "PAID" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const filteredUsers = getFilteredUsers();

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

  // User Details Modal Component
  const UserDetailsModal = ({ user, onClose }) => {
    if (!user) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          {/* Modal Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                user.store !== null 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500'
              }`}>
                <span className="text-white font-bold text-lg">{getUserInitials(user)}</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{getUserFullName(user)}</h2>
                <p className="text-sm text-gray-500">User ID: #{user.userId}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-6">
            {/* Personal Information */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-500" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Full Name</p>
                  <p className="text-sm font-medium text-gray-900">{getUserFullName(user)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Email Address</p>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-900">{user.email || 'Not provided'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-900">{user.phone || 'Not provided'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Date of Birth</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-900">{user.dob || 'Not provided'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Joined Date</p>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  {user.active === false ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                      <Ban className="w-3 h-3" />
                      Inactive
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                      <CheckCircle className="w-3 h-3" />
                      Active
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Role Information */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Store className="w-5 h-5 text-purple-500" />
                Role Information
              </h3>
              {user.store !== null ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                    <Store className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{user.store.name}</p>
                      <p className="text-xs text-gray-500">Vendor Store</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Store Email</p>
                      <p className="text-sm text-gray-900">{user.store.email || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Store Phone</p>
                      <p className="text-sm text-gray-900">{user.store.phone || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Regular Customer (No Store)</p>
              )}
            </div>

            {/* Addresses */}
            {user.addresses && user.addresses.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  Saved Addresses ({user.addresses.length})
                </h3>
                <div className="space-y-3">
                  {user.addresses.map((address, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-900">{address.street}</p>
                      <p className="text-sm text-gray-600">{address.city}, {address.state} - {address.pincode}</p>
                      <p className="text-xs text-gray-500">{address.country}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Orders Section */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-orange-500" />
                Order History ({user.orders?.length || 0} orders)
              </h3>
              {user.orders && user.orders.length > 0 ? (
                <div className="space-y-3">
                  {user.orders.map((order) => (
                    <div key={order.orderId} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      {/* Order Header */}
                      <div 
                        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => toggleOrderExpand(order.orderId)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">Order #{order.orderId}</p>
                            <p className="text-xs text-gray-500">{formatDate(order.date)}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}>
                              {order.orderStatus}
                            </span>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                              {order.paymentStatus}
                            </span>
                            {expandedOrders[order.orderId] ? (
                              <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between mt-2">
                          <p className="text-sm text-gray-600">Total: {formatCurrency(order.total)}</p>
                          <p className="text-xs text-gray-500">{order.orderItemList?.length || 0} items</p>
                        </div>
                      </div>

                      {/* Order Items (Expandable) */}
                      {expandedOrders[order.orderId] && (
                        <div className="border-t border-gray-200 p-4 bg-gray-50">
                          <p className="text-sm font-semibold text-gray-900 mb-3">Order Items</p>
                          <div className="space-y-2">
                            {order.orderItemList?.map((item) => (
                              <div key={item.orderItemId} className="bg-white rounded-lg p-3">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-900">
                                      {item.product?.name || `Product ID: ${item.product?.productId}`}
                                    </p>
                                    <div className="flex gap-4 mt-1 text-sm text-gray-600">
                                      <span>Quantity: x{item.orderQuantity}</span>
                                      <span>Price: {formatCurrency(item.priceAtPurchase)}</span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-semibold text-gray-900">
                                      {formatCurrency(item.orderQuantity * item.priceAtPurchase)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Subtotal:</span>
                              <span className="font-medium">{formatCurrency(order.subTotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Tax:</span>
                              <span className="font-medium">{formatCurrency(order.taxAmount)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Delivery Charge:</span>
                              <span className="font-medium">{formatCurrency(order.deliveryCharge)}</span>
                            </div>
                            <div className="flex justify-between text-base font-bold mt-2 pt-2 border-t border-gray-200">
                              <span>Grand Total:</span>
                              <span className="text-emerald-600">{formatCurrency(order.total)}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No orders yet</p>
                </div>
              )}
            </div>

            {/* Cart Information */}
            {user.cart && user.cart.cartItems && user.cart.cartItems.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-emerald-500" />
                  Current Cart ({user.cart.cartItems.length} items)
                </h3>
                <div className="space-y-2">
                  {user.cart.cartItems.map((item, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{item.product?.name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(item.product?.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
            {user.active === false ? (
              <button
                onClick={() => {
                  handleUserAction(user.userId, 'enable');
                  onClose();
                }}
                className="px-4 py-2 rounded-lg font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Enable User
              </button>
            ) : (
              <button
                onClick={() => {
                  handleUserAction(user.userId, 'disable');
                  onClose();
                }}
                className="px-4 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <Ban className="w-4 h-4" />
                Disable User
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">Manage and monitor all registered users</p>
        </div>

        {/* Main Tabs */}
        <div className="mb-4">
          <nav className="flex flex-wrap gap-3">
            {mainTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveMainTab(tab.id);
                    setActiveSubTab(null);
                  }}
                  className={`
                    flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200
                    ${activeMainTab === tab.id
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  <span className={`
                    ml-1 px-2 py-0.5 rounded-full text-xs font-bold
                    ${activeMainTab === tab.id
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

        {/* Sub Tabs (Active/Inactive) - Only show when not on All Users */}
        {activeMainTab !== 'all' && (
          <div className="mb-6 ml-4">
            <nav className="flex gap-2">
              <button
                onClick={() => setActiveSubTab(null)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${activeSubTab === null
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                All {activeMainTab === 'vendor' ? 'Vendors' : 'Customers'}
              </button>
              <button
                onClick={() => setActiveSubTab('active')}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2
                  ${activeSubTab === 'active'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                <CheckCircle className="w-3 h-3" />
                Active
              </button>
              <button
                onClick={() => setActiveSubTab('inactive')}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2
                  ${activeSubTab === 'inactive'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                <XCircle className="w-3 h-3" />
                Inactive
              </button>
            </nav>
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <button 
              onClick={() => fetchUsers()}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Joined Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Orders</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.userId} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            user.store !== null 
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                              : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                          }`}>
                            <span className="text-white font-semibold">
                              {getUserInitials(user)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{getUserFullName(user)}</p>
                            <p className="text-xs text-gray-500">ID: #{user.userId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{user.email || 'No email'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.phone || 'Not provided'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.store !== null ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                            <Store className="w-3 h-3" />
                            Vendor
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                            <ShoppingBag className="w-3 h-3" />
                            Customer
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.active === false ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                            <Ban className="w-3 h-3" />
                            Inactive
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.orders?.length || 0} orders
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap relative">
                        <div className="dropdown-container relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdown(openDropdown === user.userId ? null : user.userId);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-4 h-4 text-gray-500" />
                          </button>
                          
                          {openDropdown === user.userId && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50" style={{ top: '100%' }}>
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowModal(true);
                                  setOpenDropdown(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                              </button>
                              <hr className="my-1 border-gray-100" />
                              <button
                                onClick={() => handleUserAction(user.userId, 'enable')}
                                className="w-full px-4 py-2 text-left text-sm text-emerald-600 hover:bg-emerald-50 flex items-center gap-2"
                                disabled={user.active !== false}
                              >
                                <CheckCircle className="w-4 h-4" />
                                Enable User
                              </button>
                              <button
                                onClick={() => handleUserAction(user.userId, 'disable')}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                disabled={user.active === false}
                              >
                                <Ban className="w-4 h-4" />
                                Disable User
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-4 text-white">
            <p className="text-sm opacity-90">Total Users</p>
            <p className="text-2xl font-bold">{users.length}</p>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white">
            <p className="text-sm opacity-90">Total Vendors</p>
            <p className="text-2xl font-bold">{users.filter(u => u.store !== null).length}</p>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-4 text-white">
            <p className="text-sm opacity-90">Total Customers</p>
            <p className="text-2xl font-bold">{users.filter(u => u.store === null).length}</p>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-4 text-white">
            <p className="text-sm opacity-90">Total Orders</p>
            <p className="text-2xl font-bold">{users.reduce((sum, user) => sum + (user.orders?.length || 0), 0)}</p>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <UserDetailsModal 
          user={selectedUser} 
          onClose={() => {
            setShowModal(false);
            setSelectedUser(null);
            setExpandedOrders({});
          }} 
        />
      )}
    </div>
  );
}