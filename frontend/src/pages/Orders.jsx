import { useEffect, useState } from "react"
import axios from "axios";

export default function Orders() {

    const [orders, setOrders] = useState([]);

    useEffect(() => {

        const fetchOrders = async () => {

            try {
                const token = localStorage.getItem('token');

                const pathname = window.location.pathname;

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

    }, [])

    return <div>
        Orders:
        {
            orders.map(order => (

                <div key={order.orderID}>
                    <h1>OrderID: {order.orderID}</h1>
                    <h1>Token Number: {order.tokenNo}</h1>
                    <div>
                        {
                            order.items.map(item => (
                                <div key={item._id}>
                                    {JSON.stringify(item.menuItem)}
                                </div>
                            ))
                        }
                    </div>
                    <div>Status: {order.status}</div>
                </div>
            ))
        }
    </div>
}