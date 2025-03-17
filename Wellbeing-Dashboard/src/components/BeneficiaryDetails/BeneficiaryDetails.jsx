import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Phone, Mail, Send } from "lucide-react";
import Avatar from "../../assets/images/person.jpg";
import Card from "../UI/card.jsx";
import SmallCard from "../UI/smallcard.jsx";
import { FaCalendarAlt } from "react-icons/fa";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

const attendanceData = [
  { name: "حضور", value: 80, color: "#1F77BC" }, // 80% attended
  { name: "إلغاء", value: 20, color: "#CCCCCC" } // 20% canceled
];

const BeneficiaryDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sessionsData, setSessionsData] = useState({
    totalSessions: 0,
    scheduledSessions: [],
    completedSessions: [],
    canceledSessions: [],
    upcomingSessions: [],
  });

  const benef = location.state?.benef;

  useEffect(() => {
    if (benef) {
      fetch(`https://wellbeingproject.onrender.com/api/beneficiaries/sessions/${benef.id}`)
        .then((response) => response.json())
        .then((data) => {
          setSessionsData(data);
        })
        .catch((error) => console.error("Error fetching sessions:", error));
    }
  }, [benef]);

  if (!benef) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h2 className="text-2xl font-bold text-red-600">خطأ</h2>
        <p className="mt-2">لم يتم العثور على بيانات المستفيد.</p>
        <button
          className="mt-4 bg-[#1F77BC] text-white px-4 py-2 rounded-[20px] hover:bg-[#19649E]"
          onClick={() => navigate(-1)}
        >
          العودة
        </button>
      </div>
    );
  }

  const formatPhoneNumberForWhatsApp = (phone, nationality) => {
    if (!phone || !nationality) return "";
    const cleanedPhone = phone.replace(/\D/g, "");
    const phoneWithoutZero = cleanedPhone.replace(/^0+/, "");
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
    const countryCode = countryCodes[nationality] || "+20";
    return `${countryCode}${phoneWithoutZero}`;
  };

  const whatsappLink = `https://wa.me/${formatPhoneNumberForWhatsApp(
    benef.phone,
    benef.nationality
  )}`;
  const emailLink = `mailto:${benef.email}`;

  return (
    <div className="container mx-auto p-4 text-[#19649E] text-lg">
      {/* Back Button */}
      <button
        className="bg-[#1F77BC] text-white px-4 py-2 rounded-[20px] hover:bg-[#19649E] mb-4 w-full md:w-auto"
        onClick={() => navigate(-1)}
      >
        العودة
      </button>

      {/* Main Layout: Beneficiary + Personal Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Left Section (Beneficiary Info + Charts) */}
        <div className="md:col-span-2 lg:col-span-2 flex flex-col gap-6">
          {/* Beneficiary Basic Info */}
          <SmallCard className="flex-1">
            <div className="flex flex-col items-center gap-6 md:flex-row">
              <img
                src={benef.imageUrl || Avatar}
                alt="Avatar"
                className="w-32 h-32 rounded-full object-cover"
              />
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold">{`${benef.firstName} ${benef.lastName}`}</h2>
                <p className="mt-2">الحالة النفسية: {benef.work}</p>
                <p>دكتور: {benef.doctor}</p>
                <div className="mt-4 flex gap-4 justify-center md:justify-start">
                  <a
                    href={emailLink}
                    className="flex items-center justify-center text-white hover:text-[#19649E] bg-[#B2CEF2] border rounded-lg w-9 h-9"
                  >
                    <Send size={20} />
                  </a>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center text-white hover:text-[#19649E] bg-[#B2CEF2] border rounded-lg w-9 h-9"
                  >
                    <Phone size={20} />
                  </a>
                </div>
              </div>
            </div>
          </SmallCard>

          {/* Charts Section */}
          <div className="grid grid-cols-1 gap-6">
            <Card className="flex items-center justify-center">
              <div className="p-4 rounded-lg shadow-md flex flex-col items-center text-center space-y-2">
                <FaCalendarAlt className="text-3xl" />
                <p className="text-2xl font-bold">{sessionsData.totalSessions}</p>
                <h3 className="text-xl font-bold mb-2">إجمالي الجلسات</h3>
              </div>
            </Card>
          </div>
        </div>

        {/* Right Section (Personal Data Card) */}
        <Card className="bg-white text-[#19649E] p-4 col-span-1 md:col-span-2 lg:col-span-2 text-lg">
          <h3 className="text-xl font-bold mb-2">البيانات الشخصية</h3>
          <SmallCard>
            <p>الاسم: {`${benef.firstName} ${benef.lastName}`}</p>
            <p>الحالة النفسية: {benef.work}</p>
            <p>الجنس: {benef.gender}</p>
            <p>العمر: {benef.age}</p>
            <p>البريد الإلكتروني: {benef.email}</p>
            <p>رقم الهاتف: {benef.phone}</p>
            <p>المهنة: {benef.pro}</p>
            <p>عنوان السكن: {benef.homeAddress}</p>
          </SmallCard>
        </Card>
      </div>

      {/* Upcoming & Past Appointments */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments Card */}
        <Card className="p-4 max-h-[450px]">
          <h3 className="text-xl font-bold mb-4">المواعيد القادمة</h3>
          {sessionsData.scheduledSessions.map((session) => (
            <SmallCard key={session._id} className="p-4 flex flex-col md:flex-row items-center mb-4">
              <div className="flex-1 text-center md:text-left">
                <p>الاسم: {`${benef.firstName} ${benef.lastName}`}</p>
                <p>الحالة النفسية: {session.subcategory}</p>
                <p>تاريخ الجلسة: {new Date(session.sessionDate).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2 mt-2 justify-center">
                <a href={emailLink}>
                  <Mail className="text-white cursor-pointer" />
                </a>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Phone className="text-white cursor-pointer" />
                </a>
              </div>
            </SmallCard>
          ))}
        </Card>

        {/* Canceled Appointments Card */}
        <Card className="p-4 max-h-[450px]">
          <h3 className="text-xl font-bold mb-4">المواعيد المعاد جدولتها و الملغاة</h3>
          {sessionsData.canceledSessions.map((session) => (
            <SmallCard key={session._id} className="p-4 flex flex-col md:flex-row items-center mb-4">
              <div className="flex-1 text-center md:text-left">
                <p>الاسم: {`${benef.firstName} ${benef.lastName}`}</p>
                <p>الحالة النفسية: {session.subcategory}</p>
                <p>تاريخ الجلسة: {new Date(session.sessionDate).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2 mt-2 justify-center">
                <a href={emailLink}>
                  <Mail className="text-white cursor-pointer" />
                </a>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Phone className="text-white cursor-pointer" />
                </a>
              </div>
            </SmallCard>
          ))}
        </Card>

        {/* Completed Appointments Card */}
        <Card className="p-4 max-h-[450px]">
          <h3 className="text-xl font-bold mb-4">المواعيد المكتملة</h3>
          {sessionsData.completedSessions.map((session) => (
            <SmallCard key={session._id} className="p-4 flex flex-col md:flex-row items-center mb-4">
              <div className="flex-1 text-center md:text-left">
                <p>الاسم: {`${benef.firstName} ${benef.lastName}`}</p>
                <p>الحالة النفسية: {session.subcategory}</p>
                <p>تاريخ الجلسة: {new Date(session.sessionDate).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2 mt-2 justify-center">
                <a href={emailLink}>
                  <Mail className="text-white cursor-pointer" />
                </a>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Phone className="text-white cursor-pointer" />
                </a>
              </div>
            </SmallCard>
          ))}
        </Card>
      </div>
    </div>
  );
};

export default BeneficiaryDetails;