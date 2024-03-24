import { Routes, Route } from "react-router-dom";
import UserHome from "./UserHome";
import Orders from "./Orders";

export default function UserRoutes() {
  return (
    <>
      <h1>User Routes</h1>
      <Routes>
        <Route index element={<UserHome />} />
        <Route path="myOrders" element={<Orders />} />
      </Routes>
    </>
  );
}