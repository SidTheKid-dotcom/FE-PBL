import { useNavigate } from "react-router-dom"

export default function UserSidebar() {

    const navigate = useNavigate();

    const navigateHome = () => {
        navigate('/admin')
    }
    const navigateAllOrders = () => {
        navigate('/admin/allOrders')
    }
    const navigatePendingOrders = () => {
        navigate('/admin/pendingOrders')
    }

    return (
        <div className="mt-[1px] h-full bg-slate-100 text-black">
            <div className="max-h-[50%] flex flex-col justify-around">
                <div className="p-4 w-full flex justify-center">
                    <button onClick={navigateHome}>Home</button>
                </div>
                <div className="p-4 w-full flex justify-center">
                    <button onClick={navigateAllOrders}>All Orders</button>
                </div>
                <div className="p-4 w-full flex justify-center">
                    <button onClick={navigatePendingOrders}>Pending Orders</button>
                </div>
                <div className="p-4 w-full flex justify-center">
                    <button>Log out</button>
                </div>
            </div>
        </div>
    )
}