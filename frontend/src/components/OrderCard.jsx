import axios from "axios";
import ShimmerEffect from '../assets/animations/ShimmerEffect';

export default function OrderCard({ order, setOrders }) {

    const [loading, setLoading] = useState(false);

    const statusColorClass = order.status === 'Pending' ? 'text-red-500' : 'text-green-500';
    const statusText = order.status === 'Pending' ? 'Pending' : 'Complete';

    const type = window.location.pathname.split('/')[1];

    const handleDeleteOrder = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('No token found in local storage');
            }

            const response = await axios.delete(
                `http://localhost:3000/api/v1/admin/deleteOrder`,
                {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    },
                    data: {
                        orderID: order._id
                    }
                }

            );
            setOrders(prevOrders => {
                const updatedOrders = prevOrders.filter(prevOrder => prevOrder._id !== response.data.deletedOrder._id);
                return updatedOrders;
            });
            setLoaging(false);
        } catch (error) {
            console.log('Error occurred while deleting order:', error);
        }
    }

    const handleMarkDone = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('No token found in local storage');
            }

            const response = await axios.put(
                `http://localhost:3000/api/v1/admin/updateOrderStatus`,
                {
                    orderID: order._id
                },
                {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setOrders(prevOrders => {
                const updatedOrders = prevOrders.map(prevOrder => {
                    if (prevOrder._id === response.data.updatedOrder._id) {
                        return {
                            ...prevOrder,
                            status: "Complete"
                        };
                    }
                    return prevOrder;
                });
                return updatedOrders;
            });

        } catch (error) {
            console.log('Error occurred while updating order status:', error);
        }
    }

    return (
        <div className="m-4 rounded-lg w-[60%] bg-slate-100 border border-solid border-gray-400">
            {loading && <ShimmerEffect />}
            <section className="grid grid-cols-12 border-b border-gray-400">
                <div className="col-span-2 flex flex-col items-center pt-[1rem]">
                    {
                        type === 'admin' && (
                            <button onClick={handleDeleteOrder}>
                                <figure>
                                    <img src='/trash-solid.svg' title='delete-icon' alt='delete-icon' width="20px" height="20px"></img>
                                </figure>
                            </button>
                        )
                    }
                </div>
                <div className="col-span-8 py-2 flex flex-col items-center font-bold">
                    <h1>OrderID: {order.orderID}</h1>
                    <h1>Token Number: {order.tokenNo}</h1>
                </div>
                <div className="col-span-2 flex flex-col items-center pt-[1rem]">
                    {
                        type === 'admin' && (
                            <button onClick={handleMarkDone}>
                                <figure>
                                    <img src='/check-solid.svg' title='delete-icon' alt='delete-icon' width="20px" height="20px"></img>
                                </figure>
                            </button>
                        )
                    }
                </div>
            </section>
            <section>
                <div className="p-4">
                    {
                        order.items.map(orderItem => (
                            <div key={orderItem._id} className="grid grid-cols-12 text-center">
                                <div className="col-span-4">Title: {orderItem.menuItem.title}</div>
                                <div className="col-span-4">Quantity: {orderItem.quantity}</div>
                                <div className="col-span-4">Price: {orderItem.menuItem.price}</div>
                            </div>
                        ))
                    }
                </div>
            </section>
            <section>
                <div className="p-2 flex flex-row justify-center border-t border-gray-400">
                    <span>Price: {order.price}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    Status: <span className={`ml-1 font-bold ${statusColorClass}`}>{statusText}</span>
                </div>
            </section>
        </div>
    )
}
