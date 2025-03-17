import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import Card from "../UI/card.jsx";
import SmallCard from "../UI/smallcard.jsx";
import { Phone, Mail } from "lucide-react";
import Avatar from "../../assets/images/person.jpg";
import { useNavigate } from "react-router-dom";
import  { Toaster } from "react-hot-toast"; // Import react-hot-toast for notifications
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Country codes for WhatsApp
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

// Utility function to format phone numbers for WhatsApp
const formatPhoneNumberForWhatsApp = (phone, nationality) => {
  if (!phone || !nationality) return "";
  const cleanedPhone = phone.replace(/\D/g, "");
  const phoneWithoutZero = cleanedPhone.replace(/^0+/, "");
  const countryCode = countryCodes[nationality] || "+20";
  return `${countryCode}${phoneWithoutZero}`;
};

// Confirmation messages in Arabic
const confirmAcceptMessage = "هل أنت متأكد من قبول طلب إعادة الجدولة؟";
const confirmCancelMessage = "هل أنت متأكد من رفض طلب إعادة الجدولة؟";

// Confirmation dialog component
const ConfirmationForm = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-md text-center">
        <h2 className="text-xl font-bold mb-4">تأكيد الإجراء</h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            className="bg-transparent text-[#1F77BC] border-2 border-[#1F77BC] hover:bg-[#B2CEF2] px-6 py-2 rounded-[20px] text-lg"
            onClick={(e) => {
              e.stopPropagation(); // Prevent event propagation
              onConfirm(); // Call the original onConfirm function
            }}
          >
            نعم
          </button>
          <button
            className="bg-transparent text-[#1F77BC] border-2 border-[#1F77BC] hover:bg-[#B2CEF2] px-6 py-2 rounded-[20px] text-lg"
            onClick={(e) => {
              e.stopPropagation(); // Prevent event propagation
              onCancel(); // Call the original onCancel function
            }}
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};

// SpecialistCard Component
function SpecialistCard({ spec, showActions, onAccept, onCancel }) {
  const navigate = useNavigate();

  // Handle click on the card
  const handleClick = () => {
    console.log("Navigating to:", `/مستفيد/${spec.firstName}-${spec.lastName}`);
    navigate(`/مستفيد/${spec.firstName}-${spec.lastName}`, { state: { benef: spec } });
  };

  // State for confirmation dialog
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [actionType, setActionType] = useState(null); // "accept" or "cancel"

  // Handle accept button click
  const handleAcceptClick = (e) => {
    e.stopPropagation(); // Prevent the click event from bubbling up to the parent
    setActionType("accept");
    setShowConfirmation(true);
  };

  // Handle cancel button click
  const handleCancelClick = (e) => {
    e.stopPropagation(); // Prevent the click event from bubbling up to the parent
    setActionType("cancel");
    setShowConfirmation(true);
  };

  // Handle confirmation
  const handleConfirm = () => {
    if (actionType === "accept") {
      onAccept(spec.id); // Pass the session ID to onAccept
    } else if (actionType === "cancel") {
      onCancel(spec.id); // Pass the session ID to onCancel
    }
    setShowConfirmation(false);
  };

  // Handle closing the confirmation dialog
  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  // WhatsApp and email links
const whatsappLink =
spec.phone && spec.nationality
  ? `https://wa.me/${formatPhoneNumberForWhatsApp(spec.phone, spec.nationality)}`
  : (() => {
      alert("No WhatsApp link found. Using default number.");
    })();

const emailLink = spec.email 
? `mailto:${spec.email}` 
: (() => {
      alert("No email link found. Using default email.");
    })();


  // Check if the beneficiary name is "غير محدد غير محدد"
  const isUnknownBeneficiary = spec.firstName === "غير محدد" && spec.lastName === "غير محدد";

  // Update doctor information if it's "غير محدد"
  const doctorName = spec.doctor === "غير محدد" ? "فادي (المشرف)" : spec.doctor;
  const doctorWhatsApp = spec.doctor === "غير محدد" ? "+96171785528" : spec.phone;
  const doctorEmail = spec.doctor === "غير محدد" ? "wellbeingallday@gmail.com" : spec.email;

  // WhatsApp and email links for the doctor
  const doctorWhatsappLink = `https://wa.me/${doctorWhatsApp}`;
  const doctorEmailLink = `mailto:${doctorEmail}`;

  return (
    <>
      {/* SmallCard with onClick handler */}
      <SmallCard className="p-4 flex items-center cursor-pointer">
        <div onClick={handleClick} className="flex-2">
          <p>الاسم: {spec.firstName} {spec.lastName}</p>
          <p>الحالة النفسية: {spec.work}</p>
          <p>دكتور: {doctorName}</p>
        </div>
        <div className="flex-1">
          <img src={spec.imageUrl || Avatar} alt="Avatar" className="w-16 h-16 bg-gray-300 rounded-full mr-9" />
          <div className="flex gap-2 mt-2 mr-10">
            {/* Email link */}
            <a
              href={isUnknownBeneficiary ? "#" : emailLink}
              onClick={(e) => {
                e.stopPropagation();
                if (isUnknownBeneficiary) {
                  toast.error("لا يوجد بريد إلكتروني لهذا المستفيد", {
                    position: "top-right",
                  });
                }
              }}
            >
              <Mail className="text-white cursor-pointer" />
            </a>
            {/* WhatsApp link */}
            <a
              href={isUnknownBeneficiary ? "#" : whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.stopPropagation();
                if (isUnknownBeneficiary) {
                  toast.error("لا يوجد واتساب لهذا المستفيد", {
                    position: "top-right",
                  });
                }
              }}
            >
              <Phone className="text-white cursor-pointer" />
            </a>
          </div>
          {/* Action buttons (accept/cancel) */}
          {showActions && (
            <div className="flex gap-2 mt-2 mr-2">
              <button
                className="bg-white font-medium hover:bg-[#B2CEF2] text-[#1F77BC] border-2 border-[#19649E] px-3 py-1 rounded-[20px] text-xs"
                onClick={handleAcceptClick}
              >
                قبول
              </button>
              <button
                className="bg-white font-medium hover:bg-[#B2CEF2] text-[#1F77BC] border-2 border-[#19649E] px-3 py-1 rounded-[20px] text-xs"
                onClick={handleCancelClick}
              >
                رفض
              </button>
            </div>
          )}
        </div>
      </SmallCard>
      {/* Confirmation dialog */}
      {showConfirmation && (
        <ConfirmationForm
          message={actionType === "accept" ? confirmAcceptMessage : confirmCancelMessage}
          onConfirm={handleConfirm}
          onCancel={handleCloseConfirmation}
        />
      )}
      {/* Toast container */}
      <Toaster position="top-right" />
    </>
  );
}

export default function Beneficiary() {
  const [specialists, setSpecialists] = useState([]);
  const [attendanceData, setAttendanceData] = useState([
    { name: "معدل الحضور", value: 0, color: "#4A90E2" },
    { name: "باقي", value: 100, color: "#B2CEF2" },
  ]);
  const [attendanceRate, setAttendanceRate] = useState("0.00%");
  const [beneficiariesData, setBeneficiariesData] = useState([]);
  const [cancelledSessions, setCancelledSessions] = useState([]);
  const [specialtiesData, setSpecialtiesData] = useState([]);
  const [rescheduledSessions, setRescheduledSessions] = useState([]);

  // Fetch and process data functions
  const fetchBeneficiariesData = async () => {
    try {
      const response = await fetch("https://wellbeingproject.onrender.com/api/admin/allBeneficary", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      processBeneficiariesData(data.beneficiaries);
    } catch (error) {
      console.error("Error fetching beneficiaries data:", error);
    }
  };

  const processBeneficiariesData = (beneficiaries) => {
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
    const beneficiariesByMonth = beneficiaries.reduce((acc, beneficiary) => {
      const date = new Date(beneficiary.createdAt);
      const month = date.getMonth();
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});
    const formattedData = monthsInArabic.map((month, index) => ({
      name: month,
      beneficiaries: beneficiariesByMonth[index] || 0,
    }));
    setBeneficiariesData(formattedData);
  };

  const fetchRescheduledSessions = async () => {
    try {
      const response = await fetch("https://wellbeingproject.onrender.com/api/sessions/status/Requested", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data.sessions;
    } catch (error) {
      console.error("Error fetching rescheduled sessions:", error);
      return [];
    }
  };

  const categoryTranslations = {
    mentalHealth: "الصحة النفسية",
    physicalHealth: "الصحة الجسدية",
    psychologicalDisorders: "الاضطرابات النفسية",
    skillDevelopment: "تطوير المهارات",
  };

  const processRescheduledSessions = (sessions) => {
    return sessions.map((session) => {
      const beneficiary = session.beneficiary[0];
      const translatedCategory = categoryTranslations[session.category] || session.category;
      let doctors = [];
      if (Array.isArray(session.specialists)) {
        doctors = session.specialists.map(
          (specialist) => `${specialist.firstName} ${specialist.lastName} (${specialist.work})`
        );
      } else if (session.specialist) {
        doctors.push(`${session.specialist.firstName} ${session.specialist.lastName} (${session.specialist.work})`);
      }
      return {
        id: beneficiary._id,
        firstName: beneficiary.firstName,
        lastName: beneficiary.lastName,
        work: `${session.subcategory} (${translatedCategory}) `,
        doctor: doctors.join(", "),
        gender: beneficiary.gender,
        imageUrl: beneficiary.imageUrl,
        phone: beneficiary.phone || "غير محدد",
        email: beneficiary.email || "غير محدد",
        age: beneficiary.age || "غير محدد",
        nationality: beneficiary.nationality || "مصر",
        homeAddress: beneficiary.homeAddress || "غير محدد",
        pro: beneficiary.profession || "غير محدد",
      };
    });
  };

  const fetchRescheduledData = async () => {
    const sessions = await fetchRescheduledSessions();
    const processedSessions = processRescheduledSessions(sessions);
    setRescheduledSessions(processedSessions);
  };

  const fetchCancelledSessions = async () => {
    try {
      const response = await fetch("https://wellbeingproject.onrender.com/api/sessions/status/Canceled", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data.sessions;
    } catch (error) {
      console.error("Error fetching cancelled sessions:", error);
      return [];
    }
  };

  const processCancelledSessions = (sessions) => {
    return sessions.map((session) => {
      const beneficiary = session.beneficiary[0] || {};
      const translatedCategory = categoryTranslations[session.category] || session.category;
      let doctors = ["غير محدد"];
      if (Array.isArray(session.specialists)) {
        doctors = session.specialists.map(
          (specialist) => `${specialist.firstName} ${specialist.lastName} (${specialist.work})`
        );
      } else if (session.specialist) {
        doctors = [`${session.specialist.firstName} ${session.specialist.lastName} (${session.specialist.work})`];
      }
      return {
        id: beneficiary._id,
        firstName: beneficiary.firstName || "غير محدد",
        lastName: beneficiary.lastName || "غير محدد",
        work: `${session.subcategory || "غير محدد"} (${translatedCategory}) `,
        doctor: doctors.join(", "),
        imageUrl: beneficiary.imageUrl || Avatar,
        gender: beneficiary.gender || "غير محدد",
        phone: beneficiary.phone || "غير محدد",
        email: beneficiary.email || "غير محدد",
        age: beneficiary.age || "غير محدد",
        nationality: beneficiary.nationality || "مصر",
        homeAddress: beneficiary.homeAddress || "غير محدد",
        pro: beneficiary.profession || "غير محدد",
      };
    });
  };

  const fetchDataCanc = async () => {
    const sessions = await fetchCancelledSessions();
    const processedSessions = processCancelledSessions(sessions);
    setCancelledSessions(processedSessions);
  };

  const fetchSpecialtiesComparison = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token is missing.");
      }
      const response = await fetch("https://wellbeingproject.onrender.com/api/admin/specialtiesComparison", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const specialties = data.specialtiesData[0];
      const arabicNames = {
        psychologicalDisordersPercentage: "اضطرابات نفسية",
        mentalHealthPercentage: "صحة نفسية",
        physicalHealthPercentage: "صحة جسدية",
        skillDevelopmentPercentage: "تطوير مهارات",
      };
      const transformedData = Object.entries(specialties).map(([key, value], index) => ({
        name: arabicNames[key] || "غير معروف",
        value: parseFloat(value),
        color: ["#1F77BC", "#B2CEF2", "#4D83AE", "#FFBB28", "#FF8042"][index % 5],
      }));
      setSpecialtiesData(transformedData);
    } catch (error) {
      console.error("Error fetching specialties comparison data:", error);
    }
  };

  const handleAcceptSession = async (sessionId) => {
    try {
      const response = await fetch(
        `https://wellbeingproject.onrender.com/api/sessions/update/pendingToScheduled/${sessionId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("فشل في قبول الطلب");
      }
      fetchRescheduledData();
      alert("تم قبول الطلب بنجاح");
    } catch (error) {
      console.error("Error accepting session:", error);
      alert("حدث خطأ أثناء قبول الطلب");
    }
  };

  const handleCancelSession = async (sessionId) => {
    try {
      const response = await fetch(
        `https://wellbeingproject.onrender.com/api/sessions/cancel/${sessionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("فشل في رفض الطلب");
      }
      fetchRescheduledData();
      alert("تم رفض الطلب بنجاح");
    } catch (error) {
      console.error("Error canceling session:", error);
      alert("حدث خطأ أثناء رفض الطلب");
    }
  };

  const handleAccept = (sessionId) => {
    handleAcceptSession(sessionId);
  };

  const handleCancel = (sessionId) => {
    handleCancelSession(sessionId);
  };

  useEffect(() => {
    const categoryTranslations = {
      mentalHealth: "الصحة النفسية",
      physicalHealth: "الصحة الجسدية",
      psychologicalDisorders: "الاضطرابات النفسية",
      skillDevelopment: "تطوير المهارات",
    };

    const fetchData = async () => {
      try {
        const response = await fetch("https://wellbeingproject.onrender.com/api/admin/allBeneficary", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        const fetchedSpecialists = data.beneficiaries.map((spec) => {
          // Ensure sessions exist and are not empty
          const session = spec.sessions && spec.sessions.length > 0 ? spec.sessions[0] : null;
    
          // Extract subcategory and category
          const subcategory = session ? session.subcategory : "غير محدد";
          const category = session ? session.category : "غير محدد";
    
          // Translate the category
          const translatedCategory = categoryTranslations[category] || category;
    
          // Extract specialist name if available
          const specialistName = session?.specialist?.firstName 
            ? `${session.specialist.firstName} ${session.specialist.lastName}` 
            : "فادي (المشرف)"; // Default to "فادي (المشرف)" if no specialist exists
    
          return {
            id: spec._id,
            firstName: spec.firstName,
            lastName: spec.lastName,
            work: `${subcategory} (${translatedCategory})`, // Combine subcategory and translatedCategory
            profession: spec.profession,
            doctor: specialistName, // Use the specialist's name or default
            email: spec.email || "غير محدد",
            gender: spec.gender || "غير محدد",
            age: spec.age || "غير محدد",
            phone: spec.phone,
            imageUrl: spec.imageUrl,
            nationality: spec.nationality,
            homeAddress: spec.homeAddress || "غير محدد",
            pro: spec.profession || "غير محدد",
          };
        });
        setSpecialists(fetchedSpecialists);
      } catch (error) {
        console.error("Failed to fetch specialists:", error);
      }
};

    const fetchAttendance = async () => {
      try {
        const response = await fetch('https://wellbeingproject.onrender.com/api/admin/overallAttendanceRate', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        const attendanceRate = parseFloat(data.overallAttendanceRate);
        setAttendanceRate(data.overallAttendanceRate);
        setAttendanceData([
          { name: "معدل الحضور", value: attendanceRate, color: "#4A90E2" },
          { name: "باقي", value: 100 - attendanceRate, color: "#B2CEF2" }
        ]);
      } catch (error) {
        console.error("Failed to fetch attendance rate:", error);
      }
    };

    fetchData();
    fetchAttendance();
    fetchBeneficiariesData();
    fetchDataCanc();
    fetchSpecialtiesComparison();
    fetchRescheduledData();
  }, []);

  return (
    <div className="container mx-auto min-h-screen p-2 sm:p-4 lg:p-6 flex flex-col gap-4 sm:gap-6 text-[#1F77BC]">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover />
  
      {/* Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
        {/* Bar Chart */}
        <Card className="p-2 sm:p-4 text-center col-span-2">
          <h3 className="text-base sm:text-lg font-bold mb-2">عدد المستفيدين شهريًا</h3>
          {beneficiariesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={beneficiariesData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  content={({ payload, label }) => (
                    <div className="bg-white p-2 border border-gray-300 rounded">
                      <p>{label}</p>
                      <p>{`المستفيدين: ${payload?.[0]?.value}`}</p>
                    </div>
                  )}
                />
                <Bar dataKey="beneficiaries" fill="#4A90E2" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>لا توجد بيانات متاحة</p>
          )}
        </Card>
  
        {/* Pie Chart - Specialties Comparison */}
        <Card className="p-2 sm:p-4 text-center flex-col items-center col-span-2">
          <h3 className="font-bold mb-2 text-sm sm:text-base">مقارنة التخصصات</h3>
          <ResponsiveContainer width="100%" height={210}>
            <PieChart>
              <Pie
                data={specialtiesData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={65}
                label={({ value, x, y }) => (
                  <text
                    x={x}
                    y={y}
                    fill="gray"
                    textAnchor="middle"
                    dominantBaseline="central"
                    style={{ fontSize: "15px", fontWeight: "bold" }}
                  >
                    {`${value.toFixed(2)}%`}
                  </text>
                )}
                paddingAngle={2}
              >
                {specialtiesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend
                layout="horizontal"
                align="center"
                verticalAlign="bottom"
                iconType="circle"
                wrapperStyle={{
                  paddingTop: "20px",
                }}
                formatter={(name) => name}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
  
        {/* Pie Chart - Attendance Rate */}
        <Card className="p-2 sm:p-4 text-center">
          <h3 className="font-bold mb-2 text-sm sm:text-base">معدل الحضور</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={attendanceData}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={20}
                outerRadius={40}
                label={({ value, x, y }) => (
                  <text
                    x={x}
                    y={y}
                    fill="gray"
                    textAnchor="middle"
                    dominantBaseline="central"
                    style={{ fontSize: "15px", fontWeight: "bold" }}
                  >
                    {`${value}%`}
                  </text>
                )}
              >
                {attendanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <p className="mb-2 font-semibold">{attendanceRate}</p>
        </Card>
      </div>
  
      {/* Specialists Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* All Specialists */}
        <Card className="p-2 sm:p-4 max-h-[500px]">
          <h3 className="text-base sm:text-lg font-bold mb-2">كل المستفيدين</h3>
          <div className="space-y-2 sm:space-y-4">
            {specialists.map((spec, index) => (
              <SpecialistCard key={index} spec={spec} />
            ))}
          </div>
        </Card>
  
        {/* Rescheduled Sessions */}
        <Card className="p-2 sm:p-4 max-h-[500px]">
          <h3 className="text-base sm:text-lg font-bold mb-2">مطالبة إعادة جدولة الجلسات</h3>
          <div className="space-y-2 sm:space-y-4">
            {rescheduledSessions.length > 0 ? (
              rescheduledSessions.map((spec, index) => (
                <SpecialistCard
                  key={index}
                  spec={spec}
                  showActions={true}
                  onAccept={handleAccept}
                  onCancel={handleCancel}
                />
              ))
            ) : (
              <p>لا توجد جلسات مطلوب إعادة جدولتها</p>
            )}
          </div>
        </Card>
  
        {/* Cancelled Sessions */}
        <Card className="p-2 sm:p-4 max-h-[500px]">
          <h3 className="text-base sm:text-lg font-bold mb-2">قاموا بإلغاء الجلسات</h3>
          <div className="space-y-2 sm:space-y-4">
            {cancelledSessions.length > 0 ? (
              cancelledSessions.map((spec, index) => (
                <SpecialistCard key={index} spec={spec} />
              ))
            ) : (
              <p>لا توجد جلسات ملغاة</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}