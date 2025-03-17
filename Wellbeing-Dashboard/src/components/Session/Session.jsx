import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import Card from "../UI/card.jsx";
import SmallCard from "../UI/smallcard.jsx";
import { Phone, Send } from "lucide-react";
import { FaCalendarAlt } from "react-icons/fa";
import Modal from "./modal.jsx";
import TreatmentProgramForm from "./TreatmentProgramForm";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SpecialistCard({ spec, showActions, onCancel, onAccept }) {
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [showAcceptConfirmation, setShowAcceptConfirmation] = useState(false);

  const translationDictionary = {
    psychologicalDisorders: "اضطرابات نفسية",
    mentalHealth: "صحة نفسية",
    physicalHealth: "صحة جسدية",
    skillDevelopment: "تطوير مهارات",
  };

  // Default name, WhatsApp number, and email for "فادي (المشرف)"
  const specialistName = spec?.specialist?.firstName
    ? `${spec.specialist.firstName} ${spec.specialist.lastName}`
    : "فادي (المشرف)";
  const specialistWhatsAppNumber = spec?.specialist?.phone || "71785528";
  const specialistEmail = spec?.specialist?.email || "wellbeingallday@gmail.com";
  const specialistNationality = spec?.specialist?.nationality || "لبنان";

  // Beneficiary data
  const beneficiaryName =
    spec?.beneficiary?.[0]?.firstName && spec?.beneficiary?.[0]?.lastName
      ? `${spec.beneficiary[0].firstName} ${spec.beneficiary[0].lastName}`
      : "غير محدد";
  const beneficiaryWhatsAppNumber = spec?.beneficiary?.[0]?.phone || "";
  const beneficiaryEmail = spec?.beneficiary?.[0]?.email || "";
  const beneficiaryNationality = spec?.beneficiary?.[0]?.nationality || "مصر";

  // Function to format the session date in Arabic
  const formatSessionDate = (dateString) => {
    const date = new Date(dateString);
    const arabicDate = date.toLocaleDateString("ar-EG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "م" : "ص";
    const formattedTime = `${hours % 12 || 12}:${minutes
      .toString()
      .padStart(2, "0")} ${period}`;
    return `${arabicDate} - ${formattedTime}`;
  };

  // Function to translate the category
  const translateCategory = (category) => {
    return translationDictionary[category] || category;
  };

  // Handle WhatsApp click
  const handleWhatsAppClick = (phoneNumber, nationality, isFadi = false) => {
    if (!phoneNumber) {
      toast.error("لا يوجد رقم واتساب متاح للمستفيد", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    const countryCodeMap = {
      لبنان: "+961",
      مصر: "+20",
      // Add other nationalities as needed
    };

    const countryCode = isFadi ? "+961" : countryCodeMap[nationality] || "+20";
    const cleanedPhoneNumber = phoneNumber.replace(/^0+/, "").replace(/\D/g, "");
    const whatsappUrl = `https://wa.me/${countryCode}${cleanedPhoneNumber}`;
    window.open(whatsappUrl, "_blank");
  };

  // Handle email click
  const handleEmailClick = (email) => {
    if (!email) {
      toast.error("لا يوجد بريد إلكتروني متاح للمستفيد", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    const mailtoUrl = `mailto:${email}`;
    window.location.href = mailtoUrl;
  };

  // Handle cancel button click
  const handleCancelClick = () => {
    setShowCancelConfirmation(true);
  };

  // Handle accept button click
  const handleAcceptClick = () => {
    setShowAcceptConfirmation(true);
  };

  // Confirm cancel session
  const confirmCancel = () => {
    onCancel(spec._id);
    setShowCancelConfirmation(false);
  };

  // Confirm accept session
  const confirmAccept = async () => {
    try {
      await onAccept(spec._id);
      setShowAcceptConfirmation(false);
    } catch (error) {
      console.error("Error accepting session:", error);
    }
  };

  return (
    <SmallCard className="p-4 flex flex-col gap-2 font-medium">
      {/* Beneficiary Section */}
      <div className="flex justify-between items-center">
        <p>الاسم: {beneficiaryName}</p>
        <div className="flex gap-8">
          <Send
            className="w-7 h-7 bg-[#B2CEF2] rounded-md items-center justify-center mt-1 text-white cursor-pointer"
            onClick={() => handleEmailClick(beneficiaryEmail)}
          />
          <Phone
            className="w-7 h-7 bg-[#B2CEF2] rounded-md items-center justify-center mt-1 text-white cursor-pointer"
            onClick={() => handleWhatsAppClick(beneficiaryWhatsAppNumber, beneficiaryNationality)}
          />
        </div>
      </div>

      {/* Specialist Section */}
      <div className="flex justify-between items-center">
        <p>دكتور: {specialistName}</p>
        <div className="flex gap-8">
          <Send
            className="w-7 h-7 bg-[#B2CEF2] rounded-md items-center justify-center mt-1 text-white cursor-pointer"
            onClick={() => handleEmailClick(specialistEmail)}
          />
          <Phone
            className="w-7 h-7 bg-[#B2CEF2] rounded-md items-center justify-center mt-1 text-white cursor-pointer"
            onClick={() =>
              handleWhatsAppClick(
                specialistWhatsAppNumber,
                specialistNationality,
                specialistName === "فادي (المشرف)"
              )
            }
          />
        </div>
      </div>

      {/* Session Details */}
      <p>النوع: {spec.subcategory} ({translateCategory(spec.category)})</p>
      <p>نوع الجلسة: {spec.sessionType}</p>
      <p>سعر الجلسة: {spec?.specialist?.sessionPrice ? `${spec.specialist.sessionPrice} جنيه` : "غير محدد"}</p>
      <p>مدة الجلسة: {spec?.specialist?.sessionDuration ? `${spec.specialist.sessionDuration} دقيقة` : "غير محدد"}</p>
      <p>موعد الجلسه: {formatSessionDate(spec.sessionDate)}</p>

      {/* Actions */}
      {showActions && (
        <div className="flex gap-6 mt-2 items-center justify-center">
          <button
            onClick={handleAcceptClick}
            className="bg-white w-[85px] font-medium hover:bg-[#B2CEF2] text-[#1F77BC] border-2 border-[#19649E] px-3 py-1 rounded-[20px] text-m"
          >
            قبول
          </button>
          <button
            onClick={handleCancelClick}
            className="bg-white w-[85px] font-medium hover:bg-[#B2CEF2] text-[#1F77BC] border-2 border-[#19649E] px-3 py-1 rounded-[20px] text-m"
          >
            رفض
          </button>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4 text-[#1F77BC]">هل أنت متأكد من إلغاء الجلسة؟</h3>
            <div className="flex gap-4 justify-center mt-4">
              <button
                onClick={() => setShowCancelConfirmation(false)}
                className="bg-transparent text-[#1F77BC] border-2 border-[#1F77BC] hover:bg-[#B2CEF2] px-3 py-1 rounded-[20px] text-xs"
              >
                إلغاء
              </button>
              <button
                onClick={confirmCancel}
                className="bg-transparent text-[#1F77BC] border-2 border-[#1F77BC] hover:bg-[#B2CEF2] px-3 py-1 rounded-[20px] text-xs"
              >
                تأكيد الإلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Accept Confirmation Modal */}
      {showAcceptConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4 text-[#1F77BC]">هل أنت متأكد من قبول الجلسة؟</h3>
            <div className="flex gap-4 justify-center mt-4">
              <button
                onClick={() => setShowAcceptConfirmation(false)}
                className="bg-transparent text-[#1F77BC] border-2 border-[#1F77BC] hover:bg-[#B2CEF2] px-3 py-1 rounded-[20px] text-xs"
              >
                إلغاء
              </button>
              <button
                onClick={confirmAccept}
                className="bg-transparent text-[#1F77BC] border-2 border-[#1F77BC] hover:bg-[#B2CEF2] px-3 py-1 rounded-[20px] text-xs"
              >
                تأكيد القبول
              </button>
            </div>
          </div>
        </div>
      )}
    </SmallCard>
  );
}

export default function Session() {
  const [sessionData, setSessionData] = useState({
    totalSessions: 0,
    paidSessions: 0,
    freeSessions: 0,
    paidPercentage: "0.00%",
    freePercentage: "100.00%",
  });
  const [showForm, setShowForm] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [treatmentPrograms, setTreatmentPrograms] = useState([]);
  const [scheduledSessions, setScheduledSessions] = useState([]);
  const [completedSessions, setCompletedSessions] = useState([]);
  const [pendingSessions, setPendingSessions] = useState([]);
  const [canceledSessions, setCanceledSessions] = useState([]);
  const [groupTherapySessions, setGroupTherapySessions] = useState([]);
  const [instantSessions, setInstantSessions] = useState([]);
  const [freeConsultations, setFreeConsultations] = useState([]);
  const [currentSessions, setCurrentSessions] = useState([]);
  const navigate = useNavigate();

  // Fetch the token from local storage
  const token = localStorage.getItem("token");

  // Redirect to login if no token is found
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleAddProgram = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  // Handle session cancellation
  const handleCancelSession = async (sessionId) => {
    try {
      const response = await fetch(
        `https://wellbeingproject.onrender.com/api/sessions/cancel/${sessionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to cancel session");

      // Update the state to remove the deleted session
      setScheduledSessions((prevSessions) =>
        prevSessions.filter((session) => session._id !== sessionId)
      );

      toast.success("تم إلغاء الجلسة بنجاح", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error canceling session:", error);
      toast.error("فشل في إلغاء الجلسة", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Handle session acceptance
  const handleAcceptPendingSession = async (sessionId) => {
    try {
      const response = await fetch(
        `https://wellbeingproject.onrender.com/api/sessions/update/pendingToScheduled/${sessionId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to confirm session");

      toast.success("تم قبول الجلسة بنجاح", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Refetch the pending and scheduled sessions to update the state
      await fetchSessionsByStatus("Pending", setPendingSessions);
      await fetchSessionsByStatus("Scheduled", setScheduledSessions);
    } catch (error) {
      console.error("Error confirming pending session:", error);
      toast.error(`فشل في قبول الجلسة: ${error.message}`, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleAcceptOtherSession = async (sessionId) => {
    try {
      const response = await fetch(
        `https://wellbeingproject.onrender.com/api/admin/confirmeSessionUpdate/${sessionId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to confirm session");

      toast.success("تم قبول الجلسة بنجاح", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Refetch the relevant sessions to update the state
      await fetchSessionsByStatus("Instant", setInstantSessions);
      await fetchSessionsByStatus("Free", setFreeConsultations);
    } catch (error) {
      console.error("Error confirming other session:", error);
      toast.error(`فشل في قبول الجلسة: ${error.message}`, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Fetch sessions by status
  const fetchSessionsByStatus = async (status, setState) => {
    try {
      const response = await fetch(
        `https://wellbeingproject.onrender.com/api/sessions/status/${status}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error(`Failed to fetch ${status} sessions`);
      const data = await response.json();
      setState(data.sessions);
    } catch (error) {
      console.error(`Error fetching ${status} sessions:`, error);
    }
  };

  // Fetch group therapy sessions
  const fetchGroupTherapySessions = async () => {
    try {
      const response = await fetch(
        "https://wellbeingproject.onrender.com/api/admin/groupTherapy",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch group therapy sessions");
      const data = await response.json();
      setGroupTherapySessions(data.sessions);
    } catch (error) {
      console.error("Error fetching group therapy sessions:", error);
    }
  };

  // Fetch instant and free consultation sessions
  const fetchInstantAndFreeSessions = async () => {
    try {
      const response = await fetch(
        "https://wellbeingproject.onrender.com/api/admin/Instant/Free",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch instant/free sessions");
      const data = await response.json();
      setInstantSessions(data.instantSessions);
      setFreeConsultations(data.freeConsultations);
    } catch (error) {
      console.error("Error fetching instant/free sessions:", error);
    }
  };

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await fetch(
          "https://wellbeingproject.onrender.com/api/admin/countSession",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch session data");
        const data = await response.json();
        setSessionData({
          totalSessions: data.totalSessions,
          paidSessions: data.paidSessions,
          freeSessions: data.freeSessions,
          paidPercentage: data.paidPercentage,
          freePercentage: data.freePercentage,
        });
      } catch (error) {
        console.error("Error fetching session data:", error);
      }
    };

    const fetchTreatmentPrograms = async () => {
      try {
        const response = await fetch(
          "https://wellbeingproject.onrender.com/api/treatment",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch treatment programs");
        const data = await response.json();
        processTreatmentPrograms(data.programs);
      } catch (error) {
        console.error("Error fetching treatment programs:", error);
      }
    };

    const fetchCurrentSessions = async () => {
      try {
        const response = await fetch(
          "https://wellbeingproject.onrender.com/api/admin/currentSessions",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch current sessions");
        const data = await response.json();
        setCurrentSessions(data.sessions);
      } catch (error) {
        console.error("Error fetching current sessions:", error);
      }
    };

    if (token) {
      fetchSessionData();
      fetchTreatmentPrograms();
      fetchSessionsByStatus("Scheduled", setScheduledSessions);
      fetchSessionsByStatus("Completed", setCompletedSessions);
      fetchSessionsByStatus("Pending", setPendingSessions);
      fetchSessionsByStatus("Canceled", setCanceledSessions);
      fetchGroupTherapySessions();
      fetchInstantAndFreeSessions();
      fetchCurrentSessions();
    }
  }, [token]);

  // Process treatment programs to remove duplicates and translate names
  const processTreatmentPrograms = (programs) => {
    const uniquePrograms = Array.from(
      new Set(programs.map((program) => program.name))
    ).map((name) => ({
      name: translateProgramName(name),
    }));
    setTreatmentPrograms(uniquePrograms);
  };

  // Translation dictionary
  const translationDictionary = {
    Anxiety: "القلق",
    "Depression Treatment": "علاج الاكتئاب",
    "Stress Management": "إدارة التوتر",
    "Cognitive Behavioral Therapy (CBT)": "العلاج السلوكي المعرفي",
  };

  // Function to translate program names
  const translateProgramName = (name) => {
    return translationDictionary[name] || name;
  };

  // Data for the pie chart
  const treatmentProgramData = [
    {
      name: "المدفوعة",
      value: parseFloat(sessionData.paidPercentage),
      color: "#B2CEF2",
    },
    {
      name: "المجانية",
      value: parseFloat(sessionData.freePercentage),
      color: "#1F77BC",
    },
  ];

  return (
    <div className="container mx-auto min-h-screen p-4 lg:p-6 flex flex-col gap-6 text-[#1F77BC]">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover />

      {/* Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 items-center justify-center gap-4">
        <div className="grid grid-cols-3 gap-4">
          {/* Total Sessions Card */}
          <div className="bg-[#1F77BC] p-4 rounded-[20px] shadow-md flex flex-col items-center text-white">
            <FaCalendarAlt className="text-2xl" />
            <span className="text-xl font-bold mt-2">{sessionData.totalSessions}</span>
            <span className="mt-2 text-sm text-center">عدد الجلسات هذا الشهر</span>
          </div>
          {/* Paid Sessions Card */}
          <div className="bg-[#1F77BC] p-4 rounded-[20px] shadow-md flex flex-col items-center text-white">
            <FaCalendarAlt className="text-2xl" />
            <span className="text-xl font-bold mt-2">{sessionData.paidSessions}</span>
            <span className="mt-2 text-sm text-center">عدد الجلسات المدفوعة هذا الشهر</span>
          </div>
          {/* Free Sessions Card */}
          <div className="bg-[#1F77BC] p-4 rounded-[20px] shadow-md flex flex-col items-center text-white">
            <FaCalendarAlt className="text-2xl" />
            <span className="text-xl font-bold mt-2">{sessionData.freeSessions}</span>
            <span className="mt-2 text-sm text-center">عدد الجلسات المجانية هذا الشهر</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Treatment Programs Chart */}
          <Card className="p-4 text-center">
            <h3 className="font-bold mb-2 text-sm sm:text-base">الجلسات</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart width={180} height={180}>
                <Pie data={treatmentProgramData} dataKey="value" cx="50%" cy="50%" outerRadius={60} label>
                  {treatmentProgramData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
          <div className="items-center justify-center">
            <Card className="p-4 flex flex-col items-center justify-center bg-white shadow-md rounded-2xl">
              <h3 className="font-semibold mb-4 text-base text-[#1F77BC] text-center">البرامج العلاجية</h3>
              <SmallCard className="w-full p-4 rounded-[20px] mb-4 overflow-auto max-h-[130px]">
                {treatmentPrograms.length > 0 ? (
                  <ul className="list-decimal space-y-1 text-right pr-4">
                    {treatmentPrograms.map((program, index) => (
                      <li key={index} className="text-right">{program.name}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-center">لا توجد برامج علاجية متاحة.</p>
                )}
              </SmallCard>
              <div className="flex justify-center w-full">
                <button
                  onClick={handleAddProgram}
                  className="bg-[#1F77BC] w-16 h-12 text-white font-bold rounded-[20px] flex items-center justify-center shadow-lg hover:bg-[#B2CEF2]"
                  title="إضافة برنامج"
                >
                  +
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Modal isOpen={showForm} onClose={handleCloseForm}>
        <TreatmentProgramForm onClose={handleCloseForm} />
      </Modal>

      {/* Confirmation Modal for Cancellation */}
      <Modal isOpen={showCancelModal} onClose={() => setShowCancelModal(false)}>
        <div className="p-6 flex flex-col items-center justify-center">
          <h3 className="text-lg font-bold mb-4 text-center">هل أنت متأكد من إلغاء الجلسة؟</h3>
          <div className="flex gap-4 justify-center mt-4">
            <button
              onClick={() => setShowCancelModal(false)}
              className="bg-transparent text-[#1F77BC] border-2 border-[#1F77BC] hover:bg-[#B2CEF2] px-3 py-1 rounded-[20px] text-xs"
            >
              إلغاء
            </button>
            <button
              onClick={handleCancelSession}
              className="bg-transparent text-[#1F77BC] border-2 border-[#1F77BC] hover:bg-[#B2CEF2] px-3 py-1 rounded-[20px] text-xs"
            >
              تأكيد الإلغاء
            </button>
          </div>
        </div>
      </Modal>

      {/* Appointments Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments (Taller Card) */}
        <Card className="p-4 max-h-[480px]">
          <h3 className="text-lg font-bold mb-2">جلسات قادمه </h3>
          <div className="space-y-4">
            {scheduledSessions.map((session, index) => (
              <SpecialistCard
                key={index}
                spec={session}
                showActions2={true}
                onCancel={handleCancelSession}
                onAccept={handleAcceptOtherSession}
              />
            ))}
          </div>
        </Card>
        {/* Cancelled Appointments (Taller Card) */}
        <Card className="p-4 max-h-[480px]">
          <h3 className="text-lg font-bold mb-2">جلسات حاليه</h3>
          <div className="space-y-4">
            {currentSessions.map((session, index) => (
              <SpecialistCard key={index} spec={session} showActions2={true} />
            ))}
          </div>
        </Card>
        {/* Scheduled Appointments (Shorter Card) */}
        <Card className="p-4 max-h-[480px]">
          <h3 className="text-lg font-bold mb-2">جلسات فوريه</h3>
          <div className="space-y-4">
            {instantSessions.map((session, index) => (
              <SpecialistCard
                key={index}
                spec={session}
                showActions={true}
                onCancel={handleCancelSession}
                onAccept={handleAcceptOtherSession}
              />
            ))}
          </div>
        </Card>
        {/* Pending Appointments (Shorter Card) */}
        <Card className="p-4 max-h-[480px]">
          <h3 className="text-lg font-bold mb-2">استشارات مجانيه</h3>
          <div className="space-y-4">
            {freeConsultations.map((session, index) => (
              <SpecialistCard
                key={index}
                spec={session}
                showActions={true}
                onCancel={handleCancelSession}
                onAccept={handleAcceptOtherSession}
              />
            ))}
          </div>
        </Card>
        {/* Upcoming Appointments (Taller Card) */}
        <Card className="p-4 max-h-[480px]">
          <h3 className="text-lg font-bold mb-2">علاج جماعي</h3>
          <div className="space-y-4">
            {groupTherapySessions.map((session, index) => (
              <SpecialistCard key={index} spec={session} />
            ))}
          </div>
        </Card>
        {/* Cancelled Appointments (Taller Card) */}
        <Card className="p-4 row-span-2 max-h-[480px]">
          <h3 className="text-lg font-bold mb-2">جلسات ملغاه</h3>
          <div className="space-y-4">
            {canceledSessions.map((session, index) => (
              <SpecialistCard key={index} spec={session} />
            ))}
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scheduled Appointments */}
        <Card className="p-4 max-h-[480px]">
          <h3 className="text-lg font-bold mb-2">جلسات مجدوله </h3>
          <div className="space-y-4">
            {scheduledSessions.map((session, index) => (
              <SpecialistCard
                key={index}
                spec={session}
                showActions={true}
                onCancel={handleCancelSession}
                onAccept={handleAcceptOtherSession}
              />
            ))}
          </div>
        </Card>
        {/* Scheduled Appointments */}
        <Card className="p-4 max-h-[480px]">
          <h3 className="text-lg font-bold mb-2">جلسات معلقه</h3>
          <div className="space-y-4">
            {pendingSessions.map((session, index) => (
              <SpecialistCard
                key={index}
                spec={session}
                showActions={true}
                onCancel={handleCancelSession}
                onAccept={handleAcceptPendingSession}
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}