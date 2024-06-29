import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function AdminSidebar() {
    const navigate = useNavigate();
    const [showConfirmLogout, setShowConfirmLogout] = useState(false);
    const location = useLocation();
    const [active, setActive] = useState(0);
    const [prevActive, setPrevActive] = useState(active);

    useEffect(() => {
        setPrevActive(active);
        switch (location.pathname) {
            case "/admin":
                setActive(0);
                break;
            case "/admin/allOrders":
                setActive(1);
                break;
            case "/admin/pendingOrders":
                setActive(2);
                break;
            case "/admin/Categories":
                setActive(3);
                break;
            case "/admin/feedbacks":
                setActive(4);
                break;
            default:
                setActive(0);
                break;
        }
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleLogoutButtonClick = () => {
        setShowConfirmLogout(true);
        if (active !== 5) {
            setPrevActive(active);
            setActive(5);
        }
    };

    const handleLogoutButtonBlur = () => {
        setShowConfirmLogout(false);
        setActive(prevActive);
    };

    const navigateHome = () => {
        handleLogoutButtonBlur();
        navigate('/admin');
    }
    const navigateAllOrders = () => {
        handleLogoutButtonBlur();
        navigate('/admin/allOrders')
    };
    const navigatePendingOrders = () => {
        handleLogoutButtonBlur();
        navigate('/admin/pendingOrders')
    };
    const navigateCategories = () => {
        handleLogoutButtonBlur();
        navigate('/admin/Categories')
    };
    const navigateFeedbacks = () => {
        handleLogoutButtonBlur();
        navigate('/admin/feedbacks')
    };

    return (
        <div className="fixed top-[7.8%] left-0 h-full w-[16.66%] bg-slate-100 text-black">
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
                <button onClick={navigateFeedbacks} className={`p-4 w-full flex justify-center ${active === 4 ? 'bg-orange-100 border-l-4 border-solid border-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}>
                    Feedbacks
                </button>
                <button
                    onClick={handleLogoutButtonClick}
                    className={`p-4 w-full flex justify-center ${active === 5 ? 'bg-orange-100 border-l-4 border-solid border-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}
                >
                    Log out
                </button>
                {showConfirmLogout && (
                    <div className="absolute z-999 m-4 p-4 min-w-[15%] min-h-[100px] top-[45%] bg-slate-200 text-black font-bold rounded-lg flex flex-col justify-center items-center gap-4">
                        <section className="font-bold text-xl">Confirm Logout</section>
                        <section className="grid grid-cols-2 gap-2">
                            <button onClick={handleLogoutButtonBlur} className="col-span-1 rounded-md p-2 m-1 bg-red-400">Cancel</button>
                            <button onClick={handleLogout} className="col-span-1 rounded-md p-2 m-1 bg-green-300 z-999">Logout</button>
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
}
