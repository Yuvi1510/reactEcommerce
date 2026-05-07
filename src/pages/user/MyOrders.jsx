import { useEffect, useState } from "react";
import baseApi from "../../js/BaseApi";
import { toast } from "react-toastify";

export default function MyOrders() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyOrders = async () => {
        try {
            const res = await baseApi.get("/orders/my-orders");
            console.log(res.data);
            setOrders(res.data);
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch orders", {
    autoClose: 1000 // 1 second
});
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        try {
            await baseApi.put(`/orders/cancel/${orderId}`);
            toast.success("Order cancelled successfully", {
    autoClose: 1000 // 1 second
});
            fetchMyOrders();
        } catch (error) {
            console.log(error);
            toast.error("Failed to cancel order", {
    autoClose: 1000 // 1 second
});
        }
    };

    const handleMarkAsDelivered = async (orderId) => {
        try {
            await baseApi.put(`/orders/${orderId}/deliver`);
            toast.success("Order marked as delivered", {
    autoClose: 1000 // 1 second
});
            fetchMyOrders();
        } catch (error) {
            console.log(error);
            toast.error("Failed to mark order as delivered", {
    autoClose: 1000 // 1 second
});
        }
    };

    const handlePayment = (order) => {
        toast.info("Proceed to payment gateway", {
    autoClose: 1000 // 1 second
});
    };

    useEffect(() => {
        fetchMyOrders();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">My Orders</h1>
            {orders.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-zinc-500">No orders found.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.orderId} className="bg-white rounded-xl shadow-sm border border-zinc-100 p-6">
                            <div className="flex justify-between items-center mb-4 border-b border-zinc-100 pb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-zinc-800">Order #{order.orderId}</h3>
                                    <p className="text-sm text-zinc-500">
                                        Placed on: {new Date(order.date).toLocaleString()}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.orderStatus === 'DELIVERED'
                                        ? 'bg-green-100 text-green-800'
                                        : order.orderStatus === 'SHIPPED'
                                            ? 'bg-blue-100 text-blue-800'
                                            : order.orderStatus === 'PENDING'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-red-100 text-red-800'
                                    }`}>
                                    {order.orderStatus}
                                </span>
                            </div>

                            <div className="space-y-3 mb-4">
                                {order.orderItemList.map((item) => (
                                    <div key={item.orderItemId} className="flex items-center space-x-4">
                                        <img
                                            src={`${baseApi.defaults.baseURL}/images/${item.product.images[0].imageName}`}
                                            alt={item.product.name}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-medium text-zinc-900">{item.product.name}</h4>
                                            <p className="text-sm text-zinc-500">Qty: {item.orderQuantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-zinc-900">
                                                Rs. {item.priceAtPurchase * item.orderQuantity}
                                            </p>
                                            <p className="text-xs text-zinc-500">
                                                ({item.priceAtPurchase} x {item.orderQuantity})
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-zinc-100">
                                <div>
                                    <p className="text-sm text-zinc-500">
                                        {order.orderItemList.length} item{order.orderItemList.length > 1 ? 's' : ''}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-zinc-900">
                                        Total: Rs. {order.total}
                                    </p>
                                    {order.discountAmount > 0 && (
                                        <p className="text-sm text-green-600 font-medium">
                                            You saved: Rs. {order.discountAmount}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Order Actions */}
                            {order.orderStatus !== 'DELIVERED' && (
                                <div className="flex justify-end gap-3 mt-4">
                                    {order.orderStatus === 'PENDING' && (
                                        <button
                                            onClick={() => handleCancelOrder(order.orderId)}
                                            className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:cursor-pointer hover:bg-red-50 transition-colors"
                                        >
                                            Cancel Order
                                        </button>
                                    )}
                                    {order.orderStatus === 'PENDING' && (
                                        <button
                                            onClick={() => handlePayment(order)}
                                            className="px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                                        >
                                            Pay Now
                                        </button>
                                    )}
                                    {order.orderStatus === 'SHIPPED' && (
                                        <button
                                            onClick={() => handleMarkAsDelivered(order.orderId)}
                                            className="px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:cursor-pointer hover:bg-emerald-100 transition-colors"
                                        >
                                            Mark as Delivered
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}