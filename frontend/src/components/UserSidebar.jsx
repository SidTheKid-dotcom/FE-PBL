import { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";

export default function UserSidebar() {

    const navigate = useNavigate();

    const navigateHome = () => {
        navigate('/user/Todays-Menu')
    }
    const navigateOrders = () => {
        navigate('/user/My-Orders')
    }

    const navigateFeedback = () => {
        navigate('/user/Feedback')
    }

    const location = useLocation();
    const [active, setActive] = useState(0);

    useEffect(() => {
        if (location.pathname === "/user/Todays-Menu") setActive(0);
        else if (location.pathname === "/user/My-Orders") setActive(1);
        else if (location.pathname === "/user/Feedback") setActive(2);
    }, [location.pathname]);

    return (
        <div className="mt-[1px] h-full bg-slate-100 text-black">
            <div className="max-h-[50%] flex flex-col justify-around">
            <button onClick={navigateHome} className={`p-4 w-full flex justify-center ${active === 0 ? 'bg-orange-100 border-l-4 border-solid border-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}>
                    Home
                </button>
                <button onClick={navigateOrders} className={`p-4 w-full flex justify-center ${active === 1 ? 'bg-orange-100 border-l-4 border-solid border-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}>
                    My Orders
                </button>
                <button onClick={navigateFeedback} className={`p-4 w-full flex justify-center ${active === 2 ? 'bg-orange-100 border-l-4 border-solid border-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}>
                    Feedback
                </button>
                <button className={`p-4 w-full flex justify-center ${active === 3 ? 'bg-orange-100 border-l-4 border-solid border-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}>
                    Log out
                </button>
            </div>
        </div>
    )
}