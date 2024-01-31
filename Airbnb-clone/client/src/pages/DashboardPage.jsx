//components

import { SideBar } from "../components/SideBar";
import { Outlet } from "react-router-dom";


const DashboardIndex = () => {
  return (
    <main className="flex flex-row bg-neutral-100  w-screen min-h-screen">
      <SideBar />
      <Outlet />
    </main>
  );
};
export default DashboardIndex;
