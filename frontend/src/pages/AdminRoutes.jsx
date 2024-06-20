import { Routes, Route } from "react-router-dom";
import AdminHome from "./AdminHome";
import Orders from "./Orders";
import DeleteCard from "../components/DeleteCard";
import EditCard from "../components/EditCard";
import AddCard from "../components/AddCard";
import ViewCategories from "../components/ViewCategories";

import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminRoutes() {
  return (
    <>
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
          </Routes>
        </div>
      </div>
    </>
  );
}
