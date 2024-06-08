import { Routes, Route } from "react-router-dom";
import UserHome from "./UserHome";
import Orders from "./Orders";
import UserNavbar from "../components/UserNavbar";
import UserSidebar from "../components/UserSidebar";
import Feedback from "./Feedback";
import Logout from "./Logout";

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
            <Route path="Todays-Menu" element={<UserHome />} />
            <Route path="My-Orders" element={<Orders />} />
            <Route path="Feedback" element={<Feedback />} />
            <Route path="Logout" element={<Logout />} />
          </Routes>
        </div>
      </div>
    </>
  );
}