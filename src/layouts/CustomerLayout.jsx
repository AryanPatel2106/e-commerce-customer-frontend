import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";

function CustomerLayout() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <Outlet />
    </div>
  );
}

export default CustomerLayout;
