import { ChevronLeft, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import React, { useState } from "react";
import logo from "./../../assets/images/logo.png";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function SideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { title: "الصفحة الرئيسية", href: "/الرئيسية" },
    { title: "المتخصصين", href: "/المتخصصين" },
    { title: "المستفيدين", href: "/المستفيدين" },
    { title: "المواعيد", href: "/المواعيد" },
    { title: "الجلسات", href: "/الجلسات" },
    { title: "الاعلانات", href: "/الاعلانات" },
    { title: "الدفع", href: "/الدفع" },
    { title: "الإعدادات", href: "/الإعدادات" },
  ];

  return (
    <>
      {/* Hamburger Button for Small Screens */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-24 left-8 z-50 bg-[#1F77BC] text-white p-2 rounded-full shadow-md"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Sidebar (Hidden by Default on Small Screens) */}
      <div
        dir="rtl"
        className={cn(
          "fixed h-screen w-[240px] flex flex-col bg-[#1F77BC] text-white rounded-l-[20px] overflow-hidden z-40 transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full", // Moves sidebar off-screen right
          "lg:translate-x-0 lg:relative lg:flex"
        )}
        style={{ right: 0 }} // Ensures it's positioned on the right
      >
        {/* Logo */}
        <div className="relative w-full flex h-16 items-center justify-center border-b bg-[#B2CEF2] rounded-bl-[50px] rounded-t-[20px] border-[#1F77BC] py-10 mb-8 mt-5">
          <img src={logo} alt="logo" />
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          {menuItems.map((item, index) => {
            const isActive = decodeURIComponent(location.pathname) === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center justify-between py-2 px-4 relative transition-all duration-300",
                  isActive ? "bg-[#B2CEF2] text-[#1F77BC] rounded-r-[50px]" : "text-white",
                  index !== menuItems.length - 1 && "border-b-2 border-white/10",
                  "hover:bg-[#B2CEF2] hover:text-[#1F77BC] hover:rounded-r-[50px]"
                )}
                onClick={() => setIsOpen(false)} // Close sidebar on item click
              >
                {item.title}
                <ChevronLeft className="h-4 w-4" />
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Overlay for Small Screens */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}

export default SideBar;
