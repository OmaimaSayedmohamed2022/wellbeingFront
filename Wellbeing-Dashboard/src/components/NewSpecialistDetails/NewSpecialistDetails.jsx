import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "../UI/card.jsx";
import Avatar from "../../assets/images/person.jpg";
import { Download, File, ArrowLeft, Send, Phone } from "lucide-react";
import { AuthContext } from "../../context/authContext.jsx";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { parsePhoneNumberFromString, getCountryCallingCode } from 'libphonenumber-js';

// Country code mapping
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

// Function to format phone number with country code
const formatPhoneNumber = (phoneNumber, nationality) => {
  if (!phoneNumber) return phoneNumber; // Return as-is if no phone number

  // Get the country code from the nationality
  const countryCode = countryCodeMap[nationality] || "EG"; // Default to Saudi Arabia if nationality is not mapped

  // Remove any leading zeros from the phone number
  const cleanedPhoneNumber = phoneNumber.replace(/^0+/, "");

  // Parse the phone number
  const parsedNumber = parsePhoneNumberFromString(cleanedPhoneNumber, countryCode);

  if (parsedNumber && parsedNumber.isValid()) {
    return parsedNumber.formatInternational(); // Format as international number
  }

  // If parsing fails, prepend the country calling code
  const callingCode = getCountryCallingCode(countryCode);
  return `+${callingCode}${cleanedPhoneNumber}`; // Remove any non-numeric characters
};

const NewSpecialistDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const specialist = location.state?.specialist;
  const [isConfirming, setIsConfirming] = useState(false); // State for acceptance confirmation
  const [isConfirmingRejection, setIsConfirmingRejection] = useState(false); // State for rejection confirmation
  const { token } = useContext(AuthContext);

  if (!specialist) {
    return <div>No specialist data found.</div>;
  }

  // Function to handle going back
  const handleGoBack = () => {
    navigate(-1);
  };

  // Function to handle accepting the specialist
  const handleAcceptSpecialist = async () => {
    setIsConfirming(true);
  };

  // Function to confirm acceptance
  const confirmAcceptance = async () => {
    try {
      if (!token) {
        throw new Error("لم يتم العثور على رمز التحقق. يرجى تسجيل الدخول مرة أخرى.");
      }
      const response = await axios.patch(
        `https://wellbeingproject.onrender.com/api/admin/confirm/${specialist.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        navigate(-1); // Navigate back after successful acceptance
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
      setIsConfirming(false);
    }
  };

  // Function to handle rejecting the specialist
  const handleRejectSpecialist = async () => {
    setIsConfirmingRejection(true);
  };

  // Function to confirm rejection
  const confirmRejection = async () => {
    try {
      if (!token) {
        throw new Error("لم يتم العثور على رمز التحقق. يرجى تسجيل الدخول مرة أخرى.");
      }

      const response = await axios.delete(
        `https://wellbeingproject.onrender.com/api/specialist/delete/${specialist.id}`,
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

        navigate(-1); // Navigate back after successful rejection
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
      setIsConfirmingRejection(false);
    }
  };

  // Function to handle WhatsApp click
  const handleWhatsAppClick = () => {
    const formattedPhoneNumber = formatPhoneNumber(specialist.phone, specialist.nationality);
    const phoneNumber = formattedPhoneNumber.replace(/\D/g, ""); // Remove non-numeric characters
    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    window.open(whatsappUrl, "_blank");
  };

  // Function to handle email click
  const handleEmailClick = () => {
    const emailUrl = `mailto:${specialist.email}`;
    window.location.href = emailUrl;
  };

  // Extract files from the specialist object
  const files = [
    { name: "صورة الهوية/الباسبور", url: specialist.files?.idOrPassport },
    { name: "السيرة الذاتية", url: specialist.files?.resume },
    { name: "ترخيص أو إذن مزاولة المهنة", url: specialist.files?.ministryLicense },
    { name: "الشهادات", url: specialist.files?.certificates?.[0] },
    { name: "عضوية النقابة أو الجمعية", url: specialist.files?.associationMembership },
  ].filter((file) => file.url);

  return (
    <div className="p-2 sm:p-4 flex flex-col gap-4 font-medium text-[#1F77BC]">
      <ToastContainer />
      {/* Main Card on the Right */}
      <div className="flex flex-col md:flex-row gap-4">
        <Card className="rounded-2xl shadow-md p-2 sm:p-4 bg-white w-full md:max-w-[700px]">
          {/* Back Button */}
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 m-2 sm:m-4 text-[#1F77BC] hover:text-[#19649E]"
          >
            <ArrowLeft size={20} />
            <span>عودة</span>
          </button>
          <div className="flex items-center justify-end gap-2 mb-2 sm:mb-4">
            {/* WhatsApp Icon */}
            <div
              className="p-2 bg-[#1F77BC] rounded-lg cursor-pointer"
              title={`واتساب: ${formatPhoneNumber(specialist.phone, specialist.nationality)}`}
              onClick={handleWhatsAppClick}
            >
              <Phone className="text-white w-4 h-4" />
            </div>
            {/* Email Icon */}
            <div
              className="p-2 bg-[#1F77BC] rounded-lg cursor-pointer"
              title={`إرسال بريد: ${specialist.email}`}
              onClick={handleEmailClick}
            >
              <Send className="text-white w-4 h-4" />
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">تفاصيل المتخصص الجديد</h1>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Specialist Image */}
            <img
              src={specialist.imageUrl || Avatar}
              alt="Specialist Avatar"
              className="w-24 h-24 sm:w-56 sm:h-40 object-cover rounded-[20px] mb-2 sm:mb-4 border-gray-500"
            />
            {/* Specialist Details */}
            <div>
              <p className="text-sm sm:text-lg">
                <strong>الاسم:</strong> {specialist.firstName} {specialist.lastName}
              </p>
              <p className="text-sm sm:text-lg">
                <strong>التخصص:</strong> {specialist.work}
              </p>
              <p className="text-sm sm:text-lg">
                <strong>سنين الخبرة:</strong> {specialist.yearsExperience}
              </p>
              <p className="text-sm sm:text-lg">
                <strong>الجنس:</strong> {specialist.gender || "غير محدد"}
              </p>
              <p className="text-sm sm:text-lg">
                <strong>البريد الإلكتروني:</strong> {specialist.email}
              </p>
              <p className="text-sm sm:text-lg">
                <strong>رقم الهاتف:</strong> {specialist.phone}
              </p>
              <p className="text-sm sm:text-lg">
                <strong>عنوان العمل:</strong> {specialist.workAddress}
              </p>
              <p className="text-sm sm:text-lg">
                <strong>عنوان السكن:</strong> {specialist.homeAddress}
              </p>
              <p className="text-sm sm:text-lg">
                <strong>سعر الجلسة:</strong> {specialist.sessionPrice}$
              </p>
              <p className="text-sm sm:text-lg">
                <strong>مدة الجلسة:</strong> {specialist.sessionDuration} دقيقة
              </p>
              <p className="text-sm sm:text-lg">
                <strong>اللغة:</strong> {specialist.language || "غير محدد"}
              </p>
            </div>
          </div>
        </Card>
        {/* Left Side Cards */}
        <div className="flex flex-col gap-4 w-full md:max-w-[400px]">
          {/* Required Documents Card */}
          <Card className="rounded-2xl shadow-md p-2 sm:p-4 bg-white">
            <h2 className="text-lg sm:text-xl font-bold mb-2">الأوراق المطلوبة</h2>
            <ul className="list-disc pl-4">
              <li>صورة الهوية/الباسبور</li>
              <li>السيرة الذاتية</li>
              <li>ترخيص أو إذن مزاولة المهنة</li>
              <li>الشهادات</li>
              <li>عضوية النقابة أو الجمعية</li>
            </ul>
          </Card>
          {/* Files Section */}
          <Card className="rounded-2xl shadow-md p-2 sm:p-4 bg-white">
            <h2 className="text-lg sm:text-xl font-bold mb-2">الملفات المرفوعة</h2>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <File size={20} className="text-[#1F77BC]" />
                    <span className="text-sm sm:text-base">{file.name}</span>
                  </div>
                  <a
                    href={file.url}
                    download
                    className="text-[#1F77BC] hover:text-[#19649E]"
                  >
                    <Download size={16} className="mr-2 sm:mr-4" />
                  </a>
                </div>
              ))}
            </div>
          </Card>
          {/* Description Card */}
          <Card className="rounded-2xl shadow-md p-2 sm:p-4 bg-white">
            <h2 className="text-lg sm:text-xl font-bold mb-2">نبذه عنه</h2>
            <p className="text-sm sm:text-base">{specialist.bio || "لا يوجد وصف متوفر."}</p>
          </Card>
        </div>
      </div>
      {/* Action Buttons at the Bottom Center */}
      <div className="flex justify-center gap-4 mt-4 w-full">
        <button
          onClick={handleAcceptSpecialist}
          className="px-4 py-2 bg-white text-[#1F77BC] font-bold rounded-[20px] border-2 border-[#1F77BC] shadow-md hover:bg-[#1F77BC] hover:text-white transition-colors duration-300"
          aria-label="قبول الأخصائي"
        >
          قبول الأخصائي
        </button>
        <button
          onClick={handleRejectSpecialist}
          className="px-4 py-2 bg-white text-[#1F77BC] font-bold rounded-[20px] border-2 border-[#1F77BC] shadow-md hover:bg-[#1F77BC] hover:text-white transition-colors duration-300"
          aria-label="رفض الأخصائي"
        >
          رفض الأخصائي
        </button>
      </div>
      {/* Acceptance Confirmation Dialog */}
      {isConfirming && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md text-center">
            <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">هل أنت متأكد من قبول الأخصائي؟</h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmAcceptance}
                className="px-4 py-2 bg-[#1F77BC] text-white font-bold rounded-[20px] hover:bg-[#19649E] transition-colors duration-300"
              >
                نعم
              </button>
              <button
                onClick={() => setIsConfirming(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 font-bold rounded-[20px] hover:bg-gray-400 transition-colors duration-300"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Rejection Confirmation Dialog */}
      {isConfirmingRejection && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md text-center">
            <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">هل أنت متأكد من رفض الأخصائي؟</h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmRejection}
                className="px-4 py-2 bg-[#1F77BC] text-white font-bold rounded-[20px] hover:bg-[#19649E] transition-colors duration-300"
              >
                نعم
              </button>
              <button
                onClick={() => setIsConfirmingRejection(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 font-bold rounded-[20px] hover:bg-gray-400 transition-colors duration-300"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewSpecialistDetails;