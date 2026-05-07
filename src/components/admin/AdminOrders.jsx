import React from 'react';
import { useEffect, useState, useCallback } from "react";
import baseApi from "../../js/BaseApi";
import {
    ChevronDown,
    ChevronUp,
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Clock,
  Search,
  RefreshCw,
  Filter,
  Eye
} from 'lucide-react';
import { toast } from "react-toastify";

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [activeTab, setActiveTab] = useState("all");
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState({});
    const [debounceTimer, setDebounceTimer] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [storeFilter, setStoreFilter] = useState('all');

    const tabs = [
        { id: "all", label: "All Orders", icon: Package, status: null },
        { id: "pending", label: "Pending", icon: Clock, status: "PENDING" },
        { id: "shipped", label: "Shipped", icon: Truck, status: "SHIPPED" },
        { id: "delivered", label: "Delivered", icon: CheckCircle, status: "DELIVERED" },
        { id: "cancelled", label: "Cancelled", icon: XCircle, status: "CANCELLED" }
    ];

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const res = await baseApi.get("/admin/orders");
            console.log("orders: ", res.data);
            setOrders(res.data);
            setError(null);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            setError("Could not load orders. Please check the network or server.");
            toast.error("Failed to load orders", { autoClose: 1000 });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        filterOrders();
    }, [activeTab, orders, searchTerm, storeFilter]);

    const filterOrders = () => {
        let filtered = orders;
        
        // Filter by tab status
        const currentTab = tabs.find(tab => tab.id === activeTab);
        if (currentTab && currentTab.status !== null) {
            filtered = filtered.filter(order => order.orderStatus === currentTab.status);
        }
        
        // Filter by search term (order ID or customer name)
        if (searchTerm) {
            filtered = filtered.filter(order => 
                order.orderId.toString().includes(searchTerm) ||
                order.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // Filter by store (if applicable)
        if (storeFilter !== 'all') {
            filtered = filtered.filter(order => order.storeId?.toString() === storeFilter);
        }
        
        setFilteredOrders(filtered);
    };

    const toggleOrderExpand = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const updateOrderStatus = useCallback(async (orderId, newStatus) => {
        // Clear existing timer for this order
        if (debounceTimer[orderId]) {
            clearTimeout(debounceTimer[orderId]);
        }

        // Set updating state
        setUpdatingStatus(prev => ({ ...prev, [orderId]: true }));

        // Set new timer
        const timer = setTimeout(async () => {
            try {
                const response = await baseApi.put(`/admin/orders/update-status`, {
                    orderId: orderId,
                    orderStatus: newStatus
                });
                
                if (response.data) {
                    // Update local orders
                    setOrders(prevOrders => 
                        prevOrders.map(order => 
                            order.orderId === orderId 
                                ? { ...order, orderStatus: newStatus }
                                : order
                        )
                    );
                }
                toast.success("Order status updated successfully", { autoClose: 1000 });
            } catch (error) {
                console.error('Failed to update order status:', error);
                toast.error("Failed to update order status", { autoClose: 1000 });
            } finally {
                setUpdatingStatus(prev => ({ ...prev, [orderId]: false }));
                setDebounceTimer(prev => {
                    const newTimer = { ...prev };
                    delete newTimer[orderId];
                    return newTimer;
                });
            }
        }, 500);

        setDebounceTimer(prev => ({ ...prev, [orderId]: timer }));
    }, [debounceTimer]);

    const getStatusColor = (status) => {
        switch(status) {
            case "PENDING": return "bg-amber-100 text-amber-800";
            case "SHIPPED": return "bg-blue-100 text-blue-800";
            case "DELIVERED": return "bg-emerald-100 text-emerald-800";
            case "CANCELLED": return "bg-red-100 text-red-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case "PENDING": return Clock;
            case "SHIPPED": return Truck;
            case "DELIVERED": return CheckCircle;
            case "CANCELLED": return XCircle;
            default: return Package;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    // Get unique stores for filter (if orders have store info)
    const uniqueStores = [...new Set(orders.map(order => order.storeId).filter(Boolean))];

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Orders Management</h1>
                        <p className="text-gray-500 mt-1">Track and manage all customer orders across all stores.</p>
                    </div>
                    <button 
                        onClick={fetchOrders}
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

                {/* Search and Filter Bar */}
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by Order ID, Customer Name, or Email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                        </div>
                        {uniqueStores.length > 0 && (
                            <select
                                value={storeFilter}
                                onChange={(e) => setStoreFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            >
                                <option value="all">All Stores</option>
                                {uniqueStores.map(storeId => (
                                    <option key={storeId} value={storeId}>Store #{storeId}</option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <svg className="animate-spin h-10 w-10 text-emerald-500 mb-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-gray-500 font-medium animate-pulse">Loading orders...</p>
                    </div>
                ) : (
                    <>
                        {/* Tabs */}
                        <div className="mb-6">
                            <nav className="flex flex-wrap gap-3">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const count = tab.status 
                                        ? orders.filter(o => o.orderStatus === tab.status).length 
                                        : orders.length;
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
                                                {count}
                                            </span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Orders Table */}
                        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <div className="max-h-[600px] overflow-y-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50 sticky top-0 z-10">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                    Order ID
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                    Customer
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                    Date
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                    Items
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                    Sub Total
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                    Tax
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                    Total
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                    Payment
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
                                            {filteredOrders.map((order) => {
                                                const StatusIcon = getStatusIcon(order.orderStatus);
                                                return (
                                                    <React.Fragment key={order.orderId}>
                                                        <tr 
                                                            className="hover:bg-gray-50 transition-colors cursor-pointer group"
                                                            onClick={() => toggleOrderExpand(order.orderId)}
                                                        >
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center gap-2">
                                                                    <Package className="w-4 h-4 text-emerald-500" />
                                                                    <span className="text-sm font-bold text-gray-900">
                                                                        #{order.orderId}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-900">
                                                                        {order.user?.firstName} {order.user?.lastName}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">
                                                                        {order.user?.email}
                                                                    </p>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatDate(order.date)}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {order.orderItemList?.length || 0} item(s)
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatCurrency(order.subTotal)}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatCurrency(order.taxAmount)}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className="text-sm font-bold text-gray-900">
                                                                    {formatCurrency(order.total)}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center gap-1.5">
                                                                    <StatusIcon className="w-3.5 h-3.5" />
                                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}>
                                                                        {order.orderStatus}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                                    order.paymentStatus === "PAID" 
                                                                        ? "bg-emerald-100 text-emerald-800" 
                                                                        : "bg-amber-100 text-amber-800"
                                                                }`}>
                                                                    {order.paymentStatus}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                                                <div className="flex items-center gap-2">
                                                                    <select
                                                                        value={order.orderStatus}
                                                                        onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                                                                        disabled={updatingStatus[order.orderId]}
                                                                        className={`
                                                                            text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white
                                                                            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                                                                            ${updatingStatus[order.orderId] ? 'opacity-50 cursor-not-allowed' : 'hover:border-emerald-300'}
                                                                        `}
                                                                    >
                                                                        <option value="PENDING">Pending</option>
                                                                        <option value="SHIPPED">Shipped</option>
                                                                        <option value="DELIVERED">Delivered</option>
                                                                        <option value="CANCELLED">Cancelled</option>
                                                                    </select>
                                                                    {expandedOrder === order.orderId ? (
                                                                        <ChevronUp className="w-4 h-4 text-gray-400" />
                                                                    ) : (
                                                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                                                    )}
                                                                </div>
                                                                {updatingStatus[order.orderId] && (
                                                                    <div className="text-xs text-emerald-600 mt-1 animate-pulse">
                                                                        Updating...
                                                                    </div>
                                                                )}
                                                             </td>
                                                        </tr>
                                                        
                                                        {/* Expanded Order Items */}
                                                        {expandedOrder === order.orderId && (
                                                            <tr className="bg-gray-50/50">
                                                                <td colSpan="10" className="px-6 py-6">
                                                                    <div className="ml-6">
                                                                        <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                                            <Package className="w-4 h-4 text-emerald-500" />
                                                                            Order Items
                                                                        </h4>
                                                                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                                                            <table className="min-w-full divide-y divide-gray-200">
                                                                                <thead className="bg-gray-50">
                                                                                    <tr>
                                                                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500">Item ID</th>
                                                                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500">Product</th>
                                                                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500">Quantity</th>
                                                                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500">Price</th>
                                                                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500">Total</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody className="divide-y divide-gray-100">
                                                                                    {order.orderItemList?.map((item) => (
                                                                                        <tr key={item.orderItemId} className="hover:bg-gray-50">
                                                                                            <td className="px-4 py-3 text-sm text-gray-500">
                                                                                                #{item.orderItemId}
                                                                                             </td>
                                                                                            <td className="px-4 py-3">
                                                                                                <span className="text-sm font-medium text-gray-900">
                                                                                                    {item.product?.name || `Product ID: ${item.product?.productId || 'N/A'}`}
                                                                                                </span>
                                                                                             </td>
                                                                                            <td className="px-4 py-3 text-sm text-gray-500">
                                                                                                x{item.orderQuantity}
                                                                                             </td>
                                                                                            <td className="px-4 py-3 text-sm text-gray-500">
                                                                                                {formatCurrency(item.priceAtPurchase)}
                                                                                             </td>
                                                                                            <td className="px-4 py-3">
                                                                                                <span className="text-sm font-semibold text-gray-900">
                                                                                                    {formatCurrency(item.orderQuantity * item.priceAtPurchase)}
                                                                                                </span>
                                                                                             </td>
                                                                                        </tr>
                                                                                    ))}
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                        <div className="mt-4 text-right">
                                                                            <p className="text-sm text-gray-500">
                                                                                Delivery Charge: <span className="font-medium">{formatCurrency(order.deliveryCharge)}</span>
                                                                            </p>
                                                                            <p className="text-base font-bold text-gray-900 mt-1">
                                                                                Grand Total: {formatCurrency(order.total)}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                 </td>
                                                            </tr>
                                                        )}
                                                    </React.Fragment>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                    
                                    {filteredOrders.length === 0 && (
                                        <div className="text-center py-16">
                                            <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <Package className="w-12 h-12" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-800 mb-2">No orders found</h3>
                                            <p className="text-gray-500 max-w-sm mx-auto">
                                                No orders available in this category.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-4 text-white">
                                <p className="text-sm opacity-90">Total Orders</p>
                                <p className="text-2xl font-bold">{orders.length}</p>
                            </div>
                            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-4 text-white">
                                <p className="text-sm opacity-90">Total Revenue</p>
                                <p className="text-2xl font-bold">
                                    {formatCurrency(orders.reduce((sum, order) => sum + order.total, 0))}
                                </p>
                            </div>
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white">
                                <p className="text-sm opacity-90">Pending Orders</p>
                                <p className="text-2xl font-bold">
                                    {orders.filter(o => o.orderStatus === 'PENDING').length}
                                </p>
                            </div>
                            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-4 text-white">
                                <p className="text-sm opacity-90">Completed Orders</p>
                                <p className="text-2xl font-bold">
                                    {orders.filter(o => o.orderStatus === 'DELIVERED').length}
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}