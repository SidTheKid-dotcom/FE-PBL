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
    </>
  );
}
