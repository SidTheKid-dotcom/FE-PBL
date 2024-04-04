export default function OrderCard({ order }) {

    const statusColorClass = order.status === 'Pending' ? 'text-red-500' : 'text-green-500';
    const statusText = order.status === 'Pending' ? 'Pending' : 'Complete';

    return (
        <div key={order.orderID} className="m-4 rounded-lg w-[60%] bg-slate-100 border border-solid border-gray-400">
            <section>
                <div className="py-2 flex flex-col items-center font-bold border-b border-gray-400">
                    <h1>OrderID: {order.orderID}</h1>
                    <h1>Token Number: {order.tokenNo}</h1>
                </div>
            </section>
            <section>
                <div className="p-4">
                    {
                        order.items.map(item => (
                            <div key={item._id} className="grid grid-cols-12 text-center">
                                <div className="col-span-4">Title: {item.menuItem.title}</div>
                                <div className="col-span-4">Price: {item.menuItem.price}</div>
                                <div className="col-span-4">Quantity: {item.quantity}</div>
                            </div>
                        ))
                    }
                </div>
            </section>
            <section>
                <div className="p-2 flex flex-row justify-center border-t border-gray-400">
                    Status: <span className={`ml-1 font-bold ${statusColorClass}`}>{statusText}</span>
                </div>
            </section>
        </div>
    )
}