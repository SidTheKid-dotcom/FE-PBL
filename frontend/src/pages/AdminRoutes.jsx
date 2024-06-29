import { Routes, Route, useNavigate } from "react-router-dom";
import AdminHome from "./AdminHome";
import Orders from "./Orders";
import DeleteCard from "../components/DeleteCard";
import EditCard from "../components/EditCard";
import AddCard from "../components/AddCard";
import ViewCategories from "../components/ViewCategories";

import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from "react";
import FeedbackList from "../components/FeedbackList";

export default function AdminRoutes() {

  const [authorized, setAuthorized] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/');
    }
    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken.role === 'admin' && decodedToken.exp * 1000 > Date.now()) {
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
              onClick={() => navigate('/user/Todays-Menu')}
              className="text-lg text-blue-500 border-2 border-blue-500 px-4 py-2 rounded transition-colors duration-300 hover:bg-blue-500 hover:text-white"
            >
              Go Back
            </button>
          </div>
        ) : (
          <div>
            <AdminNavbar />
            <div className="flex min-h-[100vh] h-full bg-slate-200">
              <AdminSidebar />
              <div className="flex-grow flex flex-col items-center ml-[16.66%]"> {/* Sidebar is 2/12 columns, so content starts after that */}
                <Routes>
                  <Route index element={<AdminHome />} />
                  <Route path="allOrders" element={<Orders />} />
                  <Route path="pendingOrders" element={<Orders />} />
                  <Route path="addItem" element={<AddCard />} />
                  <Route path="editItem/:itemID" element={<EditCard />} />
                  <Route path="confirmDelete/:itemID/:itemTitle" element={<DeleteCard />} />
                  <Route path="categories" element={<ViewCategories />} />
                  <Route path="feedbacks" element={<FeedbackList />} />
                </Routes>
              </div>
            </div>
          </div>
        )
      }
    </>
  );
}
