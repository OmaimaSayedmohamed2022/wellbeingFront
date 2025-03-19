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

    const countryCodes = {
      "أفغانستان": "+93", // Afghanistan
      "ألبانيا": "+355", // Albania
      "الجزائر": "+213", // Algeria
      "أندورا": "+376", // Andorra
      "أنغولا": "+244", // Angola
      "أنتيغوا وباربودا": "+1-268", // Antigua and Barbuda
      "الأرجنتين": "+54", // Argentina
      "أرمينيا": "+374", // Armenia
      "أستراليا": "+61", // Australia
      "النمسا": "+43", // Austria
      "أذربيجان": "+994", // Azerbaijan
      "البهاما": "+1-242", // Bahamas
      "البحرين": "+973", // Bahrain
      "بنغلاديش": "+880", // Bangladesh
      "باربادوس": "+1-246", // Barbados
      "بيلاروسيا": "+375", // Belarus
      "بلجيكا": "+32", // Belgium
      "بليز": "+501", // Belize
      "بنين": "+229", // Benin
      "بوتان": "+975", // Bhutan
      "بوليفيا": "+591", // Bolivia
      "البوسنة والهرسك": "+387", // Bosnia and Herzegovina
      "بوتسوانا": "+267", // Botswana
      "البرازيل": "+55", // Brazil
      "بروناي": "+673", // Brunei
      "بلغاريا": "+359", // Bulgaria
      "بوركينا فاسو": "+226", // Burkina Faso
      "بوروندي": "+257", // Burundi
      "الرأس الأخضر": "+238", // Cape Verde
      "كمبوديا": "+855", // Cambodia
      "الكاميرون": "+237", // Cameroon
      "كندا": "+1", // Canada
      "جمهورية أفريقيا الوسطى": "+236", // Central African Republic
      "تشاد": "+235", // Chad
      "تشيلي": "+56", // Chile
      "الصين": "+86", // China
      "كولومبيا": "+57", // Colombia
      "جزر القمر": "+269", // Comoros
      "الكونغو": "+242", // Congo
      "كوستاريكا": "+506", // Costa Rica
      "كرواتيا": "+385", // Croatia
      "كوبا": "+53", // Cuba
      "قبرص": "+357", // Cyprus
      "جمهورية التشيك": "+420", // Czech Republic
      "الدنمارك": "+45", // Denmark
      "جيبوتي": "+253", // Djibouti
      "دومينيكا": "+1-767", // Dominica
      "جمهورية الدومينيكان": "+1-809", // Dominican Republic
      "الإكوادور": "+593", // Ecuador
      "مصر": "+20", // Egypt
      "السلفادور": "+503", // El Salvador
      "غينيا الاستوائية": "+240", // Equatorial Guinea
      "إريتريا": "+291", // Eritrea
      "إستونيا": "+372", // Estonia
      "إسواتيني": "+268", // Eswatini
      "إثيوبيا": "+251", // Ethiopia
      "فيجي": "+679", // Fiji
      "فنلندا": "+358", // Finland
      "فرنسا": "+33", // France
      "الغابون": "+241", // Gabon
      "غامبيا": "+220", // Gambia
      "جورجيا": "+995", // Georgia
      "ألمانيا": "+49", // Germany
      "غانا": "+233", // Ghana
      "اليونان": "+30", // Greece
      "غرينادا": "+1-473", // Grenada
      "غواتيمالا": "+502", // Guatemala
      "غينيا": "+224", // Guinea
      "غينيا بيساو": "+245", // Guinea-Bissau
      "غيانا": "+592", // Guyana
      "هايتي": "+509", // Haiti
      "هندوراس": "+504", // Honduras
      "المجر": "+36", // Hungary
      "آيسلندا": "+354", // Iceland
      "الهند": "+91", // India
      "إندونيسيا": "+62", // Indonesia
      "إيران": "+98", // Iran
      "العراق": "+964", // Iraq
      "أيرلندا": "+353", // Ireland
      "إسرائيل": "+972", // Israel
      "إيطاليا": "+39", // Italy
      "جامايكا": "+1-876", // Jamaica
      "اليابان": "+81", // Japan
      "الأردن": "+962", // Jordan
      "كازاخستان": "+7", // Kazakhstan
      "كينيا": "+254", // Kenya
      "كيريباتي": "+686", // Kiribati
      "كوريا الشمالية": "+850", // North Korea
      "كوريا الجنوبية": "+82", // South Korea
      "الكويت": "+965", // Kuwait
      "قيرغيزستان": "+996", // Kyrgyzstan
      "لاوس": "+856", // Laos
      "لاتفيا": "+371", // Latvia
      "لبنان": "+961", // Lebanon
      "ليسوتو": "+266", // Lesotho
      "ليبيريا": "+231", // Liberia
      "ليبيا": "+218", // Libya
      "ليختنشتاين": "+423", // Liechtenstein
      "ليتوانيا": "+370", // Lithuania
      "لوكسمبورغ": "+352", // Luxembourg
      "مدغشقر": "+261", // Madagascar
      "مالاوي": "+265", // Malawi
      "ماليزيا": "+60", // Malaysia
      "جزر المالديف": "+960", // Maldives
      "مالي": "+223", // Mali
      "مالطا": "+356", // Malta
      "جزر مارشال": "+692", // Marshall Islands
      "موريتانيا": "+222", // Mauritania
      "موريشيوس": "+230", // Mauritius
      "المكسيك": "+52", // Mexico
      "ولايات ميكرونيسيا المتحدة": "+691", // Micronesia
      "مولدوفا": "+373", // Moldova
      "موناكو": "+377", // Monaco
      "منغوليا": "+976", // Mongolia
      "الجبل الأسود": "+382", // Montenegro
      "المغرب": "+212", // Morocco
      "موزمبيق": "+258", // Mozambique
      "ميانمار": "+95", // Myanmar
      "ناميبيا": "+264", // Namibia
      "ناورو": "+674", // Nauru
      "نيبال": "+977", // Nepal
      "هولندا": "+31", // Netherlands
      "نيوزيلندا": "+64", // New Zealand
      "نيكاراغوا": "+505", // Nicaragua
      "النيجر": "+227", // Niger
      "نيجيريا": "+234", // Nigeria
      "مقدونيا الشمالية": "+389", // North Macedonia
      "النرويج": "+47", // Norway
      "عمان": "+968", // Oman
      "باكستان": "+92", // Pakistan
      "بالاو": "+680", // Palau
      "فلسطين": "+970", // Palestine
      "بنما": "+507", // Panama
      "بابوا غينيا الجديدة": "+675", // Papua New Guinea
      "باراغواي": "+595", // Paraguay
      "بيرو": "+51", // Peru
      "الفلبين": "+63", // Philippines
      "بولندا": "+48", // Poland
      "البرتغال": "+351", // Portugal
      "قطر": "+974", // Qatar
      "رومانيا": "+40", // Romania
      "روسيا": "+7", // Russia
      "رواندا": "+250", // Rwanda
      "سانت كيتس ونيفيس": "+1-869", // Saint Kitts and Nevis
      "سانت لوسيا": "+1-758", // Saint Lucia
      "سانت فينسنت والغرينادين": "+1-784", // Saint Vincent and the Grenadines
      "ساموا": "+685", // Samoa
      "سان مارينو": "+378", // San Marino
      "ساو تومي وبرينسيبي": "+239", // Sao Tome and Principe
      "السعودية": "+966", // Saudi Arabia
      "السنغال": "+221", // Senegal
      "صربيا": "+381", // Serbia
      "سيشل": "+248", // Seychelles
      "سيراليون": "+232", // Sierra Leone
      "سنغافورة": "+65", // Singapore
      "سلوفاكيا": "+421", // Slovakia
      "سلوفينيا": "+386", // Slovenia
      "جزر سليمان": "+677", // Solomon Islands
      "الصومال": "+252", // Somalia
      "جنوب أفريقيا": "+27", // South Africa
      "جنوب السودان": "+211", // South Sudan
      "إسبانيا": "+34", // Spain
      "سريلانكا": "+94", // Sri Lanka
      "السودان": "+249", // Sudan
      "سورينام": "+597", // Suriname
      "السويد": "+46", // Sweden
      "سويسرا": "+41", // Switzerland
      "سوريا": "+963", // Syria
      "تايوان": "+886", // Taiwan
      "طاجيكستان": "+992", // Tajikistan
      "تنزانيا": "+255", // Tanzania
      "تايلاند": "+66", // Thailand
      "تيمور الشرقية": "+670", // Timor-Leste
      "توغو": "+228", // Togo
      "تونغا": "+676", // Tonga
      "ترينيداد وتوباغو": "+1-868", // Trinidad and Tobago
      "تونس": "+216", // Tunisia
      "تركيا": "+90", // Turkey
      "تركمانستان": "+993", // Turkmenistan
      "توفالو": "+688", // Tuvalu
      "أوغندا": "+256", // Uganda
      "أوكرانيا": "+380", // Ukraine
      "الإمارات العربية المتحدة": "+971", // United Arab Emirates
      "المملكة المتحدة": "+44", // United Kingdom
      "الولايات المتحدة": "+1", // United States
      "أوروغواي": "+598", // Uruguay
      "أوزبكستان": "+998", // Uzbekistan
      "فانواتو": "+678", // Vanuatu
      "الفاتيكان": "+379", // Vatican City
      "فنزويلا": "+58", // Venezuela
      "فيتنام": "+84", // Vietnam
      "اليمن": "+967", // Yemen
      "زامبيا": "+260", // Zambia
      "زيمبابوي": "+263", // Zimbabwe
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
        <div className="flex gap-2 sm:gap-4">
          <Send
            className="w-6 h-6 sm:w-7 sm:h-7 bg-[#B2CEF2] rounded-md items-center justify-center mt-1 text-white cursor-pointer"
            onClick={() => handleEmailClick(beneficiaryEmail)}
          />
          <Phone
            className="w-6 h-6 sm:w-7 sm:h-7 bg-[#B2CEF2] rounded-md items-center justify-center mt-1 text-white cursor-pointer"
            onClick={() => handleWhatsAppClick(beneficiaryWhatsAppNumber, beneficiaryNationality)}
          />
        </div>
      </div>

      {/* Specialist Section */}
      <div className="flex justify-between items-center">
        <p>دكتور: {specialistName}</p>
        <div className="flex gap-2 sm:gap-4">
          <Send
            className="w-6 h-6 sm:w-7 sm:h-7 bg-[#B2CEF2] rounded-md items-center justify-center mt-1 text-white cursor-pointer"
            onClick={() => handleEmailClick(specialistEmail)}
          />
          <Phone
            className="w-6 h-6 sm:w-7 sm:h-7 bg-[#B2CEF2] rounded-md items-center justify-center mt-1 text-white cursor-pointer"
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
        <div className="flex gap-4 sm:gap-6 mt-2 items-center justify-center">
          <button
            onClick={handleAcceptClick}
            className="bg-white w-[75px] sm:w-[85px] font-medium hover:bg-[#B2CEF2] text-[#1F77BC] border-2 border-[#19649E] px-2 sm:px-3 py-1 rounded-[20px] text-sm sm:text-m"
          >
            قبول
          </button>
          <button
            onClick={handleCancelClick}
            className="bg-white w-[75px] sm:w-[85px] font-medium hover:bg-[#B2CEF2] text-[#1F77BC] border-2 border-[#19649E] px-2 sm:px-3 py-1 rounded-[20px] text-sm sm:text-m"
          >
            رفض
          </button>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
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
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
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
        `https://wellbeing-3en6.onrender.com/api/sessions/cancel/${sessionId}`,
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

  // Handle session acceptance for جلسات فوريه, استشارات مجانيه, and جلسات معلقه
  const handleAcceptPendingSession = async (sessionId) => {
    try {
      const response = await fetch(
        `https://wellbeing-3en6.onrender.com/api/sessions/update/pendingToScheduled/${sessionId}`,
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

  // Handle session acceptance for جلسات مجدوله
  const handleAcceptScheduledSession = async (sessionId) => {
    try {
      const response = await fetch(
        `https://wellbeing-3en6.onrender.com/api/sessions/update/${sessionId}`,
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

      // Refetch the scheduled sessions to update the state
      await fetchSessionsByStatus("Scheduled", setScheduledSessions);
    } catch (error) {
      console.error("Error confirming scheduled session:", error);
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                onAccept={handleAcceptScheduledSession}
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
                onAccept={handleAcceptPendingSession}
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
                onAccept={handleAcceptPendingSession}
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
                onAccept={handleAcceptScheduledSession}
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