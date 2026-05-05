import Navbar from "../../components/admin/NavBar";
import AdminDashboard from "../../components/admin/AdminDashboard";
import AdminSideBar from "../../components/admin/AdminSideBar";
import { Outlet } from "react-router-dom";

export default function AdminPage() {
  return (
    <div>
      <Navbar />
      <AdminSideBar/>
      <Outlet />
    </div>
  );
}