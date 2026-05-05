import { useState } from "react";
import CarouselForm from "./CarouselForm";
import CarouselList from "./CarouselList";
import { Outlet } from "react-router-dom";

export default function AdminDashboard() {
  const [refreshFlag, setRefreshFlag] = useState(false);

  const refresh = () => {
    setRefreshFlag(!refreshFlag);
  };

  return (
    <div className="p-4">
      <CarouselForm refresh={refresh} />
      <CarouselList refresh={refresh} refreshFlag={refreshFlag} />
    </div>
  );
}