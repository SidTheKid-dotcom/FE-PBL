import { useEffect, useState } from "react"
import axios from "axios";
import OrderCard from "../components/OrderCard";
import LoadingSpinner from "../assets/animations/LoadingSpinner";

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

                setTimeout(() => {
                    setLoading(false);
                    setOrders(response.data.orders);
                }, 300);
            }
            catch (error) {
                setLoading(false);
                console.log("Error in fetching orders")
            }
        }

        fetchOrders();

        return () => {
            setOrders([]);
            setLoading(true);
        }

    }, [pathname])

    return (
        <div className="min-h-[100vh] h-full w-full text-black flex flex-col items-center">
            {loading ? (
                <div className="flex items-center justify-center h-full">
                    <LoadingSpinner />
                </div>
            ) : (
                orders.length === 0 ? (
                    <div className="mt-[-2rem] flex flex-col gap-4 items-center justify-center h-full">
                        <figure className="ml-[2.3rem]">
                            <img src='/no-order.png' alt='No Orders' width='150px'></img>
                        </figure>
                        <figcaption className="text-center font-bold text-xl">No orders found</figcaption>
                    </div>
                )
                    : (
                        orders.reverse().map((order, index) => (
                            <OrderCard key={index} order={order} setOrders={setOrders} />
                        ))
                    )
            )
            }
        </div>
    )
}
