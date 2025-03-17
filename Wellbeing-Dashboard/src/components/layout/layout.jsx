import { Outlet } from "react-router-dom";
import SideBar from "./../SideBar/SideBar.jsx";
import Navbar from './../Navbar/Navbar.jsx';

const Layout = () => {
  return (
    <div className="flex h-screen bg-[#B2CEF2]">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <div className="p-4 mt-16 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;