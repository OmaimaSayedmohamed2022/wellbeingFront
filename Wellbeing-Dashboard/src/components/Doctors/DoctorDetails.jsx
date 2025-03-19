import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "../UI/card";
import SmallCard from "../UI/smallcard.jsx";
import Avatar from "../../assets/images/person.jpg";
import { AuthContext } from "../../context/authContext.jsx";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { FaStar } from 'react-icons/fa';
import { DollarSign, User, File, Download, Phone, Send } from "lucide-react";
import { parsePhoneNumberFromString, getCountryCallingCode } from 'libphonenumber-js';

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

const formatPhoneNumber = (phoneNumber, nationality) => {
  if (!phoneNumber) return phoneNumber;
  const countryCode = countryCodeMap[nationality] || "EG";
  const cleanedPhoneNumber = phoneNumber.replace(/^0+/, "");
  const parsedNumber = parsePhoneNumberFromString(cleanedPhoneNumber, countryCode);
  if (parsedNumber && parsedNumber.isValid()) {
    return parsedNumber.formatInternational();
  }
  const callingCode = getCountryCallingCode(countryCode);
  return `+${callingCode}${cleanedPhoneNumber}`;
};

function DoctorDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const doctor = location.state?.doctor;
  const [sessions, setSessions] = useState({ instantSessions: [], freeConsultations: [] });
  const { token } = useContext(AuthContext);
  const [attendanceRate, setAttendanceRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [groupedSlots, setGroupedSlots] = useState({});
  const [beneficiariesCount, setBeneficiariesCount] = useState(0);
  const [doctorRevenue, setDoctorRevenue] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [isDoctorAvailable, setIsDoctorAvailable] = useState(false);
  const arabicDays = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "م" : "ص";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const getSpecialtiesWithValues = (specialties) => {
    return Object.entries(specialties)
      .filter(([key, value]) => Array.isArray(value) && value.length > 0)
      .map(([key, value]) => ` ${value.join(", ")}`);
  };

  const groupSlotsByDayAndDate = (slots) => {
    const groupedSlots = {};
    slots.forEach((slot) => {
      const dateObj = new Date(slot);
      const day = arabicDays[dateObj.getDay()];
      const formattedDate = dateObj.toLocaleDateString("ar-EG");
      const time = formatTime(dateObj);
      if (!groupedSlots[day]) {
        groupedSlots[day] = {};
      }
      if (!groupedSlots[day][formattedDate]) {
        groupedSlots[day][formattedDate] = [];
      }
      groupedSlots[day][formattedDate].push(time);
    });
    return groupedSlots;
  };

  const fetchSmallCardData = async () => {
    try {
      const beneficiariesResponse = await fetch(
        `https://wellbeingproject.onrender.com/api/admin/beneficiaryCount/${doctor.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!beneficiariesResponse.ok) {
        throw new Error(`HTTP error! Status: ${beneficiariesResponse.status}`);
      }
      const beneficiariesData = await beneficiariesResponse.json();
      setBeneficiariesCount(beneficiariesData.beneficiaryCount);

      const earningsResponse = await fetch(
        `https://wellbeingproject.onrender.com/api/admin/specialistEarnings/${doctor.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!earningsResponse.ok) {
        throw new Error(`HTTP error! Status: ${earningsResponse.status}`);
      }
      const earningsData = await earningsResponse.json();
      setDoctorRevenue(earningsData.earnings);
    } catch (error) {
      console.error("Failed to fetch small card data:", error);
      setError(error.message);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `https://wellbeingproject.onrender.com/api/review/gatReviews/${doctor.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setReviews(data.reviews);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    if (doctor) {
      const fetchSessions = async () => {
        try {
          const response = await fetch(
            `https://wellbeingproject.onrender.com/api/sessions/specialist/${doctor.id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          setSessions(data);
        } catch (error) {
          console.error("Failed to fetch sessions:", error);
        }
      };

      const fetchAttendanceRate = async () => {
        try {
          if (!token) {
            throw new Error("Authentication token is missing.");
          }
          const response = await fetch(
            "https://wellbeingproject.onrender.com/api/admin/specialistsAttendanceRate",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!response.ok) {
            if (response.status === 401) {
              throw new Error("Unauthorized: Please log in again.");
            }
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          const doctorAttendance = data.attendanceData.find(
            (item) => item.specialistId === doctor.id
          );
          if (doctorAttendance) {
            const rate = parseFloat(doctorAttendance.attendanceRate);
            setAttendanceRate(rate);
          } else {
            setAttendanceRate(0);
          }
        } catch (error) {
          console.error("Failed to fetch attendance rate:", error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      const fetchAvailableSlots = async () => {
        try {
          if (!token) {
            throw new Error("Authentication token is missing.");
          }
          const response = await fetch(
            `https://wellbeingproject.onrender.com/api/admin/availableSlots/${doctor.id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!response.ok) {
            if (response.status === 401) {
              throw new Error("Unauthorized: Please log in again.");
            }
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          setAvailableSlots(data.availableSlots);
          setGroupedSlots(groupSlotsByDayAndDate(data.availableSlots));
          setIsDoctorAvailable(data.availableSlots && data.availableSlots.length > 0);
        } catch (error) {
          console.error("Failed to fetch available slots:", error);
          setError(error.message);
        }
      };

      fetchSessions();
      fetchAttendanceRate();
      fetchAvailableSlots();
      fetchSmallCardData();
      fetchReviews();
    }
  }, [doctor, token]);

  const averageRating = calculateAverageRating(reviews);

  if (!doctor) {
    return <div>No doctor data found.</div>;
  }

  const handleDownload = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const pieChartData = [
    { name: "الحضور", value: attendanceRate || 0, color: "#1F77BC" },
    { name: "الالغاء", value: 100 - (attendanceRate || 0), color: "#B2CEF2" },
  ];

  const cardData = [
    { title: "المستفيدين", count: beneficiariesCount, icon: <User /> },
    { title: "العائد من الدكتور", count: doctorRevenue, icon: <DollarSign /> }
  ];

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          style={{
            color: i <= rating ? "gold" : "gray",
            marginRight: "2px",
            display: "inline-block",
            fontSize: "18px",
          }}
        />
      );
    }
    return stars;
  };

  const handleWhatsAppClick = () => {
    const formattedPhoneNumber = formatPhoneNumber(doctor.phone, doctor.nationality);
    const phoneNumber = formattedPhoneNumber.replace(/\D/g, "");
    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleEmailClick = () => {
    const emailUrl = `mailto:${doctor.email}`;
    window.location.href = emailUrl;
  };

  return (
    <div className="container mx-auto px-4 py-8 text-[#1F77BC]">
      {/* Back Button */}
      <button
        className="mb-4 px-4 py-2 bg-white text-[#1F77BC] rounded-md font-semibold border-gray-500 hover:bg-[#B2CEF2]"
        onClick={() => navigate(-1)}
      >
        عودة
      </button>

      <SmallCard>
        <div className="p-6">
          {/* Header Section */}
          <div className="flex items-center justify-end gap-2 mb-4">
            <div className="p-2 bg-[#B2CEF2] rounded-lg cursor-pointer" title={`واتساب: ${formatPhoneNumber(doctor.phone, doctor.nationality)}`} onClick={handleWhatsAppClick}>
              <Phone className="text-[#1F77BC] w-4 h-4 font-semibold" />
            </div>
            <div className="p-2 bg-[#B2CEF2] rounded-lg cursor-pointer" title={`إرسال بريد: ${doctor.email}`} onClick={handleEmailClick}>
              <Send className="text-[#1F77BC] w-4 h-4 font-semibold" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-4">تفاصيل المتخصص</h1>

          {/* Doctor Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Image */}
            <div className="flex justify-center">
              <img src={doctor.imageUrl || Avatar} alt="Doctor Avatar" className="w-56 h-40 object-cover rounded-[20px] mb-4 border-gray-500" />
            </div>

            {/* Basic Information */}
            <div className="col-span-2">
              <p className="text-lg"><strong>الاسم:</strong> {doctor.firstName} {doctor.lastName}</p>
              <p className="text-lg"><strong>التخصص:</strong> {doctor.work}</p>
              <p className="text-lg"><strong>{doctor.bio}</strong></p>
              <p className="text-lg"><strong>(</strong>
                {getSpecialtiesWithValues(doctor.specialties).length > 0 ? (
                  getSpecialtiesWithValues(doctor.specialties).join(", ")
                ) : (
                  "لا توجد تخصصات محددة"
                )}
              )</p>
              <p className="text-lg"><strong>سنين الخبرة:</strong> {doctor.yearsExperience} سنوات</p>
              <p className="text-lg"><strong>عدد الحجوزات:</strong>
                {doctor.sessions && doctor.sessions.length > 0 ? doctor.sessions.length : 'لا يوجد حجوزات'}
              </p>
              <p className="text-lg"><strong>الحالة:</strong> {doctor.isAvailable ? "متاح" : "غير متاح"}</p>
              <p className="text-lg">
                <strong></strong>{" "}
                {renderStars(averageRating)} {/* Render stars here */}
                {" "}{averageRating}/5 ({reviews.length} تقييم)
              </p>
            </div>
          </div>
        </div>
      </SmallCard>

      {/* Small Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Column */}
        <div className="grid grid-cols-1 gap-9">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cardData.map((card, index) => (
              <SmallCard key={index}>
                <div className="p-4 rounded-[20px] text-center">
                  <div className="mb-2 text-3xl">{card.icon}</div>
                  <h3 className="text-xl font-bold">{card.count}</h3>
                  <p>{card.title}</p>
                </div>
              </SmallCard>
            ))}
          </div>

          {/* Availability Card */}
          <Card className="bg-white p-6 rounded-[20px] shadow-md max-h-[400px] text-lg overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">متاح في</h2>
            {loading ? (
              <div>جاري التحميل...</div>
            ) : error ? (
              <div>{error}</div>
            ) : Object.keys(groupedSlots).length > 0 ? (
              <div>
                {Object.entries(groupedSlots).map(([day, dates], index) => (
                  <div key={index}>
                    <strong>{day}:</strong>
                    <ul style={{ listStyleType: "none", padding: 0 }}>
                      {Object.entries(dates).map(([date, times], idx) => (
                        <li key={idx}>
                          <strong>{date}: </strong>
                          {times.join(" - ")}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div>لا توجد مواعيد متاحة</div>
            )}
          </Card>
        </div>

        {/* Middle Column */}
        <div className="grid grid-rows-2 items-center justify-center">
          {/* Attendance Rate Pie Chart */}
          <Card className="bg-white rounded-[20px] shadow-md max-w-[300px] max-h-full">
            <h2 className="text-lg font-bold mb-1 text-[#1F77BC]">حضور الجلسات</h2>
            {loading ? (
              <p className="text-gray-500 text-center">جاري التحميل...</p>
            ) : error ? (
              <p className="text-red-500 text-center">{error}</p>
            ) : (
              <ResponsiveContainer width="100%" height={210}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    paddingAngle={5}
                    label={({ value, x, y }) => (
                      <text
                        x={x}
                        y={y}
                        fill="gray"
                        textAnchor="middle"
                        dominantBaseline="central"
                        style={{ fontSize: "15px", fontWeight: "bold" }}
                      >
                        {` ${value}%`}
                      </text>
                    )}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend
                    wrapperStyle={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>

          {/* Session Details */}
          <Card className="max-w-[300px] mx-auto">
            <h2 className="text-xl font-bold mb-4">تفاصيل الجلسات</h2>
            <p className="text-lg font-medium"><strong>سعر الجلسة:</strong> {doctor.sessionPrice} $</p>
            <p className="text-lg font-medium"><strong>مدة الجلسة:</strong> {doctor.sessionDuration} دقيقة</p>
            <p className="text-lg font-medium flex flex-wrap items-center gap-x-2">
              <File className="text-2xl" />
              <strong>صورة الهوية:</strong>
              {doctor.files?.idOrPassport ? (
                <Download
                  className="text-[#1F77BC] ml-auto"
                  onClick={() => handleDownload(doctor.files.idOrPassport, 'id_or_passport.pdf')}
                />
              ) : "غير متوفرة"}
            </p>
            <p className="text-lg font-medium flex flex-wrap items-center gap-x-2">
              <File className="text-2xl" />
              <strong>السيرة الذاتية:</strong>
              {doctor.files?.resume ? (
                <Download
                  className="text-[#1F77BC] ml-auto"
                  onClick={() => handleDownload(doctor.files.resume, 'resume.pdf')}
                />
              ) : "غير متوفرة"}
            </p>
            <p className="text-lg font-medium flex flex-wrap items-center gap-x-2">
              <File className="text-2xl" />
              <strong>الترخيص أو إذن مزاولة المهنة:</strong>
              {doctor.files?.ministryLicense ? (
                <Download
                  className="text-[#1F77BC] ml-auto"
                  onClick={() => handleDownload(doctor.files.ministryLicense, 'ministry_license.pdf')}
                />
              ) : "غير متوفر"}
            </p>
            <p className="text-lg font-medium flex flex-wrap items-center gap-x-2">
              <File className="text-2xl" />
              <strong>الشهادات:</strong>
              {doctor.files?.certificates?.map((cert, index) => (
                <span key={index}>
                  {index > 0 && ", "}
                  <Download
                    className="text-[#1F77BC] ml-auto"
                    onClick={() => handleDownload(cert, `certificate_${index}.pdf`)}
                  />
                </span>
              )) || "لا يوجد شهادات"}
            </p>
            <p className="text-lg font-medium flex flex-wrap items-center gap-x-2">
              <File className="text-2xl" />
              <strong>عضوية النقابة أو الجمعية:</strong>
              {doctor.files?.associationMembership ? (
                <Download
                  className="text-[#1F77BC] ml-auto"
                  onClick={() => handleDownload(doctor.files.associationMembership, 'association_membership.pdf')}
                />
              ) : "غير متوفرة"}
            </p>
          </Card>
        </div>

        {/* Right Column */}
        <Card className="p-4 bg-white rounded-xl shadow-md max-h-[660px]">
          <h2 className="text-lg font-bold mb-6 text-[#1F77BC]">المواعيد القادمة</h2>
          {sessions.instantSessions.length > 0 || sessions.freeConsultations.length > 0 ? (
            <ul className="space-y-4">
              {sessions.instantSessions.map((session) => (
                <li
                  key={session._id}
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <img
                    src={session.beneficiary.imageUrl || Avatar}
                    alt="Appointment"
                    className="w-14 h-14 object-cover rounded-full border-2 border-[#1F77BC] ml-3"
                  />
                  <div className="flex-1 ml-6 mb-4">
                    <p className="text-base font-medium text-gray-800">
                      {new Date(session.sessionDate).toLocaleDateString("ar-EG")} - {formatTime(new Date(session.sessionDate))}
                    </p>
                    <p className="text-sm text-white px-2 py-1 inline-block bg-[#1F77BC] rounded-md">
                      {session.sessionType}
                    </p>
                    <p className="text-sm text-gray-500">
                      المستفيد: {session.beneficiary.firstName} {session.beneficiary.lastName}
                    </p>
                  </div>
                </li>
              ))}
              {sessions.freeConsultations.map((session) => (
                <li
                  key={session._id}
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <img
                    src={session.beneficiary.imageUrl || Avatar}
                    alt="Appointment"
                    className="w-14 h-14 object-cover rounded-full border-2 border-[#1F77BC] ml-3"
                  />
                  <div className="flex-1 ml-6">
                    <p className="text-base font-medium text-gray-800">
                      {new Date(session.sessionDate).toLocaleDateString("ar-EG")} - {formatTime(new Date(session.sessionDate))}
                    </p>
                    <p className="text-sm text-white px-2 py-1 inline-block bg-[#4CAF50] rounded-md">
                      {session.sessionType}
                    </p>
                    <p className="text-sm text-gray-500">
                      المستفيد: {session.beneficiary.firstName} {session.beneficiary.lastName}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-4">لا توجد مواعيد قادمة</p>
          )}
        </Card>
      </div>

      {/* Reviews Card */}
      <div className="mt-8">
        <Card className="col-span-3 max-h-[400px] max-w-[1044px] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">آراء</h2>
          {loading ? (
            <p className="text-gray-500 text-center">جاري التحميل...</p>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : reviews.length > 0 ? (
            <div className="flex overflow-x-auto space-x-4 p-4">
              {reviews.map((review) => (
                <div key={review._id} className="min-w-[300px] bg-gray-50 p-4 rounded-lg flex-shrink-0">
                  <div className="flex items-center mb-2">
                    <img
                      src={review.beneficiary?.imageUrl || Avatar}
                      alt="Reviewer"
                      className="w-10 h-10 object-cover ml-3 rounded-full border-2 border-[#1F77BC] mr-3"
                    />
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="text-gray-800">{review.beneficiary.firstName} {review.beneficiary.lastName}</p>
                  <p className="text-gray-800">{review.comment}</p>
                  <p className="text-sm text-gray-500">
                    بتاريخ: {new Date(review.createdAt).toLocaleDateString("ar-EG")}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">لا توجد آراء متاحة</p>
          )}
        </Card>
      </div>
    </div>
  );
}

export default DoctorDetails;