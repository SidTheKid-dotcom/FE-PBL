import { useNavigate } from "react-router-dom"

export default function UserSidebar() {

    const navigate = useNavigate();

    const navigateHome = () => {
        navigate('/user')
    }
    const navigateOrders = () => {
        navigate('/user/my-orders')
    }

    return (
        <div className="mt-[1px] h-full bg-slate-100 text-black">
            <div className="max-h-[50%] flex flex-col justify-around">
                <div className="p-4 w-full flex justify-center">
                    <button onClick={navigateHome}>Home</button>
                </div>
                <div className="p-4 w-full flex justify-center">
                    <button onClick={navigateOrders}>My Orders</button>
                </div>
                <div className="p-4 w-full flex justify-center">
                    <button>Feedback</button>
                </div>
                <div className="p-4 w-full flex justify-center">
                    <button>Log out</button>
                </div>
            </div>
        </div>
    )
}