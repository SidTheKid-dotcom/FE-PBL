import { Routes, Route } from "react-router-dom";
import UserHome from "./UserHome";
import Orders from "./Orders";
import UserNavbar from "../components/UserNavbar";
import UserSidebar from "../components/UserSidebar";

export default function UserRoutes() {
  return (
    <>
      <UserNavbar />
      <div className="grid grid-cols-12 bg-slate-200 ">
        <div className="col-span-2">
          <UserSidebar />
        </div>
        <div className="col-span-10">
          <Routes>
            <Route index element={<UserHome />} />
            <Route path="my-orders" element={<Orders />} />
          </Routes>
        </div>
      </div>
    </>
  );
}