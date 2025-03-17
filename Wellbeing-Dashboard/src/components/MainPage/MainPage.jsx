// components/MainPage.js
import React, { useEffect, useState, useContext } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaUsers, FaUserPlus, FaCalendarAlt } from "react-icons/fa";
import GaugeChart from "react-gauge-chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { AuthContext } from "../../context/authContext";
import { apiRequest } from "../../context/api.js"; // Import the apiRequest function
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Avatar from "../../assets/images/person.jpg";
import SmallCard from "../UI/smallcard.jsx";

const MainPage = () => {
  const { token, user, logout } = useContext(AuthContext); // Retrieve token and logout function from AuthContext
  const [appointments, setAppointments] = useState(0);
  const [beneficiaries, setBeneficiaries] = useState(0);
  const [specialists, setSpecialists] = useState(0);
  const [advertisementData, setAdvertisementData] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0); // State for total earnings
  const [percentage, setPercentage] = useState(0); // State for percentage of earnings
  const [sessionsData, setSessionsData] = useState([]);
  const [genderData, setGenderData] = useState([
    { name: "الرجال", value: 0, color: "#1F77BC" },
    { name: "السيدات", value: 0, color: "#B2CEF2" },
  ]);
  const [newBeneficiariesData, setNewBeneficiariesData] = useState([]);

  useEffect(() => {
    if (!token) {
      console.error("Authentication token is missing.");
      return;
    }
    // Fetch appointments (requires token)
    const fetchAppointments = async () => {
      try {
        const response = await apiRequest("https://wellbeingproject.onrender.com/api/admin/countSession", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }, { token, logout });
        if (response.ok) {
          const data = await response.json();
          setAppointments(data.totalSessions);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };
    // Fetch beneficiaries (requires token)
    const fetchBeneficiaries = async () => {
      try {
        const response = await apiRequest("https://wellbeingproject.onrender.com/api/admin/countBeneficiary", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }, { token, logout });
        if (response.ok) {
          const data = await response.json();
          setBeneficiaries(data.count);
        }
      } catch (error) {
        console.error("Error fetching beneficiaries:", error);
      }
    };
    // Fetch specialists (requires token)
    const fetchSpecialists = async () => {
      try {
        const response = await apiRequest("https://wellbeingproject.onrender.com/api/admin/countSpecialist", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }, { token, logout });
        if (response.ok) {
          const data = await response.json();
          setSpecialists(data.count);
        }
      } catch (error) {
        console.error("Error fetching specialists:", error);
      }
    };
    // Fetch advertisement data (requires token)
    const fetchSessionsData = async () => {
      try {
        const response = await apiRequest("https://wellbeingproject.onrender.com/api/admin/countAdv", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }, { token, logout });
        if (response.ok) {
          const data = await response.json();
          const monthsInArabic = [
            "يناير",
            "فبراير",
            "مارس",
            "أبريل",
            "مايو",
            "يونيو",
            "يوليو",
            "أغسطس",
            "سبتمبر",
            "أكتوبر",
            "نوفمبر",
            "ديسمبر",
          ];
          const formattedData = data.map((item) => ({
            name: item.month !== null ? monthsInArabic[item.month - 1] : "غير محدد",
            rate: parseFloat(item.rate),
          }));
          setAdvertisementData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching advertisement data:", error);
      }
    };
    // Fetch earnings data (requires token)
    const fetchEarnings = async () => {
      try {
        const response = await apiRequest("https://wellbeingproject.onrender.com/api/admin/calcPayments", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }, { token, logout });
        if (response.ok) {
          const data = await response.json();
          const total = data.reduce((acc, curr) => acc + curr.earnings, 0); // Sum up earnings
          setTotalEarnings(total);
          // Calculate percentage based on total earnings (no target value)
          const maxEarnings = 10000; 
          const percentage = (total / maxEarnings).toFixed(2);
          setPercentage(percentage);
        }
      } catch (error) {
        console.error("Failed to fetch earnings", error);
      }
    };
    // Fetch gender data (requires token)
    const fetchGenderData = async () => {
      try {
        const response = await apiRequest("https://wellbeingproject.onrender.com/api/admin/countGender", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }, { token, logout });
        if (response.ok) {
          const data = await response.json();
          setGenderData([
            { name: "الرجال", value: data.male, color: "#1F77BC" },
            { name: "السيدات", value: data.female, color: "#B2CEF2" },
          ]);
        }
      } catch (error) {
        console.error("Error fetching gender data:", error);
      }
    };
    const fetchSessionsDate = async () => {
      try {
        const response = await apiRequest("https://wellbeingproject.onrender.com/api/admin/allUpcomingSessions", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }, { token, logout });
        if (response.ok) {
          const data = await response.json();
          processSessionsData(data.scheduledSessions);
        }
      } catch (error) {
        console.error("Error fetching sessions data:", error);
      }
    };
    // Fetch new beneficiaries data
    const fetchNewBeneficiaries = async () => {
      try {
        const response = await apiRequest("https://wellbeingproject.onrender.com/api/admin/newBeneficary", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }, { token, logout });
        if (response.ok) {
          const data = await response.json();
          processBeneficiariesData(data.beneficiaries); // Process the fetched data
        }
      } catch (error) {
        console.error("Error fetching new beneficiaries:", error);
      }
    };
    fetchNewBeneficiaries();
    fetchSessionsData();
    fetchAppointments();
    fetchBeneficiaries();
    fetchSpecialists();
    fetchEarnings();
    fetchGenderData();
    fetchSessionsDate();
  }, [token, logout]); // Re-run effect if token or logout changes

  const processSessionsData = (sessions) => {
    const monthsInArabic = [
      "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
      "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
    ];
    const sessionsByMonth = sessions.reduce((acc, session) => {
      const date = new Date(session.sessionDate);
      const month = date.getMonth(); // getMonth() returns 0-11
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});
    const formattedData = monthsInArabic.map((month, index) => ({
      name: month,
      الجلسات: sessionsByMonth[index] || 0,
    }));
    setSessionsData(formattedData);
  };

  // Process the beneficiaries data to count by month
  const processBeneficiariesData = (beneficiaries) => {
    const monthsInArabic = [
      "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
      "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
    ];
    // Count beneficiaries by month
    const beneficiariesByMonth = beneficiaries.reduce((acc, beneficiary) => {
      const date = new Date(beneficiary.createdAt);
      const month = date.getMonth(); // getMonth() returns 0-11
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});
    // Format the data for the bar chart
    const formattedData = monthsInArabic.map((month, index) => ({
      name: month,
      المستفيدين: beneficiariesByMonth[index] || 0, // Default to 0 if no data for the month
    }));
    setNewBeneficiariesData(formattedData); // Update the state
  };

  return (
    <div className="p-4 min-h-screen" dir="rtl">
      <ToastContainer />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 items-center justify-center">
        {/* Top Stats Cards */}
        <div className="bg-white p-4 rounded-[20px] shadow-md">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Appointments Card */}
            <div className="bg-[#1F77BC] p-4 rounded-[20px] shadow-md flex flex-col items-center text-white">
              <FaCalendarAlt className="text-2xl" />
              <span className="mt-2 text-sm">المواعيد</span>
              <span className="text-xl font-bold mt-2">{appointments}</span>
            </div>
            {/* Total Beneficiaries Card */}
            <div className="bg-[#1F77BC] p-4 rounded-[20px] shadow-md flex flex-col items-center text-white">
              <FaUserPlus className="text-2xl" />
              <span className="mt-2 text-sm">جميع المستفيدين</span>
              <span className="text-xl font-bold mt-2">{beneficiaries}</span>
            </div>
            {/* Total Specialists Card */}
            <div className="bg-[#1F77BC] p-4 rounded-[20px] shadow-md flex flex-col items-center text-white">
              <FaUsers className="text-2xl" />
              <span className="mt-2 text-sm">جميع المتخصصين</span>
              <span className="text-xl font-bold mt-2">{specialists}</span>
            </div>
          </div>
        </div>
        {/* Advertisement Stats (Area Chart) */}
        <div className="bg-white p-4 rounded-[20px] shadow-md">
          <h2 className="text-[#1F77BC] text-md font-semibold">نسبة الاعلانات</h2>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart
              data={advertisementData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1F77BC" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#B2CEF2" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="rate"
                stroke="#1F77BC"
                fillOpacity={1}
                fill="url(#colorRate)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Middle Row: Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Bar Chart */}
        <div className="bg-white shadow-md p-4 rounded-[20px]">
          <h3 className="text-md font-bold text-[#1F77BC] mb-2">المستفيدين الجدد</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={newBeneficiariesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="المستفيدين" fill="#1F77BC" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Revenue Widget (Gauge Chart) */}
        <div className="bg-white p-4 rounded-[20px] shadow-md">
          <h2 className="text-[#1F77BC] text-md font-semibold">الربح</h2>
          <div className="flex flex-col items-center justify-center">
            <GaugeChart
              id="gauge-chart"
              nrOfLevels={20}
              percent={percentage}
              colors={["#1F77BC", "#B2CEF2"]}
              arcWidth={0.3}
              textColor="#1F77BC"
            />
            <div className="mt-2 text-center">
              <p className="text-sm text-gray-700">إجمالي الربح: ${totalEarnings}</p>
            </div>
          </div>
        </div>
        {/* Pie Chart */}
        <div className="bg-white shadow-md p-4 rounded-[20px] flex flex-col items-center justify-center">
          <h3 className="text-base font-bold text-[#1F77BC] mb-2">المستفيدين</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={60}
                dataKey="value"
              >
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Sessions Graph */}
        <div className="bg-white p-4 rounded-[20px] shadow-md">
          <h2 className="text-[#1F77BC] text-md font-semibold">كل الجلسات الشهرية</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={sessionsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="الجلسات" stroke="#1F77BC" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Calendar */}
        <div className="bg-white p-4 rounded-2xl shadow-md flex flex-col items-center">
          <h2 className="text-[#1F77BC] text-md font-semibold mb-2">التقويم</h2>
          <div className="w-full flex justify-center items-center">
            <Calendar
              className="w-full max-w-sm bg-[#1F77BC] text-white p-4 rounded-2xl shadow-lg"
              tileClassName={({ date, view }) =>
                "text-white text-center p-2 rounded-full hover:bg-white hover:text-[#1F77BC] transition"
              }
              navigationLabel={({ date }) => (
                <span className="text-white font-bold">
                  {date.toLocaleString("en-US", { month: "long", year: "numeric" })}
                </span>
              )}
              prevLabel={<span className="text-white font-bold">‹</span>}
              nextLabel={<span className="text-white font-bold">›</span>}
              formatShortWeekday={(locale, date) =>
                date.toLocaleDateString("en-US", { weekday: "short" }).charAt(0)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;