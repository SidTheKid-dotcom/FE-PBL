import { Routes, Route } from "react-router-dom";
import AdminHome from "./AdminHome";
import Orders from "./Orders";
import DeleteCard from "../components/DeleteCard";
import EditCard from "../components/EditCard";
import AddCard from "../components/AddCard";

export default function AdminRoutes() {
  return (
    <>
      <h1>Admin Routes</h1>
      <Routes>
        <Route index element={<AdminHome />} />
        <Route path="allOrders" element={<Orders />} />
        <Route path="pendingOrders" element={<Orders />} />
        <Route path="addItem" element={<AddCard />} />
        <Route path="editItem/:itemID" element={<EditCard />} />
        <Route path="confirmDelete/:itemID/:itemTitle" element={<DeleteCard />} />
      </Routes>
    </>
  );
}