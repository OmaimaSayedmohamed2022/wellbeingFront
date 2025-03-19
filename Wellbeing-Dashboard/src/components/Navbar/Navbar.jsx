import React, { useState, useEffect, useContext, useCallback } from "react";
import { FaSearch, FaBell, FaSignOutAlt, FaBars } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import Avatar from "../../assets/images/person.jpg";
import axios from "axios";
import toast from "react-hot-toast";
import notificationSoundFile from "../../assets/notification/not.wav";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPage =
    decodeURIComponent(location.pathname.replace("/", "")) || "الرئيسية";
  const [showSearch, setShowSearch] = useState(false);
  const [adminImageUrl, setAdminImageUrl] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { token, user, logout } = useContext(AuthContext);
  const [showSidebar, setShowSidebar] = useState(false); // State for sidebar visibility
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [searchResults, setSearchResults] = useState([]); // State for search results

  // Track online/offline status
  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);
    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
    };
  }, []);

  // Fetch admin data (image URL)
  useEffect(() => {
    if (!user?.id || !token) return;
    const fetchAdminData = async () => {
      try {
        const response = await fetch(
          `https://wellbeingproject.onrender.com/api/admin/getAdmin/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        if (data?.admin?.imageUrl) {
          setAdminImageUrl(data.admin.imageUrl);
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
        toast.error("فشل في جلب بيانات المسؤول. يرجى المحاولة مرة أخرى.");
      }
    };
    fetchAdminData();
  }, [user?.id, token]);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      if (!user?.id || !token) return;
      const response = await fetch(
        `https://wellbeingproject.onrender.com/api/notification/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setNotifications(data);
      const unreadCount = data.filter((notif) => !notif.isRead).length;
      setUnreadNotificationCount(unreadCount);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("فشل في جلب الإشعارات. يرجى المحاولة مرة أخرى.");
    }
  }, [user?.id, token]);

  // Fetch notifications on component mount and periodically
  useEffect(() => {
    fetchNotifications(); // Fetch notifications on component mount
    const interval = setInterval(fetchNotifications, 60000); // Fetch every 60 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [fetchNotifications]);

  // Play notification sound when there are new unread notifications
  useEffect(() => {
    if (unreadNotificationCount > 0) {
      const audio = new Audio(notificationSoundFile);
      audio.play().catch((error) => console.error("Error playing notification sound:", error));
    }
  }, [unreadNotificationCount]);

  // Mark a notification as read
  const markNotificationAsRead = useCallback(
    async (notificationId) => {
      try {
        const response = await axios.put(
          `https://wellbeingproject.onrender.com/api/notification/read/${notificationId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.message === "Notification marked as read") {
          setNotifications((prev) =>
            prev.map((notif) =>
              notif._id === notificationId ? { ...notif, isRead: true } : notif
            )
          );
          setUnreadNotificationCount((prev) => Math.max(prev - 1, 0));
        }
      } catch (error) {
        console.error("Error marking notification as read:", error);
        toast.error("فشل في تحديث حالة الإشعار.");
      }
    },
    [token]
  );

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.post(
        "https://wellbeingproject.onrender.com/api/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      logout();
      toast.success("تم تسجيل الخروج بنجاح!");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("فشل تسجيل الخروج. يرجى المحاولة مرة أخرى.");
    }
  };

  // Close notifications panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const notificationsPanel = document.querySelector(".notifications-panel");
      if (notificationsPanel && !notificationsPanel.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle search input change
  const handleSearchInputChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query) {
      try {
        const response = await axios.get(
          `https://wellbeingproject.onrender.com/api/admin/searchSpecalist?name=${query}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSearchResults(response.data.data); // Update search results
      } catch (error) {
        console.error("Error fetching search results:", error);
        toast.error("فشل في جلب نتائج البحث. يرجى المحاولة مرة أخرى.");
      }
    } else {
      setSearchResults([]); // Clear search results if query is empty
    }
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const searchInput = document.querySelector(".search-input");
      const searchResultsContainer = document.querySelector(".search-results-container");

      // Check if the click is outside the search input and results container
      if (
        searchResultsContainer &&
        !searchResultsContainer.contains(event.target) &&
        !searchInput?.contains(event.target)
      ) {
        setShowSearch(false);
        setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setShowSidebar((prev) => !prev);
  };

  return (
    <>
      {/* First Navbar for Primary Actions */}
      <div className="bg-white p-4 flex justify-between items-center rounded-[20px] mx-4 md:mx-8 fixed top-0 left-0 right-0 lg:mr-[275px] lg:ml-[50px] z-20 shadow-md">
        {/* Left Section - Hamburger Menu and Logout Button */}
        <div className="flex items-center gap-4">
          {/* Logout Button */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <FaSignOutAlt className="text-[#1F77BC] text-xl" />
          </button>
        </div>
  
        {/* Center Section - Page Name (Visible on Medium and Larger Screens) */}
        <h2 className="text-lg font-bold text-[#1F77BC] hidden md:block">
          {currentPage}
        </h2>
  
        {/* Right Section - Notification Icon, Search Bar, and User Profile */}
        <div className="flex items-center gap-4">
          {/* Search Bar (Visible on Medium and Larger Screens) */}
          <div className="hidden md:flex items-center relative ml-20">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
            <input
              type="text"
              placeholder="بحث"
              className="pl-10 px-4 py-2 w-72 rounded-2xl border bg-[#1F77BC] border-[#1F77BC] text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#B2CEF2] search-input"
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
            {searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-72 bg-white rounded-[20px] shadow-lg z-50 max-h-[300px] overflow-y-auto search-results-container">
                {searchResults.map((result) => (
                  <div key={result._id} className="p-3 hover:bg-gray-100 cursor-pointer">
                    <p className="text-[15px]">{result.firstName} {result.lastName}</p>
                    <p className="text-sm text-gray-500">{result.email}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
  
          {/* Notification Icon */}
          <button
            className="relative p-2 rounded-full bg-[#1F77BC] hover:bg-[#B2CEF2] transition"
            onClick={() => {
              setShowNotifications((prev) => !prev);
              if (notifications.length === 0) fetchNotifications();
            }}
          >
            <FaBell className="text-white text-xl cursor-pointer" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {unreadNotificationCount}
              </span>
            )}
          </button>
  
          {/* Notifications Panel */}
          {showNotifications && (
            <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-[20px] shadow-lg z-50 max-h-[300px] overflow-y-auto notifications-panel">
              <div className="p-4">
                <h3 className="text-lg font-bold text-[#1F77BC] mb-4">الإشعارات</h3>
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div
                      key={notif._id}
                      className={`p-3 rounded-md mb-2 ${
                        !notif.isRead ? "bg-[#B2CEF2]" : "bg-gray-100"
                      }`}
                      onClick={() => markNotificationAsRead(notif._id)}
                    >
                      <p className="text-[15px]">{notif.message}</p>
                      {notif.meetingLink && (
                        <a
                          href={notif.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#1F77BC] text-xs underline mt-1 block"
                        >
                          انضم إلى الاجتماع
                        </a>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(notif.createdAt).toLocaleString("ar-EG")}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-center text-gray-500">لا توجد إشعارات</p>
                )}
              </div>
            </div>
          )}
  
          {/* User Profile Image */}
          <div className="relative">
            <img
              src={adminImageUrl || Avatar}
              alt="Admin Avatar"
              className="h-11 w-11 rounded-full border border-gray-300 shadow-sm"
              onError={(e) => (e.target.src = Avatar)}
            />
            {/* Online/Offline Indicator */}
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                isOnline ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
          </div>
        </div>
      </div>
  
      {/* Second Navbar for Small Screens */}
      <div className="bg-white p-4 flex mt-3 items-center justify-between rounded-[20px] mx-4 md:mx-8 fixed top-[70px] left-0 right-0 lg:mr-[275px] lg:ml-[50px] z-10 shadow-md md:hidden">
        {/* Search Icon (Aligned to Left) */}
        <button
          className="p-2 rounded-full hover:bg-gray-100 transition"
          onClick={(e) => {
            e.stopPropagation();
            setShowSearch((prev) => !prev);
          }}
        >
          <FaSearch className="text-[#1F77BC] text-xl" />
        </button>
  
        {/* Centered Page Name */}
        <h2 className="text-lg font-bold text-[#1F77BC] absolute left-1/2 transform -translate-x-1/2">
          {currentPage}
        </h2>
  
        {/* Center Section - Search Bar */}
        <div
          className={`search-container transition-all duration-300 ${
            showSearch
              ? "absolute inset-x-0 top-full mt-2 bg-white p-2 shadow-md rounded-md"
              : "hidden"
          }`}
        >
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
            <input
              type="text"
              placeholder="بحث"
              className="pl-10 px-4 py-2 w-full rounded-2xl border bg-[#1F77BC] border-[#1F77BC] text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#B2CEF2] search-input"
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
            {searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-[20px] shadow-lg z-50 max-h-[300px] overflow-y-auto search-results-container">
                {searchResults.map((result) => (
                  <div key={result._id} className="p-3 hover:bg-gray-100 cursor-pointer">
                    <p className="text-[15px]">{result.firstName} {result.lastName}</p>
                    <p className="text-sm text-gray-500">{result.email}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
  
      {/* Sidebar (Visible when Hamburger Menu is clicked) */}
      {showSidebar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleSidebar}>
          <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-50">
            <div className="p-4">
              <h2 className="text-lg font-bold text-[#1F77BC]">القائمة</h2>
              {/* Add your sidebar links here */}
              <ul className="mt-4">
                <li className="p-2 hover:bg-gray-100 cursor-pointer">الرئيسية</li>
                <li className="p-2 hover:bg-gray-100 cursor-pointer">الإعدادات</li>
                <li className="p-2 hover:bg-gray-100 cursor-pointer">التقارير</li>
              </ul>
            </div>
          </div>
        </div>
      )}
  
      {/* Main Content */}
      <div className="md:mt-0 mt-[60px]">
        {/* Your main content goes here */}
      </div>
  
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-bold mb-4">هل أنت متأكد أنك تريد تسجيل الخروج؟</h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-2 rounded-lg text-lg"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  handleLogout();
                }}
                className="bg-[#1F77BC] text-white hover:bg-[#1565A3] px-4 py-2 rounded-lg text-lg"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;