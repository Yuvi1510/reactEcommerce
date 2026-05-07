import Navbar from "../../components/admin/NavBar";
import AdminSideBar from "../../components/admin/AdminSideBar";
import { Outlet } from "react-router-dom";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <AdminSideBar />
      <div className="ml-64 pt-16">
        <Outlet />
      </div>
    </div>
  );
}