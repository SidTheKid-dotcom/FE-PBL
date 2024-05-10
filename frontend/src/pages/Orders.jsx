import { useEffect, useState } from "react"
import axios from "axios";
import OrderCard from "../components/OrderCard";

export default function Orders() {

    const pathname = window.location.pathname;
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchOrders = async () => {

            try {
                const token = localStorage.getItem('token');

                const response = await axios.get(`http://localhost:3000/api/v1${pathname}`, {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    }
                })
                setLoading(false);

                setOrders(response.data.orders);
            }
            catch (error) {
                console.log("Error in fetching orders")
            }
        }

        fetchOrders();

        return () => {
            setOrders([]);
        }

    }, [pathname])

    return (
        <div className="min-h-[100vh] h-full w-full text-black flex flex-col items-center">
            {loading || orders === null? (
                <div className="flex items-center justify-center h-full">Loading...</div>
            ) : (
                orders.reverse().map(order => (
                    <OrderCard key={order._id} order={order} setOrders={setOrders} />
                ))
            )
            }
        </div>
    )
}
