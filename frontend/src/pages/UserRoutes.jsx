import { Routes, Route, useNavigate } from "react-router-dom";
import UserHome from "./UserHome";
import Orders from "./Orders";
import UserNavbar from "../components/UserNavbar";
import UserSidebar from "../components/UserSidebar";
import Feedback from "./Feedback";
import Logout from "./Logout";
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from "react";

export default function UserRoutes() {

  const [authorized, setAuthorized] = useState(false);

  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/');
    }
    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken.role === 'user' && decodedToken.exp * 1000 > Date.now()) {
        setAuthorized(true);
        return;
      }
    } catch (error) {
      console.error('Invalid token', error);
      navigate('/');
    }
  }, [token]);

  return (
    <>
      {
        !authorized ? (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
            <h1 className="text-6xl font-bold mb-4">401</h1>
            <p className="text-xl mb-8">Not Authorized</p>
            <button
              onClick={() => navigate('/admin')}
              className="text-lg text-blue-500 border-2 border-blue-500 px-4 py-2 rounded transition-colors duration-300 hover:bg-blue-500 hover:text-white"
            >
              Go Back
            </button>
          </div>
        ) : (
          <div>
            <UserNavbar />
            <div className="flex bg-slate-200 min-h-[100vh]">
              <UserSidebar />
              <div className="flex-grow flex flex-col items-center ml-[16.66%]">
                <Routes>
                  <Route path="Todays-Menu" element={<UserHome />} />
                  <Route path="My-Orders" element={<Orders />} />
                  <Route path="Feedback" element={<Feedback />} />
                  <Route path="Logout" element={<Logout />} />
                </Routes>
              </div>
            </div>
          </div>
        )
      }
    </>
  );
}
