import React, { useEffect, useState, useContext } from "react";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import Card from "../UI/card.jsx";
import SmallCard from "../UI/smallcard.jsx";
import { Phone, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext.jsx";
import Avatar from "../../assets/images/person.jpg";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { parsePhoneNumberFromString, getCountryCallingCode } from 'libphonenumber-js';

export const formatPhoneNumber = (phoneNumber, nationality) => {
  if (!phoneNumber) return phoneNumber; // Return as-is if no phone number

  // Map nationalities to country codes (e.g., "مصري" => "EG")
  const countryCodeMap = {
    "أفغانستان": "AF", // Afghanistan
    "ألبانيا": "AL", // Albania
    "الجزائر": "DZ", // Algeria
    "أندورا": "AD", // Andorra
    "أنغولا": "AO", // Angola
    "أنتيغوا وباربودا": "AG", // Antigua and Barbuda
    "الأرجنتين": "AR", // Argentina
    "أرمينيا": "AM", // Armenia
    "أستراليا": "AU", // Australia
    "النمسا": "AT", // Austria
    "أذربيجان": "AZ", // Azerbaijan
    "البهاما": "BS", // Bahamas
    "البحرين": "BH", // Bahrain
    "بنغلاديش": "BD", // Bangladesh
    "باربادوس": "BB", // Barbados
    "بيلاروسيا": "BY", // Belarus
    "بلجيكا": "BE", // Belgium
    "بليز": "BZ", // Belize
    "بنين": "BJ", // Benin
    "بوتان": "BT", // Bhutan
    "بوليفيا": "BO", // Bolivia
    "البوسنة والهرسك": "BA", // Bosnia and Herzegovina
    "بوتسوانا": "BW", // Botswana
    "البرازيل": "BR", // Brazil
    "بروناي": "BN", // Brunei
    "بلغاريا": "BG", // Bulgaria
    "بوركينا فاسو": "BF", // Burkina Faso
    "بوروندي": "BI", // Burundi
    "الرأس الأخضر": "CV", // Cape Verde
    "كمبوديا": "KH", // Cambodia
    "الكاميرون": "CM", // Cameroon
    "كندا": "CA", // Canada
    "جمهورية أفريقيا الوسطى": "CF", // Central African Republic
    "تشاد": "TD", // Chad
    "تشيلي": "CL", // Chile
    "الصين": "CN", // China
    "كولومبيا": "CO", // Colombia
    "جزر القمر": "KM", // Comoros
    "الكونغو": "CG", // Congo
    "كوستاريكا": "CR", // Costa Rica
    "كرواتيا": "HR", // Croatia
    "كوبا": "CU", // Cuba
    "قبرص": "CY", // Cyprus
    "جمهورية التشيك": "CZ", // Czech Republic
    "الدنمارك": "DK", // Denmark
    "جيبوتي": "DJ", // Djibouti
    "دومينيكا": "DM", // Dominica
    "جمهورية الدومينيكان": "DO", // Dominican Republic
    "الإكوادور": "EC", // Ecuador
    "مصر": "EG", // Egypt
    "السلفادور": "SV", // El Salvador
    "غينيا الاستوائية": "GQ", // Equatorial Guinea
    "إريتريا": "ER", // Eritrea
    "إستونيا": "EE", // Estonia
    "إسواتيني": "SZ", // Eswatini
    "إثيوبيا": "ET", // Ethiopia
    "فيجي": "FJ", // Fiji
    "فنلندا": "FI", // Finland
    "فرنسا": "FR", // France
    "الغابون": "GA", // Gabon
    "غامبيا": "GM", // Gambia
    "جورجيا": "GE", // Georgia
    "ألمانيا": "DE", // Germany
    "غانا": "GH", // Ghana
    "اليونان": "GR", // Greece
    "غرينادا": "GD", // Grenada
    "غواتيمالا": "GT", // Guatemala
    "غينيا": "GN", // Guinea
    "غينيا بيساو": "GW", // Guinea-Bissau
    "غيانا": "GY", // Guyana
    "هايتي": "HT", // Haiti
    "هندوراس": "HN", // Honduras
    "المجر": "HU", // Hungary
    "آيسلندا": "IS", // Iceland
    "الهند": "IN", // India
    "إندونيسيا": "ID", // Indonesia
    "إيران": "IR", // Iran
    "العراق": "IQ", // Iraq
    "أيرلندا": "IE", // Ireland
    "إسرائيل": "IL", // Israel
    "إيطاليا": "IT", // Italy
    "جامايكا": "JM", // Jamaica
    "اليابان": "JP", // Japan
    "الأردن": "JO", // Jordan
    "كازاخستان": "KZ", // Kazakhstan
    "كينيا": "KE", // Kenya
    "كيريباتي": "KI", // Kiribati
    "كوريا الشمالية": "KP", // North Korea
    "كوريا الجنوبية": "KR", // South Korea
    "الكويت": "KW", // Kuwait
    "قيرغيزستان": "KG", // Kyrgyzstan
    "لاوس": "LA", // Laos
    "لاتفيا": "LV", // Latvia
    "لبنان": "LB", // Lebanon
    "ليسوتو": "LS", // Lesotho
    "ليبيريا": "LR", // Liberia
    "ليبيا": "LY", // Libya
    "ليختنشتاين": "LI", // Liechtenstein
    "ليتوانيا": "LT", // Lithuania
    "لوكسمبورغ": "LU", // Luxembourg
    "مدغشقر": "MG", // Madagascar
    "مالاوي": "MW", // Malawi
    "ماليزيا": "MY", // Malaysia
    "جزر المالديف": "MV", // Maldives
    "مالي": "ML", // Mali
    "مالطا": "MT", // Malta
    "جزر مارشال": "MH", // Marshall Islands
    "موريتانيا": "MR", // Mauritania
    "موريشيوس": "MU", // Mauritius
    "المكسيك": "MX", // Mexico
    "ولايات ميكرونيسيا المتحدة": "FM", // Micronesia
    "مولدوفا": "MD", // Moldova
    "موناكو": "MC", // Monaco
    "منغوليا": "MN", // Mongolia
    "الجبل الأسود": "ME", // Montenegro
    "المغرب": "MA", // Morocco
    "موزمبيق": "MZ", // Mozambique
    "ميانمار": "MM", // Myanmar
    "ناميبيا": "NA", // Namibia
    "ناورو": "NR", // Nauru
    "نيبال": "NP", // Nepal
    "هولندا": "NL", // Netherlands
    "نيوزيلندا": "NZ", // New Zealand
    "نيكاراغوا": "NI", // Nicaragua
    "النيجر": "NE", // Niger
    "نيجيريا": "NG", // Nigeria
    "مقدونيا الشمالية": "MK", // North Macedonia
    "النرويج": "NO", // Norway
    "عمان": "OM", // Oman
    "باكستان": "PK", // Pakistan
    "بالاو": "PW", // Palau
    "فلسطين": "PS", // Palestine
    "بنما": "PA", // Panama
    "بابوا غينيا الجديدة": "PG", // Papua New Guinea
    "باراغواي": "PY", // Paraguay
    "بيرو": "PE", // Peru
    "الفلبين": "PH", // Philippines
    "بولندا": "PL", // Poland
    "البرتغال": "PT", // Portugal
    "قطر": "QA", // Qatar
    "رومانيا": "RO", // Romania
    "روسيا": "RU", // Russia
    "رواندا": "RW", // Rwanda
    "سانت كيتس ونيفيس": "KN", // Saint Kitts and Nevis
    "سانت لوسيا": "LC", // Saint Lucia
    "سانت فينسنت والغرينادين": "VC", // Saint Vincent and the Grenadines
    "ساموا": "WS", // Samoa
    "سان مارينو": "SM", // San Marino
    "ساو تومي وبرينسيبي": "ST", // Sao Tome and Principe
    "السعودية": "SA", // Saudi Arabia
    "السنغال": "SN", // Senegal
    "صربيا": "RS", // Serbia
    "سيشل": "SC", // Seychelles
    "سيراليون": "SL", // Sierra Leone
    "سنغافورة": "SG", // Singapore
    "سلوفاكيا": "SK", // Slovakia
    "سلوفينيا": "SI", // Slovenia
    "جزر سليمان": "SB", // Solomon Islands
    "الصومال": "SO", // Somalia
    "جنوب أفريقيا": "ZA", // South Africa
    "جنوب السودان": "SS", // South Sudan
    "إسبانيا": "ES", // Spain
    "سريلانكا": "LK", // Sri Lanka
    "السودان": "SD", // Sudan
    "سورينام": "SR", // Suriname
    "السويد": "SE", // Sweden
    "سويسرا": "CH", // Switzerland
    "سوريا": "SY", // Syria
    "تايوان": "TW", // Taiwan
    "طاجيكستان": "TJ", // Tajikistan
    "تنزانيا": "TZ", // Tanzania
    "تايلاند": "TH", // Thailand
    "تيمور الشرقية": "TL", // Timor-Leste
    "توغو": "TG", // Togo
    "تونغا": "TO", // Tonga
    "ترينيداد وتوباغو": "TT", // Trinidad and Tobago
    "تونس": "TN", // Tunisia
    "تركيا": "TR", // Turkey
    "تركمانستان": "TM", // Turkmenistan
    "توفالو": "TV", // Tuvalu
    "أوغندا": "UG", // Uganda
    "أوكرانيا": "UA", // Ukraine
    "الإمارات العربية المتحدة": "AE", // United Arab Emirates
    "المملكة المتحدة": "GB", // United Kingdom
    "الولايات المتحدة": "US", // United States
    "أوروغواي": "UY", // Uruguay
    "أوزبكستان": "UZ", // Uzbekistan
    "فانواتو": "VU", // Vanuatu
    "الفاتيكان": "VA", // Vatican City
    "فنزويلا": "VE", // Venezuela
    "فيتنام": "VN", // Vietnam
    "اليمن": "YE", // Yemen
    "زامبيا": "ZM", // Zambia
    "زيمبابوي": "ZW", // Zimbabwe
  };

  // Get the country code from the nationality
  const countryCode = countryCodeMap[nationality] || "EG"; 

  // Remove any leading zeros from the phone number
  const cleanedPhoneNumber = phoneNumber.replace(/^0+/, "");

  // Parse the phone number
  const parsedNumber = parsePhoneNumberFromString(cleanedPhoneNumber, countryCode);

  if (parsedNumber && parsedNumber.isValid()) {
    return parsedNumber.formatInternational(); // Format as international number
  }

  // If parsing fails, prepend the country calling code
  const callingCode = getCountryCallingCode(countryCode);
  return `+${callingCode} ${phoneNumber}`;
};

// AvailabilityForm Component
const AvailabilityForm = ({ specialist, onClose, onUpdateAvailability }) => {
  const [isAvailable, setIsAvailable] = useState(specialist.isAvailable);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onUpdateAvailability(specialist.id, isAvailable);
    onClose();
  };

  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-md text-center">
        <h2 className="text-xl font-bold mb-4">تغيير حالة التوفر</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-center gap-4 mb-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="availability"
                checked={isAvailable}
                onChange={() => setIsAvailable(true)}
              />
              متاح
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="availability"
                checked={!isAvailable}
                onChange={() => setIsAvailable(false)}
              />
              غير متاح
            </label>
          </div>
          <div className="flex justify-center gap-4">
            <button
              type="submit"
              className="bg-transparent text-[#1F77BC] border-2 border-[#1F77BC] hover:bg-[#B2CEF2] px-3 py-1 rounded-[20px] text-lg"
            >
              حفظ
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-transparent text-[#1F77BC] border-2 border-[#1F77BC] hover:bg-[#B2CEF2] px-3 py-1 rounded-[20px] text-lg"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// SpecialistCard Component
function SpecialistCard({ spec, onToggleAvailability }) {
  const navigate = useNavigate();
  const isAvailable = spec.isAvailable;

  const handleClick = () => {
    navigate(`/دكتور/${spec.firstName}-${spec.lastName}`, { state: { doctor: spec } });
  };

  const handleAvailabilityClick = (e) => {
    e.stopPropagation(); // Prevent the card click event
    onToggleAvailability(spec); // Open the availability form
  };

  // Function to open WhatsApp link
  const handleWhatsAppClick = (e) => {
    e.stopPropagation(); // Prevent card click event
    const formattedPhoneNumber = formatPhoneNumber(spec.phone, spec.nationality); // Format the phone number
    if (formattedPhoneNumber) {
      const phoneNumber = formattedPhoneNumber.replace(/\D/g, ""); 
      window.open(`https://wa.me/${phoneNumber}`, "_blank");
    } else {
      alert("No phone number available for this specialist.");
    }
  };


  // Function to open email client
  const handleEmailClick = (e) => {
    e.stopPropagation(); // Prevent card click event
    const emailAddress = spec.email;
    if (emailAddress) {
      const subject = "Subject"; // Customize subject if needed
      const body = "Body text"; // Customize body if needed
      window.location.href = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } else {
      alert("No email address available for this specialist.");
    }
  };

  return (
    <SmallCard className="p-4 flex items-center cursor-pointer">
      <div onClick={handleClick} className="flex-1">
        <img
          src={spec.imageUrl || Avatar}
          alt="Avatar"
          className="w-16 h-16 object-cover rounded-full mr-4 border-2 border-[#1F77BC]"
        />
        <div className="flex gap-2 mt-2 mr-5">
          <Mail className="text-white cursor-pointer"
            onClick={handleEmailClick} />
          <Phone className="text-white cursor-pointer"
            onClick={handleWhatsAppClick} />
        </div>
      </div>
      <div className="flex-1">
        <p>الاسم: {spec.firstName} {spec.lastName}</p>
        <p>النوع: {spec.work}</p>
        <p>عدد الحجوزات : {spec.sessionCount}</p>

        <div
          onClick={handleAvailabilityClick}
          className={`mt-2 px-4 py-1 rounded-[20px] text-center border-2 bg-white cursor-pointer ${
            isAvailable ? "text-green-500 border-green-500" : "text-red-500 border-red-500"
          }`}
        >
          {isAvailable ? "متاح" : "غير متاح"}
        </div>
      </div>
    </SmallCard>
  );
}

export default function Dashboard() {
  const [mostBooked, setMostBooked] = useState([]);
  const [leastBooked, setLeastBooked] = useState([]);
  const [allSpecialists, setAllSpecialists] = useState([]);
  const [specialtiesData, setSpecialtiesData] = useState([]);
  const [newSpecialists, setNewSpecialists] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [isConfirming, setIsConfirming] = useState(false);
  const [selectedSpecialistId, setSelectedSpecialistId] = useState(null);
  const [doctorsAvailability, setDoctorsAvailability] = useState({});
  const [showAvailabilityForm, setShowAvailabilityForm] = useState(false);
  const [selectedSpecialistForAvailability, setSelectedSpecialistForAvailability] = useState(null);

  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  // Function to handle accepting a new specialist
  const handleAcceptSpecialist = (specialistId) => {
    setSelectedSpecialistId(specialistId);
    setIsConfirming(true);
  };

  // Function to handle rejecting a new specialist
  const handleRejectSpecialist = async (specialistId) => {
    try {
      if (!token) {
        throw new Error("لم يتم العثور على رمز التحقق. يرجى تسجيل الدخول مرة أخرى.");
      }

      const response = await axios.delete(
        `https://wellbeingproject.onrender.com/api/specialist/delete/${specialistId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("تم رفض الأخصائي بنجاح!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Remove the rejected specialist from the newSpecialists list
        setNewSpecialists((prev) => prev.filter((spec) => spec.id !== specialistId));
      } else {
        throw new Error("فشل في رفض الأخصائي");
      }
    } catch (error) {
      console.error("Error rejecting specialist:", error);
      toast.error(error.message || "حدث خطأ أثناء رفض الأخصائي", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsConfirming(false); // Hide confirmation dialog
      setSelectedSpecialistId(null); // Reset selected specialist ID
    }
  };

  const updateAvailability = async (specialistId, isAvailable) => {
    try {
      if (!token) {
        throw new Error("لم يتم العثور على رمز التحقق. يرجى تسجيل الدخول مرة أخرى.");
      }

      const response = await axios.put(
        `https://wellbeingproject.onrender.com/api/admin/isAvailable/${specialistId}`,
        { isAvailable }, // Ensure the request body is correct
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("تم تحديث حالة التوفر بنجاح!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Update the specialist's availability in the state
        setAllSpecialists((prev) =>
          prev.map((spec) =>
            spec.id === specialistId ? { ...spec, isAvailable: isAvailable } : spec
          )
        );
      } else {
        throw new Error("فشل في تحديث حالة التوفر");
      }
    } catch (error) {
      console.error("Error updating availability:", error);
      toast.error(error.message || "حدث خطأ أثناء تحديث حالة التوفر", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Function to confirm acceptance
  const confirmAcceptance = async () => {
    try {
      if (!token) {
        throw new Error("لم يتم العثور على رمز التحقق. يرجى تسجيل الدخول مرة أخرى.");
      }
      const response = await axios.patch(
        `https://wellbeingproject.onrender.com/api/admin/confirm/${selectedSpecialistId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        // Show success notification
        toast.success("تم قبول الأخصائي بنجاح!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        // Remove the accepted specialist from the newSpecialists list
        setNewSpecialists((prev) => prev.filter((spec) => spec.id !== selectedSpecialistId));
      } else {
        throw new Error("فشل في قبول الأخصائي");
      }
    } catch (error) {
      console.error("Error confirming specialist:", error);
      toast.error(error.message || "حدث خطأ أثناء قبول الأخصائي", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsConfirming(false); // Hide confirmation dialog
      setSelectedSpecialistId(null); // Reset selected specialist ID
    }
  };

  // Function to confirm rejection
  const confirmRejection = async () => {
    await handleRejectSpecialist(selectedSpecialistId);
  };

  useEffect(() => {
    // Fetch most booked specialists (requires token)
    const fetchMostBooked = async () => {
      try {
        if (!token) {
          throw new Error("Authentication token is missing.");
        }

        const response = await fetch("https://wellbeingproject.onrender.com/api/admin/topSpecialists", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          alert("Session expired. Please log in again.");
          window.location.href = "/login";
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const fetchedMostBooked = data.data.map((spec) => ({
          firstName: spec.firstName,
          lastName: spec.lastName,
          work: spec.work,
          email: spec.email,
          sessionPrice: spec.sessionPrice,
          sessionCount: spec.sessions.length,
          yearsExperience: spec.yearsExperience,
          isAvailable: spec.isAvailable,
          files: spec.files,
          workAddress: spec.workAddress,
          homeAddress: spec.homeAddress,
          phone: spec.phone,
          imageUrl: spec.imageUrl || Avatar,
          language: spec.language,
          bio: spec.bio,
          nationality: spec.nationality,
          specialties: spec.specialties,
          sessionDuration: spec.sessionDuration,
          availableSlots: spec.availableSlots,
          sessions: spec.sessions,
          id: spec._id,
          gender: spec.gender,
        }));
        setMostBooked(fetchedMostBooked);
      } catch (error) {
        console.error("Failed to fetch most booked specialists:", error);
      }
    };

    // Fetch least booked specialists (requires token)
    const fetchLeastBooked = async () => {
      try {
        if (!token) {
          throw new Error("Authentication token is missing.");
        }

        const response = await fetch("https://wellbeingproject.onrender.com/api/admin/bottomSpecialists", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          alert("Session expired. Please log in again.");
          window.location.href = "/login";
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const fetchedLeastBooked = data.data.map((spec) => ({
          firstName: spec.firstName,
          lastName: spec.lastName,
          work: spec.work,
          email: spec.email,
          sessionPrice: spec.sessionPrice,
          sessionCount: spec.sessions.length,
          yearsExperience: spec.yearsExperience,
          isAvailable: spec.isAvailable,
          files: spec.files,
          workAddress: spec.workAddress,
          homeAddress: spec.homeAddress,
          phone: spec.phone,
          imageUrl: spec.imageUrl || Avatar,
          bio: spec.bio,
          nationality: spec.nationality,
          specialties: spec.specialties,
          sessionDuration: spec.sessionDuration,
          availableSlots: spec.availableSlots,
          sessions: spec.sessions,
          id: spec._id,
          gender: spec.gender,
        }));
        setLeastBooked(fetchedLeastBooked);
      } catch (error) {
        console.error("Failed to fetch least booked specialists:", error);
      }
    };

    // Fetch all specialists (does not require token)
    const fetchAllSpecialists = async () => {
      try {
        const response = await fetch("https://wellbeingproject.onrender.com/api/specialist/getAll", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 401) {
          alert("Session expired. Please log in again.");
          window.location.href = "/login";
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const fetchedSpecialists = data.data.map((spec) => ({
          firstName: spec.firstName,
          lastName: spec.lastName,
          work: spec.work,
          email: spec.email,
          sessionPrice: spec.sessionPrice,
          sessionCount: spec.sessions.length,
          yearsExperience: spec.yearsExperience,
          isAvailable: spec.isAvailable,
          files: spec.files,
          workAddress: spec.workAddress,
          homeAddress: spec.homeAddress,
          phone: spec.phone,
          imageUrl: spec.imageUrl || Avatar,
          bio: spec.bio,
          nationality: spec.nationality,
          specialties: spec.specialties,
          sessionDuration: spec.sessionDuration,
          availableSlots: spec.availableSlots,
          sessions: spec.sessions,
          id: spec._id,
          gender: spec.gender,
        }));

        // Fetch available slots for each specialist and update availability
        const updatedAvailability = {};
        for (const spec of fetchedSpecialists) {
          const slotsResponse = await fetch(
            `https://wellbeingproject.onrender.com/api/admin/availableSlots/${spec.id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!slotsResponse.ok) {
            console.error(`Failed to fetch slots for ${spec.firstName} ${spec.lastName}`);
            updatedAvailability[spec.id] = false;
            continue;
          }

          const slotsData = await slotsResponse.json();
          updatedAvailability[spec.id] = slotsData.availableSlots && slotsData.availableSlots.length > 0;
        }

        setDoctorsAvailability(updatedAvailability);
        setAllSpecialists(fetchedSpecialists);
      } catch (error) {
        console.error("Failed to fetch all specialists:", error);
      }
    };

    // Fetch specialties comparison data (requires token)
    const fetchSpecialtiesComparison = async () => {
      try {
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

        if (response.status === 401) {
          alert("Session expired. Please log in again.");
          window.location.href = "/login";
          return;
        }

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

    const fetchNewSpecialists = async () => {
      try {
        if (!token) {
          throw new Error("Authentication token is missing.");
        }

        const response = await fetch("https://wellbeingproject.onrender.com/api/admin/unConfirmed", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          alert("Session expired. Please log in again.");
          window.location.href = "/login";
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const fetchedNewSpecialists = data.data.map((spec) => ({
          firstName: spec.firstName,
          lastName: spec.lastName,
          work: spec.work,
          email: spec.email,
          language: spec.language,
          sessionPrice: spec.sessionPrice,
          sessionCount: spec.sessions.length,
          yearsExperience: spec.yearsExperience,
          isAvailable: spec.isAvailable,
          files: spec.files,
          workAddress: spec.workAddress,
          homeAddress: spec.homeAddress,
          phone: spec.phone,
          imageUrl: spec.imageUrl || Avatar,
          bio: spec.bio,
          nationality: spec.nationality,
          specialties: spec.specialties,
          sessionDuration: spec.sessionDuration,
          availableSlots: spec.availableSlots,
          sessions: spec.sessions,
          id: spec._id,
          gender: spec.gender,
        }));
        setNewSpecialists(fetchedNewSpecialists);
      } catch (error) {
        console.error("Failed to fetch new specialists:", error);
      }
    };

    const fetchAttendanceData = async () => {
      try {
        if (!token) {
          throw new Error("Authentication token is missing.");
        }

        const response = await fetch("https://wellbeingproject.onrender.com/api/admin/specialistsAttendanceRate", {
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
        const attendanceRates = data.attendanceData.map((item) => parseFloat(item.attendanceRate.replace("%", ""))) || [];
        const overallAttendanceRate = attendanceRates.reduce((sum, rate) => sum + rate, 0) / attendanceRates.length || 0;

        setAttendanceData([
          { name: "الحضور", value: overallAttendanceRate, color: "#1F77BC" },
          { name: "الغياب", value: 100 - overallAttendanceRate, color: "#B2CEF2" },
        ]);
      } catch (error) {
        console.error("Failed to fetch attendance data:", error);
      }
    };

    fetchMostBooked();
    fetchLeastBooked();
    fetchAllSpecialists();
    fetchSpecialtiesComparison();
    fetchNewSpecialists();
    fetchAttendanceData();
  }, [token]);

  // Handle click on new specialist card
  const handleNewSpecialistClick = (specialist) => {
    navigate(`/متخصص-جديد/${specialist.firstName}-${specialist.lastName}`, { state: { specialist } });
  };

  return (
    <div className="container mx-auto min-h-screen p-4 lg:p-6 flex flex-col gap-6 text-[#1F77BC]">
      <ToastContainer />
      {/* Render the availability form */}
      {showAvailabilityForm && (
        <AvailabilityForm
          specialist={selectedSpecialistForAvailability}
          onClose={() => setShowAvailabilityForm(false)}
          onUpdateAvailability={updateAvailability}
        />
      )}

      {/* Metrics Section */}
<div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
  {/* Pie Chart - Specialties Comparison */}
  <Card className="p-2 sm:p-4 text-center col-span-2">
    <h3 className="font-bold mb-2 text-sm sm:text-base">مقارنة التخصصات</h3>
    <div className="w-full h-[150px] sm:h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={specialtiesData}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={60} // Smaller radius for mobile
            label={({ value, x, y }) => (
              <text
                x={x}
                y={y}
                fill="gray"
                textAnchor="middle"
                dominantBaseline="central"
                style={{ fontSize: "10px", fontWeight: "bold" }} // Smaller font for mobile
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
              paddingTop: "10px",
              fontSize: "10px", // Smaller legend font for mobile
            }}
            formatter={(name) => name}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </Card>

  {/* Pie Chart - Attendance Rate (Donut Chart) */}
  <Card className="p-2 sm:p-4 text-center col-span-2 xl:col-span-1">
    <h3 className="font-bold mb-2 text-sm sm:text-base">معدل الحضور</h3>
    <div className="w-full h-[150px] sm:h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={attendanceData}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={20} // Smaller inner radius for mobile
            outerRadius={40} // Smaller outer radius for mobile
            label={({ value, x, y }) => (
              <text
                x={x}
                y={y}
                fill="gray"
                textAnchor="middle"
                dominantBaseline="vertical"
                style={{ fontSize: "10px", fontWeight: "bold" }} // Smaller font for mobile
              >
                {`${value.toFixed(2)}%`}
              </text>
            )}
          >
            {attendanceData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend
            layout="horizontal"
            align="right"
            verticalAlign="bottom"
            iconType="circle"
            wrapperStyle={{
              paddingLeft: "10px",
              fontSize: "10px", // Smaller legend font for mobile
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </Card>

  {/* New Specialists */}
  <Card className="p-2 sm:p-4 text-center col-span-2 xl:col-span-2 flex flex-col justify-center max-h-[260px]">
    <h3 className="font-bold text-lg mb-2">المتخصصين الجدد</h3>
    <div className="grid grid-cols-1 gap-2 sm:gap-4">
      {newSpecialists.map((spec, index) => (
        <div
          key={index}
          className="p-2 sm:p-4 border rounded-[20px] flex flex-col sm:flex-row items-center justify-between cursor-pointer"
          onClick={() => handleNewSpecialistClick(spec)}
        >
          
          <img
            src={spec.imageUrl || Avatar}
            alt="Avatar"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mb-2 sm:mb-0"
          />
          <div className="text-center sm:text-right">
            <p className="text-xs sm:text-sm">الاسم: {spec.firstName} {spec.lastName}</p>
            <p className="text-xs sm:text-sm">النوع: {spec.work}</p>
          </div>
          <div className="flex gap-1 sm:gap-2 mt-2 sm:mt-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedSpecialistId(spec.id);
                setIsConfirming(true);
              }}
              className="bg-transparent text-[#1F77BC] border-2 border-[#1F77BC] hover:bg-[#B2CEF2] px-2 py-1 rounded-[20px] text-xs"
            >
              رفض
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAcceptSpecialist(spec.id);
              }}
              className="bg-transparent text-[#1F77BC] border-2 border-[#1F77BC] hover:bg-[#B2CEF2] px-2 py-1 rounded-[20px] text-xs"
            >
              قبول
            </button>
          </div>
        </div>
      ))}
    </div>
  </Card>
</div>

      {/* Specialists Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Most Booked Specialists */}
        <Card className="p-4 max-h-[500px]">
          <h3 className="text-lg font-bold mb-2">المتخصصين الأكثر حجزًا</h3>
          <div className="space-y-4">
            {mostBooked.length > 0 ? (
              mostBooked.map((spec, index) => (
                <SpecialistCard
                  key={index}
                  spec={spec}
                  onToggleAvailability={(spec) => {
                    setSelectedSpecialistForAvailability(spec);
                    setShowAvailabilityForm(true);
                  }}
                />
              ))
            ) : (
              <p>No data available</p>
            )}
          </div>
        </Card>

        {/* Least Booked Specialists */}
        <Card className="p-4 max-h-[500px]">
          <h3 className="text-lg font-bold mb-2">المتخصصين الأقل حجزًا</h3>
          <div className="space-y-4">
            {leastBooked.length > 0 ? (
              leastBooked.map((spec, index) => (
                <SpecialistCard
                  key={index}
                  spec={spec}
                  onToggleAvailability={(spec) => {
                    setSelectedSpecialistForAvailability(spec);
                    setShowAvailabilityForm(true);
                  }}
                />
              ))
            ) : (
              <p>No data available</p>
            )}
          </div>
        </Card>

        {/* All Specialists */}
        <Card className="p-4 max-h-[500px]">
          <h3 className="text-lg font-bold mb-2">كل المتخصصين</h3>
          <div className="space-y-4">
            {allSpecialists.length > 0 ? (
              allSpecialists.map((spec, index) => (
                <SpecialistCard
                  key={index}
                  spec={spec}
                  onToggleAvailability={(spec) => {
                    setSelectedSpecialistForAvailability(spec);
                    setShowAvailabilityForm(true);
                  }}
                />
              ))
            ) : (
              <p>No data available</p>
            )}
          </div>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      {isConfirming && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-md text-center">
            <h2 className="text-xl font-bold mb-4">هل أنت متأكد من رفض الأخصائي؟</h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmRejection}
                className="bg-transparent text-[#1F77BC] border-2 border-[#1F77BC] hover:bg-[#B2CEF2] px-3 py-1 rounded-[20px] text-lg"
              >
                نعم
              </button>
              <button
                onClick={() => setIsConfirming(false)}
                className="bg-transparent text-[#1F77BC] border-2 border-[#1F77BC] hover:bg-[#B2CEF2] px-3 py-1 rounded-[20px] text-lg"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}