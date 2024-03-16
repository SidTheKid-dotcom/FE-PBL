import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Orders from "./Orders";

export default function UserRoutes() {
  return (
    <>
      <h1>User Routes</h1>
      <Routes>
        <Route index element={<Home />} />
        <Route path="myOrders" element={<Orders />} />
      </Routes>
    </>
  );
}