import { useEffect, useState } from "react"
import axios from "axios";
import OrderCard from "../components/OrderCard";

export default function Orders() {

    const pathname = window.location.pathname;
    const [orders, setOrders] = useState([]);

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

    return <div className="min-h-[100vh] h-full bg-purple-100 w-full text-black flex flex-col items-center">
        {
            //Add something to remove the warninng "Each child should have a key prop"
            orders.map(order => (
                <OrderCard order={order} />
            ))
        }
    </div>
}