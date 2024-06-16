import { useLocation, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";

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
    const navigateCategories = () => {
        navigate('/admin/Categories')
    }

    const location = useLocation();
    const [active, setActive] = useState(0);

    useEffect(() => {
        if (location.pathname === "/admin") setActive(0);
        else if (location.pathname === "/admin/allOrders") setActive(1);
        else if (location.pathname === "/admin/pendingOrders") setActive(2);
        else if (location.pathname === "/admin/Categories") setActive(3);
        else if (location.pathname === "/admin/logout") setActive(4);
    }, [location.pathname]);

    return (
        <div className="mt-[1px] h-full bg-slate-100 text-black">
            <div className="max-h-[50%] flex flex-col justify-around">
                <button onClick={navigateHome} className={`p-4 w-full flex justify-center ${active === 0 ? 'bg-orange-100 border-l-4 border-solid border-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}>
                    Home
                </button>
                <button onClick={navigateAllOrders} className={`p-4 w-full flex justify-center ${active === 1 ? 'bg-orange-100 border-l-4 border-solid border-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}>
                    All Orders
                </button>
                <button onClick={navigatePendingOrders} className={`p-4 w-full flex justify-center ${active === 2 ? 'bg-orange-100 border-l-4 border-solid border-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}>
                    Pending Orders
                </button>
                <button onClick={navigateCategories} className={`p-4 w-full flex justify-center ${active === 3 ? 'bg-orange-100 border-l-4 border-solid border-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}>
                    Categories
                </button>
                <button className={`p-4 w-full flex justify-center ${active === 4 ? 'bg-orange-100 border-l-4 border-solid border-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}>
                    Log out
                </button>
            </div>
        </div>
    )
}