import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Orders from "./Orders";

export default function AdminRoutes() {
  return (
    <>
      <h1>Admin Routes</h1>
      <Routes>
        <Route index element={<Home />} />
        <Route path="allOrders" element={<Orders />} />
        <Route path="pendingOrders" element={<Orders />} />
      </Routes>
    </>
  );
}