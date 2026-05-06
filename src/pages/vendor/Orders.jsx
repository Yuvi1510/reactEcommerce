import { useEffect, useState } from "react";
import baseApi from "../../js/BaseApi";

export default function Orders(){

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await baseApi.get('/stores/orders');
                console.log(res.data);
                setOrders(res.data);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            }
        };
        fetchOrders();
    }, []);
    return(
        <div>
            <h1>Orders</h1>
            <p>List of orders</p>
        </div>
    );
}