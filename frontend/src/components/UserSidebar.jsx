import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function UserSidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [showConfirmLogout, setShowConfirmLogout] = useState(false);
    const [active, setActive] = useState(0);
    const [prevActive, setPrevActive] = useState(0);

    useEffect(() => {
        switch (location.pathname) {
            case "/user":
                setActive(0);
                break;
            case "/user/My-Orders":
                setActive(1);
                break;
            case "/user/Feedback":
                setActive(2);
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
        if (active !== 3) {
            setPrevActive(active);
            setActive(3);
        }
    };

    const handleCancelLogout = () => {
        setShowConfirmLogout(false);
        setActive(prevActive);
    };

    const navigateHome = () => {
        setShowConfirmLogout(false);
        navigate('/user/Todays-Menu');
    };

    const navigateMyOrders = () => {
        setShowConfirmLogout(false);
        navigate('/user/My-Orders');
    };

    const navigateFeedback = () => {
        setShowConfirmLogout(false);
        navigate('/user/Feedback');
    };

    return (
        <div className="fixed top-[7.8%] left-0 h-full w-[16.66%] bg-slate-100 text-black">
            <div className="max-h-[50%] flex flex-col justify-around">
                <button onClick={navigateHome} className={`p-4 w-full flex justify-center ${active === 0 ? 'bg-orange-100 border-l-4 border-solid border-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}>
                    Home
                </button>
                <button onClick={navigateMyOrders} className={`p-4 w-full flex justify-center ${active === 1 ? 'bg-orange-100 border-l-4 border-solid border-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}>
                    My Orders
                </button>
                <button onClick={navigateFeedback} className={`p-4 w-full flex justify-center ${active === 2 ? 'bg-orange-100 border-l-4 border-solid border-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}>
                    Feedback
                </button>
                <button
                    onClick={handleLogoutButtonClick}
                    className={`p-4 w-full flex justify-center ${active === 3 ? 'bg-orange-100 border-l-4 border-solid border-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}
                >
                    Log out
                </button>
                {showConfirmLogout && (
                    <div className="relative z-999 m-4 p-4 min-w-[15%] min-h-[100px] bg-slate-200 text-black font-bold rounded-lg flex flex-col justify-center items-center gap-4">
                        <section className="font-bold text-xl">Confirm Logout</section>
                        <section className="grid grid-cols-2 gap-2">
                            <button onClick={handleCancelLogout} className="col-span-1 rounded-md p-2 m-1 bg-red-400">Cancel</button>
                            <button onClick={handleLogout} className="col-span-1 rounded-md p-2 m-1 bg-green-300">Logout</button>
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
}
