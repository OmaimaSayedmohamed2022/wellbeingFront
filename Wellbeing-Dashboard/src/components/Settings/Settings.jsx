import React, { useState, useEffect, useContext } from "react";
import Card from "../UI/card.jsx";
import Button from "../Advertising/button.jsx";
import { Plus } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Avatar from "../../assets/images/person.jpg";
import SmallCard from "../UI/smallcard.jsx";
import { AuthContext } from "../../context/authContext.jsx"; // Ensure path is correct

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

const Settings = () => {
  const { token, user } = useContext(AuthContext); // Get user and token from context

  // Existing states
  const [showForgetPasswordModal, setShowForgetPasswordModal] = useState(false);
  const [showVerifyCodeModal, setShowVerifyCodeModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showUploadImageModal, setShowUploadImageModal] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isResendingCode, setIsResendingCode] = useState(false);
  const [imageUrl, setImageUrl] = useState("https://res.cloudinary.com/drrl81egc/image/upload/v1739878147/uyobtnkndxagjuqgbn5a.jpg");
  const [selectedImage, setSelectedImage] = useState(null);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [specialists, setSpecialists] = useState([]);

  // New state for specialist form
  const [showSpecialistForm, setShowSpecialistForm] = useState(false);

  // State for form fields
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    nationality: "",
    work: "",
    workAddress: "",
    homeAddress: "",
    bio: "",
    sessionPrice: "",
    yearsExperience: "",
    sessionDuration: "",
    specialties: {
      psychologicalDisorders: [],
      mentalHealth: [],
      physicalHealth: [],
      skillsDevelopment: [],
    },
    isAvailable: false, // Default value
    sessions: [], // Default value
  });

  const [showBeneficiaryForm, setShowBeneficiaryForm] = useState(false);
  const [beneficiaryFormData, setBeneficiaryFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "", 
    phone: "",
    profession: "",
    homeAddress: "",
    age: "",
    region: "",
    nationality: "",
    gender: "",
  });

  const [showUpdateBeneficiaryForm, setShowUpdateBeneficiaryForm] = useState(false);
  const [updateBeneficiaryId, setUpdateBeneficiaryId] = useState(null);
  const [updateBeneficiaryData, setUpdateBeneficiaryData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    profession: "",
    homeAddress: "",
    age: "",
    region: "",
    nationality: "",
    gender: "",
  });

  const handleBeneficiaryInputChange = (e) => {
    const { name, value } = e.target;
    setBeneficiaryFormData({ ...beneficiaryFormData, [name]: value });
  };

  const handleUpdateBeneficiaryInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateBeneficiaryData({ ...updateBeneficiaryData, [name]: value });
  };

  const [showUpdateSpecialistForm, setShowUpdateSpecialistForm] = useState(false);
  const [updateSpecialistId, setUpdateSpecialistId] = useState(null);
  const [updateSpecialistData, setUpdateSpecialistData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    work: "",
    workAddress: "",
    homeAddress: "",
    bio: "",
    sessionPrice: "",
    yearsExperience: "",
    sessionDuration: "",
    specialties: {
      psychologicalDisorders: [],
      mentalHealth: [],
      physicalHealth: [],
      skillsDevelopment: [],
    },
  });

  const handleUpdateSpecialistInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateSpecialistData({ ...updateSpecialistData, [name]: value });
  };

  const handleUpdateSpecialistSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(
        `https://wellbeingproject.onrender.com/api/specialist/update/${updateSpecialistId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateSpecialistData),
        }
      );
  
      const data = await response.json();
  
      if (response.ok) {
        toast.success("تم تحديث بيانات الأخصائي بنجاح!");
        setShowUpdateSpecialistForm(false);
        fetchSpecialists(); // Refetch specialists to update the list
      } else {
        toast.error(data.message || "فشل تحديث بيانات الأخصائي. يرجى المحاولة مرة أخرى.");
      }
    } catch (error) {
      console.error("Error updating specialist:", error);
      toast.error("حدث خطأ. يرجى المحاولة مرة أخرى لاحقًا.");
    }
  };

  const handleEditSpecialist = (specialist) => {
    setUpdateSpecialistId(specialist._id);
    setUpdateSpecialistData({
      firstName: specialist.firstName,
      lastName: specialist.lastName,
      email: specialist.email,
      phone: specialist.phone,
      work: specialist.work,
      workAddress: specialist.workAddress,
      homeAddress: specialist.homeAddress,
      bio: specialist.bio,
      sessionPrice: specialist.sessionPrice,
      yearsExperience: specialist.yearsExperience,
      sessionDuration: specialist.sessionDuration,
      specialties: specialist.specialties,
    });
    setShowUpdateSpecialistForm(true);
  };

  const handleUpdateBeneficiarySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`https://wellbeingproject.onrender.com/api/beneficiaries/update/${updateBeneficiaryId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateBeneficiaryData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("تم تحديث بيانات المستفيد بنجاح!");
        setShowUpdateBeneficiaryForm(false);
        fetchBeneficiaries(); // Refetch beneficiaries to update the list
      } else {
        toast.error(data.errors?.[0]?.msg || "فشل تحديث بيانات المستفيد. يرجى المحاولة مرة أخرى.");
      }
    } catch (error) {
      console.error("Error updating beneficiary:", error);
      toast.error("حدث خطأ. يرجى المحاولة مرة أخرى لاحقًا.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBeneficiary = async (beneficiaryId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المستفيد؟")) {
      try {
        const response = await fetch(`https://wellbeingproject.onrender.com/api/beneficiaries/delete/${beneficiaryId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          toast.success("تم حذف المستفيد بنجاح!");
          fetchBeneficiaries(); // Refetch beneficiaries to update the list
        } else {
          const data = await response.json();
          toast.error(data.message || "فشل حذف المستفيد. يرجى المحاولة مرة أخرى.");
        }
      } catch (error) {
        console.error("Error deleting beneficiary:", error);
        toast.error("حدث خطأ. يرجى المحاولة مرة أخرى لاحقًا.");
      }
    }
  };

  const handleDeleteSpecialist = async (specialistId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الأخصائي؟")) {
      try {
        const response = await fetch(`https://wellbeingproject.onrender.com/api/specialist/delete/${specialistId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          toast.success("تم حذف الأخصائي بنجاح!");
          fetchSpecialists(); // Refetch specialists to update the list
        } else {
          const data = await response.json();
          toast.error(data.message || "فشل حذف الأخصائي. يرجى المحاولة مرة أخرى.");
        }
      } catch (error) {
        console.error("Error deleting specialist:", error);
        toast.error("حدث خطأ. يرجى المحاولة مرة أخرى لاحقًا.");
      }
    }
  };

  const handleEditBeneficiary = (beneficiary) => {
    setUpdateBeneficiaryId(beneficiary._id);
    setUpdateBeneficiaryData({
      firstName: beneficiary.firstName,
      lastName: beneficiary.lastName,
      email: beneficiary.email,
      password: "", // Password is optional for update
      phone: beneficiary.phone,
      profession: beneficiary.profession,
      homeAddress: beneficiary.homeAddress,
      age: beneficiary.age,
      region: beneficiary.region,
      nationality: beneficiary.nationality,
      gender: beneficiary.gender,
    });
    setShowUpdateBeneficiaryForm(true);
  };

  // State for file uploads
  const [idOrPassportFile, setIdOrPassportFile] = useState(null);
const [resumeFile, setResumeFile] = useState(null);
const [certificatesFiles, setCertificatesFiles] = useState([]);
const [ministryLicenseFile, setMinistryLicenseFile] = useState(null);
const [associationMembershipFile, setAssociationMembershipFile] = useState(null);

  // Specialties options with Arabic titles
  const specialtiesOptions = {
    psychologicalDisorders: {
      title: "الاضطرابات النفسية",
      options: [
        "القلق",
        "الاكتئاب",
        "الرهاب",
        "الوسواس",
        "اضطراب جنسي",
        "اضطرابات الأكل",
        "اضطراب الشخص",
        "الإدمان",
        "اضطراب الصدمة",
      ],
    },
    mentalHealth: {
      title: "الصحة النفسية",
      options: [
        "اضطرابات نفسية",
        "برامج علاجية",
        "علاج جماعي",
        "اضطرابات الأطفال",
        "حل مشكلات",
        "إرشاد وتوجيه",
        "وقاية ومتابعة نفسية",
        "اعادة تأهيل ودعم",
      ],
    },
    physicalHealth: {
      title: "الصحة الجسدية",
      options: [
        "نظام غذائي",
        "نظام رياضي",
        "فحوص دورية",
        "عناية صحية",
      ],
    },
    skillsDevelopment: {
      title: "تطوير المهارات",
      options: [
        "الاسترخاء",
        "تحمل الضغوط",
        "ضبط المشاعر",
        "استراجيات جدلية حل",
        "تحقيق التوازن",
        "تحسين الثقة",
        "تحقيق الأهداف",
        "تحقيق النجاح",
        "اضطراب الصدمة",
      ],
    },
  };

  // Category mapping
  const categoryMapping = {
    mentalHealth: "الصحة النفسية",
    psychologicalDisorders: "الاضطرابات النفسية",
    physicalHealth: "الصحة الجسدية",
    skillsDevelopment: "تطوير المهارات",
    // Add more mappings as needed
  };

  // State for logged-in user
  const [loggedInUser, setLoggedInUser] = useState({
    username: "doctor",
    email: "doctor2020@gmail.com",
    imageUrl: "https://res.cloudinary.com/drrl81egc/image/upload/v1741133878/uhytxfke6a5ammkz5pdj.jpg",
  });

  // Fetch all specialists
  useEffect(() => {
    fetchSpecialists();
  }, []);

  const fetchSpecialists = async () => {
    try {
      const response = await fetch("https://wellbeingproject.onrender.com/api/specialist/getAll");
      if (!response.ok) {
        throw new Error("Failed to fetch specialists");
      }
      const data = await response.json();
      setSpecialists(data.data); // Set the fetched specialists
    } catch (error) {
      console.error("Error fetching specialists:", error);
      toast.error("Failed to fetch specialists. Please try again later.");
    }
  };

  useEffect(() => {
    if (!token) return; // Ensure token is available
    fetchBeneficiaries();
  }, [token]); 

  const fetchBeneficiaries = async () => {
    try {
      const response = await fetch("https://wellbeingproject.onrender.com/api/admin/allBeneficary", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch beneficiaries");
      }

      const data = await response.json();
      setBeneficiaries(data.beneficiaries || []); // Ensure beneficiaries is always an array
    } catch (error) {
      console.error("Error fetching beneficiaries:", error);
      toast.error("Failed to fetch beneficiaries. Please try again later.");
    }
  };

  const handleBeneficiarySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Disable the submit button
  
    // Check if password and confirm password match
    if (beneficiaryFormData.password !== beneficiaryFormData.confirmPassword) {
      toast.error("كلمة المرور وتأكيدها غير متطابقين.");
      setIsSubmitting(false);
      return;
    }
  
    // Map Arabic gender to English
    const genderMap = {
      "ذكر": "male",
      "أنثى": "female",
    };
  
    // Prepare the payload
    const formData = {
      firstName: beneficiaryFormData.firstName,
      lastName: beneficiaryFormData.lastName,
      email: beneficiaryFormData.email,
      password: beneficiaryFormData.password,
      phone: beneficiaryFormData.phone,
      profession: beneficiaryFormData.profession,
      homeAddress: beneficiaryFormData.homeAddress,
      age: parseInt(beneficiaryFormData.age, 10), // Ensure age is a number
      region: beneficiaryFormData.region,
      nationality: beneficiaryFormData.nationality,
      gender: genderMap[beneficiaryFormData.gender] || beneficiaryFormData.gender,
    };
  
    try {
      const response = await fetch("https://scopey.onrender.com/api/beneficiaries/register/beneficiary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Success case
        toast.success("تم إضافة المستفيد بنجاح!");
        setShowBeneficiaryForm(false); // Close the form modal
        setBeneficiaryFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
          profession: "",
          homeAddress: "",
          age: "",
          region: "",
          nationality: "",
          gender: "",
        }); // Reset form fields
        fetchBeneficiaries(); // Refetch beneficiaries to update the list
      } else {
        // Handle backend errors
        if (data.errors && Array.isArray(data.errors)) {
          // Display each error message from the backend
          data.errors.forEach((error) => {
            toast.error(error.msg || "حدث خطأ أثناء معالجة الطلب.");
          });
        } else if (data.message) {
          // If the backend returns a single error message
          toast.error(data.message || "فشل إضافة المستفيد. يرجى المحاولة مرة أخرى.");
        } else {
          // Generic error fallback
          toast.error("حدث خطأ غير متوقع. يرجى المحاولة لاحقًا.");
        }
      }
    } catch (error) {
      // Log the full error for debugging
      console.error("Error submitting beneficiary form:", error);
  
      // Display a generic error message
      toast.error("حدث خطأ أثناء معالجة الطلب. يرجى المحاولة لاحقًا.");
    } finally {
      setIsSubmitting(false); // Re-enable the submit button
    }
  };

  

  useEffect(() => {
    const fetchBeneficiariesWithDoctors = async () => {
      if (!token || beneficiaries.length === 0) return;
    
      // Use a batch processing approach to reduce API calls
      const enrichedBeneficiaries = await Promise.all(
        beneficiaries.map(async (beneficiary) => {
          let doctorNames = []; // Array to store all doctor names
          let sessionStatuses = []; // Array to store all session statuses
          let sessionSubcategories = []; // Array to store all session subcategories
    
          if (beneficiary.sessions && beneficiary.sessions.length > 0) {
            // Fetch details for all sessions
            const sessionDetails = await Promise.all(
              beneficiary.sessions.map(async (sessionId) => {
                const session = await fetchSessionDetails(sessionId);
    
                if (session) {
                  // Translate session category to Arabic
                  const sessionStatus = categoryMapping[session.category] || session.category;
                  const sessionSubcategory = session.subcategory;
    
                  let doctorName = "لا يوجد"; // Default value
                  if (session.specialist) {
                    const specialist = await fetchSpecialistDetails(session.specialist);
                    if (specialist) {
                      doctorName = `${specialist.firstName} ${specialist.lastName}`;
                    }
                  }
    
                  return {
                    doctorName,
                    sessionStatus,
                    sessionSubcategory,
                  };
                } else {
                  return {
                    doctorName: "لا يوجد",
                    sessionStatus: "لا يوجد",
                    sessionSubcategory: "لا يوجد",
                  };
                }
              })
            );
    
            // Extract doctor names, statuses, and subcategories from session details
            sessionDetails.forEach((detail) => {
              doctorNames.push(detail.doctorName);
              sessionStatuses.push(detail.sessionStatus);
              sessionSubcategories.push(detail.sessionSubcategory);
            });
          }
    
          // Return the enriched beneficiary
          return {
            ...beneficiary,
            doctorNames,
            sessionStatuses,
            sessionSubcategories,
          };
        })
      );
    
      // Update state with enriched beneficiaries
      setBeneficiaries(enrichedBeneficiaries);
    };

    fetchBeneficiariesWithDoctors();
  }, [token, beneficiaries]); 

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle checkbox changes for specialties
  const handleSpecialtyChange = (e, specialtyType) => {
    const { value, checked } = e.target;
    const updatedSpecialties = { ...updateSpecialistData.specialties };

    if (checked) {
      updatedSpecialties[specialtyType] = [...updatedSpecialties[specialtyType], value];
    } else {
      updatedSpecialties[specialtyType] = updatedSpecialties[specialtyType].filter((item) => item !== value);
    }

    setUpdateSpecialistData({ ...updateSpecialistData, specialties: updatedSpecialties });
  };

  // State for file uploads


// Handle single file changes
const handleFileChange = (e, setFileFunction) => {
  const file = e.target.files[0];
  setFileFunction(file);
};

// Handle multiple file changes
const handleMultipleFilesChange = (e, setFilesFunction) => {
  const files = Array.from(e.target.files);
  setFilesFunction(files);
};

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Create FormData object
    const data = new FormData();
  
    // Append text fields
    Object.keys(formData).forEach((key) => {
      if (key === "specialties") {
        data.append(key, JSON.stringify(formData[key])); // Convert specialties to JSON
      } else {
        data.append(key, formData[key]);
      }
    });
  
    // Append files
    if (idOrPassportFile) data.append("idOrPassport", idOrPassportFile);
    if (resumeFile) data.append("resume", resumeFile);
    if (certificatesFiles.length > 0) {
      certificatesFiles.forEach((file) => {
        data.append("certificates", file);
      });
    }
    if (ministryLicenseFile) data.append("ministryLicense", ministryLicenseFile);
    if (associationMembershipFile) data.append("associationMembership", associationMembershipFile);
  
    try {
      const response = await fetch("https://wellbeingproject.onrender.com/api/specialist/register", {
        method: "POST",
        body: data, // Send FormData directly
      });
  
      if (response.ok) {
        const responseData = await response.json();
        toast.success("تم إرسال النموذج بنجاح!");
        setShowSpecialistForm(false); // Close the form after submission
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "فشل إرسال النموذج. يرجى المحاولة مرة أخرى.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("حدث خطأ. يرجى المحاولة مرة أخرى لاحقًا.");
    }
  };

  const handleSubmitEmail = async (e) => {
    if (e) e.preventDefault();
    if (!email) {
      toast.error("يرجى إدخال البريد الإلكتروني.");
      return;
    }

    try {
      const response = await fetch("https://wellbeingproject.onrender.com/api/resetPassword/forget-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast.success("تم إرسال رمز التحقق إلى بريدك الإلكتروني.");
        setShowForgetPasswordModal(false);
        setShowVerifyCodeModal(true);
      } else {
        toast.error("لم يتم العثور على حساب مرتبط بهذا البريد الإلكتروني.");
      }
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء معالجة الطلب. يرجى المحاولة لاحقًا.");
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!code) {
      toast.error("يرجى إدخال رمز التحقق.");
      return;
    }

    try {
      const response = await fetch("https://wellbeingproject.onrender.com/api/resetPassword/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });

      if (response.ok) {
        toast.success("رمز التحقق صحيح. يمكنك الآن إعادة تعيين كلمة المرور.");
        setShowVerifyCodeModal(false);
        setShowResetPasswordModal(true);
      } else {
        toast.error("رمز التحقق غير صحيح. يرجى المحاولة مرة أخرى.");
      }
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء التحقق من الرمز. يرجى المحاولة لاحقًا.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error("يرجى إدخال كلمة المرور الجديدة وتأكيدها.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("كلمة المرور الجديدة وتأكيدها لا تتطابقان.");
      return;
    }

    try {
      const response = await fetch("https://wellbeingproject.onrender.com/api/resetPassword/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password: newPassword }),
      });

      if (response.ok) {
        toast.success("تمت إعادة تعيين كلمة المرور بنجاح.");
        setShowResetPasswordModal(false);
      } else {
        toast.error("فشل في إعادة تعيين كلمة المرور. يرجى المحاولة لاحقًا.");
      }
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء إعادة تعيين كلمة المرور. يرجى المحاولة لاحقًا.");
    }
  };

  const handleResendCode = async () => {
    setIsResendingCode(true);
    try {
      await handleSubmitEmail();
      toast.success("تم إعادة إرسال رمز التحقق.");
    } catch (err) {
      toast.error("فشل في إعادة إرسال الرمز. يرجى المحاولة لاحقًا.");
    } finally {
      setIsResendingCode(false);
    }
  };

  const handleResetImage = async () => {
    try {
      const response = await fetch("https://wellbeingproject.onrender.com/api/beneficiaries/addImage/67a7ed1765eebdbbbc6982f7", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl: "" }),
      });

      if (response.ok) {
        const data = await response.json();
        setImageUrl(data.updatedUser.imageUrl);
        toast.success("تم إعادة تعيين الصورة بنجاح.");
      } else {
        toast.error("فشل في إعادة تعيين الصورة. يرجى المحاولة لاحقًا.");
      }
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء إعادة تعيين الصورة. يرجى المحاولة لاحقًا.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleUploadImage = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      toast.error("يرجى اختيار صورة.");
      return;
    }
    if (!user?.id || !token) {
      toast.error("يجب تسجيل الدخول لتحديث الصورة.");
      return;
    }

    const formData = new FormData();
    formData.append("Image", selectedImage);

    try {
      const response = await fetch(`https://wellbeingproject.onrender.com/api/beneficiaries/addImage/${user.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setImageUrl(data.updatedUser.imageUrl);
        setLoggedInUser({ ...loggedInUser, imageUrl: data.updatedUser.imageUrl }); // Update logged-in user's image
        toast.success("تم تحميل الصورة بنجاح.");
        setShowUploadImageModal(false);

      } else {
        toast.error("فشل في تحميل الصورة. يرجى المحاولة لاحقًا.");
      }
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء تحميل الصورة. يرجى المحاولة لاحقًا.");
    }
  };

  return (
    <div className="p-6 flex flex-col gap-6 text-[#1F77BC] font-semibold">
      <ToastContainer />
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h2 className="text-lg mb-2">إعدادات الدفع</h2>
          <div className="flex justify-between">
            <img src="/path/to/nco.png" alt="NCO" className="w-10 h-10" />
            <img src="/path/to/visa.png" alt="Visa" className="w-10 h-10" />
            <img src="/path/to/mastercard.png" alt="Mastercard" className="w-10 h-10" />
          </div>
        </Card>
        <Card className="p-6 rounded-2xl shadow-md bg-white space-y-4 max-h-[150px]">
          <h2 className="text-xl font-bold mb-4 text-center text-[#1F77BC]">إعدادات التواصل</h2>

          <div className="space-y-3">
            <Button 
              className="w-full bg-green-500 text-white hover:bg-green-600 transition-colors py-2 rounded-lg"
              onClick={() => window.open("https://wa.me/96171785528", "_blank")}
            >
              Whats App
            </Button>

            <Button 
              className="w-full bg-[#1F77BC] text-white hover:bg-[#155a8a] transition-colors py-2 rounded-lg"
              onClick={() => window.open("mailto:wellbeingallday@gmail.com")}
            >
              Gmail
            </Button>

            <Button 
              className="w-full bg-[#1F77BC] text-white hover:bg-[#155a8a] transition-colors py-2 rounded-lg"
              onClick={() => window.open("mailto:wellbeingallday@outlook.com")}
            >
              Outlook
            </Button>
          </div>
        </Card>

        <Card className="p-4">
          <Button
            className="w-full mb-4"
            onClick={() => setShowForgetPasswordModal(true)}
          >
            نسيت كلمة المرور
          </Button>
          <Button className="w-full" onClick={() => setShowUploadImageModal(true)}>تغيير الصورة</Button>
        </Card>
      </div>

      {/* Forget Password Modal */}
      {showForgetPasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50 text-[#1F77BC]">
          <Card className="p-6 w-96">
            <h2 className="text-lg font-bold mb-4">نسيت كلمة المرور</h2>
            <form onSubmit={handleSubmitEmail}>
              <div className="mb-4">
                <label htmlFor="email" className="block mb-2">
                  البريد الإلكتروني:
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-md"
                  placeholder="أدخل بريدك الإلكتروني"
                />
              </div>
              <div className="flex justify-evenly">
                <button
                  className="bg-transparent text-[#1F77BC] border-2 border-[#1F77BC] hover:bg-[#B2CEF2] px-3 py-1 rounded-[20px] text-lg"
                  onClick={() => setShowForgetPasswordModal(false)}
                >
                  إلغاء
                </button>
                <button type="submit" className="bg-transparent text-[#1F77BC] border-2 border-[#1F77BC] hover:bg-[#B2CEF2] px-3 py-1 rounded-[20px] text-lg">
                  إرسال
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Verify Code Modal */}
      {showVerifyCodeModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <Card className="p-6 w-96">
            <h2 className="text-lg font-bold mb-4">تأكيد رمز التحقق</h2>
            <form onSubmit={handleVerifyCode}>
              <div className="mb-4">
                <label htmlFor="code" className="block mb-2">
                  أدخل رمز التحقق:
                </label>
                <input
                  type="text"
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-md"
                  placeholder="أدخل رمز التحقق"
                />
              </div>
              <div className="mt-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <p className="text-sm text-gray-600">لم تتلق الرمز؟</p>
                  <p
                    className="text-blue-500 hover:text-blue-600 underline cursor-pointer"
                    onClick={handleResendCode}
                    disabled={isResendingCode}
                  >
                    {isResendingCode ? "جاري إعادة الإرسال..." : "إعادة إرسال الرمز"}
                  </p>
                </div>
                <div className="flex justify-evenly">
                  <button
                    className="bg-transparent text-[#1F77BC] border-2 border-[#1F77BC] hover:bg-[#B2CEF2] px-3 py-1 rounded-[20px] text-lg"
                    onClick={() => setShowVerifyCodeModal(false)}
                  >
                    إلغاء
                  </button>
                  <button type="submit" className="bg-transparent text-[#1F77BC] border-2 border-[#1F77BC] hover:bg-[#B2CEF2] px-3 py-1 rounded-[20px] text-lg">
                    تأكيد
                  </button>
                </div>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <Card className="p-6 w-96">
            <h2 className="text-lg font-bold mb-4">إعادة تعيين كلمة المرور</h2>
            <form onSubmit={handleResetPassword}>
              <div className="mb-4">
                <label htmlFor="newPassword" className="block mb-2">
                  كلمة المرور الجديدة:
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-md"
                  placeholder="أدخل كلمة المرور الجديدة"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block mb-2">
                  تأكيد كلمة المرور:
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-md"
                  placeholder="أعد كتابة كلمة المرور"
                />
              </div>
              <div className="flex justify-evenly">
                <button
                  className="bg-transparent text-[#1F77BC] border-2 border-[#1F77BC] hover:bg-[#B2CEF2] px-3 py-1 rounded-[20px] text-lg"
                  onClick={() => setShowResetPasswordModal(false)}
                >
                  إلغاء
                </button>
                <button type="submit" className="bg-transparent text-[#1F77BC] border-2 border-[#1F77BC] hover:bg-[#B2CEF2] px-3 py-1 rounded-[20px] text-lg">
                  إعادة تعيين
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Upload Image Modal */}
      {showUploadImageModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <Card className="p-6 w-96">
            <h2 className="text-lg font-bold mb-4">تحميل صورة جديدة</h2>
            <form onSubmit={handleUploadImage}>
              <div className="mb-4">
                <label htmlFor="image" className="block mb-2">
                  اختر صورة:
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                />
              </div>
              <div className="flex justify-evenly">
                <button
                  className="bg-transparent text-[#1F77BC] border-2 border-[#1F77BC] hover:bg-[#B2CEF2] px-3 py-1 rounded-[20px] text-lg"
                  onClick={() => setShowUploadImageModal(false)}
                >
                  إلغاء
                </button>
                <button type="submit" className="bg-transparent text-[#1F77BC] border-2 border-[#1F77BC] hover:bg-[#B2CEF2] px-3 py-1 rounded-[20px] text-lg">
                  تحميل
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Beneficiaries and Specialists List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Beneficiaries List */}
        <Card className="p-4 max-h-[550px]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg">قائمة المستفيدين</h2>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            {beneficiaries.map((beneficiary) => (
              <SmallCard className="mb-2 p-2" key={beneficiary._id}>
                <div className="flex items-center gap-4">
                  <img
                    src={beneficiary.imageUrl || Avatar}
                    alt="Beneficiary"
                    className="w-14 h-14 rounded-full"
                  />
                  <div className="flex-1 font-medium">
                    <p>الاسم: {beneficiary.firstName} {beneficiary.lastName}</p>
                    <p>المهنة: {beneficiary.profession}</p>
                    {beneficiary.sessions && beneficiary.sessions.length > 0 && (
                      <>
                        <p>اسم الطبيب: {beneficiary.sessions[0].specialist?.firstName} {beneficiary.sessions[0].specialist?.lastName}</p>
                        <p>الحالة: {beneficiary.sessions[0].subcategory}</p>
                      </>
                    )}
                    <div className="flex gap-2 mt-2">
                      <button
                        className="bg-white w-[85px] font-medium hover:bg-[#B2CEF2] text-[#1F77BC] border-2 border-[#19649E] px-3 py-1 rounded-[20px] text-sm"
                        onClick={() => handleEditBeneficiary(beneficiary)}
                      >
                        تعديل
                      </button>
                      <button
                        className="bg-white w-[85px] font-medium hover:bg-[#B2CEF2] text-[#1F77BC] border-2 border-[#19649E] px-3 py-1 rounded-[20px] text-sm"
                        onClick={() => handleDeleteBeneficiary(beneficiary._id)}
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              </SmallCard>
            ))}
          </div>
          <div className="flex items-start">
              <Button
                className="bg-[#1F77BC] text-white rounded-2xl w-20 h-60 flex items-center justify-center"
                onClick={() => setShowBeneficiaryForm(true)}
              >
                <Plus size={34} />
              </Button>
          </div>
        </div>
      </Card>

        


        {showBeneficiaryForm && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50 overflow-y-auto p-4">
            <Card className="p-6 w-full max-w-md md:max-w-lg lg:max-w-xl">
              <h2 className="text-lg font-bold mb-4">إضافة مستفيد جديد</h2>
              <form onSubmit={handleBeneficiarySubmit} className="space-y-4">
                {/* Grid for small screens (1 column) and larger screens (2 columns) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div>
                    <label htmlFor="firstName" className="block mb-2 text-sm font-semibold">
                      الاسم الأول
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="الاسم الأول"
                      value={beneficiaryFormData.firstName}
                      onChange={handleBeneficiaryInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md bg-[#D9D9D9]"
                      required
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label htmlFor="lastName" className="block mb-2 text-sm font-semibold">
                      الاسم الأخير
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="الاسم الأخير"
                      value={beneficiaryFormData.lastName}
                      onChange={handleBeneficiaryInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md bg-[#D9D9D9]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-semibold">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="البريد الإلكتروني"
                      value={beneficiaryFormData.email}
                      onChange={handleBeneficiaryInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md bg-[#D9D9D9]"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block mb-2 text-sm font-semibold">
                      رقم الهاتف
                    </label>
                    <input
                      type="text"
                      name="phone"
                      placeholder="رقم الهاتف"
                      value={beneficiaryFormData.phone}
                      onChange={handleBeneficiaryInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md bg-[#D9D9D9]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block mb-2 text-sm font-semibold">
                      كلمة المرور
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="كلمة المرور"
                      value={beneficiaryFormData.password}
                      onChange={handleBeneficiaryInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md bg-[#D9D9D9]"
                      required
                    />
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmPassword" className="block mb-2 text-sm font-semibold">
                      تأكيد كلمة المرور
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="تأكيد كلمة المرور"
                      value={beneficiaryFormData.confirmPassword}
                      onChange={handleBeneficiaryInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md bg-[#D9D9D9]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Profession */}
                  <div>
                    <label htmlFor="profession" className="block mb-2 text-sm font-semibold">
                      المهنة
                    </label>
                    <input
                      type="text"
                      name="profession"
                      placeholder="المهنة"
                      value={beneficiaryFormData.profession}
                      onChange={handleBeneficiaryInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md bg-[#D9D9D9]"
                      required
                    />
                  </div>

                  {/* Home Address */}
                  <div>
                    <label htmlFor="homeAddress" className="block mb-2 text-sm font-semibold">
                      عنوان المنزل
                    </label>
                    <input
                      type="text"
                      name="homeAddress"
                      placeholder="عنوان المنزل"
                      value={beneficiaryFormData.homeAddress}
                      onChange={handleBeneficiaryInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md bg-[#D9D9D9]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Age */}
                  <div>
                    <label htmlFor="age" className="block mb-2 text-sm font-semibold">
                      العمر
                    </label>
                    <input
                      type="number"
                      name="age"
                      placeholder="العمر"
                      value={beneficiaryFormData.age}
                      onChange={handleBeneficiaryInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md bg-[#D9D9D9]"
                      required
                    />
                  </div>

                  {/* Region */}
                  <div>
                    <label htmlFor="region" className="block mb-2 text-sm font-semibold">
                      المنطقة
                    </label>
                    <input
                      type="text"
                      name="region"
                      placeholder="المنطقة"
                      value={beneficiaryFormData.region}
                      onChange={handleBeneficiaryInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md bg-[#D9D9D9]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nationality */}
                  <div>
                    <label htmlFor="nationality" className="block mb-2 text-sm font-semibold">
                      الجنسية
                    </label>
                    <select
                      name="nationality"
                      value={beneficiaryFormData.nationality}
                      onChange={handleBeneficiaryInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md bg-[#D9D9D9]"
                      required
                    >
                      <option value="">اختر الجنسية</option>
                      {Object.keys(countryCodeMap).map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Gender */}
                  <div>
                    <label htmlFor="gender" className="block mb-2 text-sm font-semibold">
                      الجنس
                    </label>
                    <select
                      name="gender"
                      value={beneficiaryFormData.gender}
                      onChange={handleBeneficiaryInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md bg-[#D9D9D9]"
                      required
                    >
                      <option value="">اختر الجنس</option>
                      <option value="ذكر">ذكر</option>
                      <option value="أنثى">أنثى</option>
                    </select>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-evenly">
                  <button
                    type="button"
                    className="bg-transparent text-[#1F77BC] border-2 border-[#1F77BC] hover:bg-[#B2CEF2] px-3 py-1 rounded-[20px] text-lg"
                    onClick={() => setShowBeneficiaryForm(false)}
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="bg-transparent text-[#1F77BC] border-2 border-[#1F77BC] hover:bg-[#B2CEF2] px-3 py-1 rounded-[20px] text-lg"
                  >
                    إضافة
                  </button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Update Beneficiary Form Modal */}
        {showUpdateBeneficiaryForm && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50 overflow-y-auto p-4">
            <Card className="p-6 w-full max-w-md md:max-w-lg lg:max-w-xl">
              <h2 className="text-lg font-bold mb-4">تحديث بيانات المستفيد</h2>
              <form onSubmit={handleUpdateBeneficiarySubmit} className="space-y-4">
                {/* Grid for small screens (1 column) and larger screens (2 columns) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div>
                    <label htmlFor="firstName" className="block mb-2 text-sm font-semibold">
                      الاسم الأول
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="الاسم الأول"
                      value={updateBeneficiaryData.firstName}
                      onChange={handleUpdateBeneficiaryInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md bg-[#D9D9D9]"
                      required
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label htmlFor="lastName" className="block mb-2 text-sm font-semibold">
                      الاسم الأخير
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="الاسم الأخير"
                      value={updateBeneficiaryData.lastName}
                      onChange={handleUpdateBeneficiaryInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md bg-[#D9D9D9]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-semibold">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="البريد الإلكتروني"
                      value={updateBeneficiaryData.email}
                      onChange={handleUpdateBeneficiaryInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md bg-[#D9D9D9]"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block mb-2 text-sm font-semibold">
                      رقم الهاتف
                    </label>
                    <input
                      type="text"
                      name="phone"
                      placeholder="رقم الهاتف"
                      value={updateBeneficiaryData.phone}
                      onChange={handleUpdateBeneficiaryInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md bg-[#D9D9D9]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block mb-2 text-sm font-semibold">
                      كلمة المرور
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="كلمة المرور"
                      value={updateBeneficiaryData.password}
                      onChange={handleUpdateBeneficiaryInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md bg-[#D9D9D9]"
                    />
                  </div>

                  {/* Profession */}
                  <div>
                    <label htmlFor="profession" className="block mb-2 text-sm font-semibold">
                      المهنة
                    </label>
                    <input
                      type="text"
                      name="profession"
                      placeholder="المهنة"
                      value={updateBeneficiaryData.profession}
                      onChange={handleUpdateBeneficiaryInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md bg-[#D9D9D9]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Home Address */}
                  <div>
                    <label htmlFor="homeAddress" className="block mb-2 text-sm font-semibold">
                      عنوان المنزل
                    </label>
                    <input
                      type="text"
                      name="homeAddress"
                      placeholder="عنوان المنزل"
                      value={updateBeneficiaryData.homeAddress}
                      onChange={handleUpdateBeneficiaryInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md bg-[#D9D9D9]"
                      required
                    />
                  </div>

                  {/* Age */}
                  <div>
                    <label htmlFor="age" className="block mb-2 text-sm font-semibold">
                      العمر
                    </label>
                    <input
                      type="number"
                      name="age"
                      placeholder="العمر"
                      value={updateBeneficiaryData.age}
                      onChange={handleUpdateBeneficiaryInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md bg-[#D9D9D9]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Region */}
                  <div>
                    <label htmlFor="region" className="block mb-2 text-sm font-semibold">
                      المنطقة
                    </label>
                    <input
                      type="text"
                      name="region"
                      placeholder="المنطقة"
                      value={updateBeneficiaryData.region}
                      onChange={handleUpdateBeneficiaryInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md bg-[#D9D9D9]"
                      required
                    />
                  </div>

                  {/* Nationality */}
                  <div>
                    <label htmlFor="nationality" className="block mb-2 text-sm font-semibold">
                      الجنسية
                    </label>
                    <select
                      name="nationality"
                      value={updateBeneficiaryData.nationality}
                      onChange={handleUpdateBeneficiaryInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md bg-[#D9D9D9]"
                      required
                    >
                      <option value="">اختر الجنسية</option>
                      {Object.keys(countryCodeMap).map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Gender */}
                  <div>
                    <label htmlFor="gender" className="block mb-2 text-sm font-semibold">
                      الجنس
                    </label>
                    <select
                      name="gender"
                      value={updateBeneficiaryData.gender}
                      onChange={handleUpdateBeneficiaryInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md bg-[#D9D9D9]"
                      required
                    >
                      <option value="">اختر الجنس</option>
                      <option value="ذكر">ذكر</option>
                      <option value="أنثى">أنثى</option>
                    </select>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-evenly">
                  <button
                    type="button"
                    className="bg-transparent text-[#1F77BC] border-2 border-[#1F77BC] hover:bg-[#B2CEF2] px-3 py-1 rounded-[20px] text-lg"
                    onClick={() => setShowUpdateBeneficiaryForm(false)}
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="bg-transparent text-[#1F77BC] border-2 border-[#1F77BC] hover:bg-[#B2CEF2] px-3 py-1 rounded-[20px] text-lg"
                  >
                    تحديث
                  </button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Specialists List */}
        <Card className="p-4 max-h-[550px]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg">قائمة الأخصائيين</h2>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            {specialists.map((specialist) => (
              <SmallCard className="mb-2 p-2" key={specialist._id}>
                <div className="flex items-center gap-4">
                  <img
                    src={specialist.imageUrl || Avatar}
                    alt="Specialist"
                    className="w-14 h-14 rounded-full"
                  />
                  <div className="flex-1 font-medium">
                    <p>الاسم: {specialist.firstName} {specialist.lastName}</p>
                    <p>النوع: {specialist.work}</p>
                    <p>عدد الجلسات: {specialist.sessions?.length || 0}</p>
                    <div className="flex gap-2 mt-2">
                      <button
                        className="bg-white w-[85px] font-medium hover:bg-[#B2CEF2] text-[#1F77BC] border-2 border-[#19649E] px-3 py-1 rounded-[20px] text-sm"
                        onClick={() => handleEditSpecialist(specialist)}
                      >
                        تعديل
                      </button>
                      <button
                        className="bg-white w-[85px] font-medium hover:bg-[#B2CEF2] text-[#1F77BC] border-2 border-[#19649E] px-3 py-1 rounded-[20px] text-sm"
                        onClick={() => handleDeleteSpecialist(specialist._id)}
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              </SmallCard>
            ))}
          </div>
          <div className="flex items-start">
              <Button
                className="bg-[#1F77BC] text-white rounded-2xl w-20 h-60 flex items-center justify-center"
                onClick={() => setShowSpecialistForm(true)}
              >
                <Plus size={44} />
              </Button>
          </div>
        </div>
      </Card>
      </div>

      {/* Update Specialist Form Modal */}
      {showUpdateSpecialistForm && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50 p-6">
    <Card className="w-full max-w-4xl p-6 overflow-y-auto max-h-[90vh]">
      <h2 className="text-lg font-bold mb-4">تحديث بيانات الأخصائي</h2>
      <form onSubmit={handleUpdateSpecialistSubmit} className="space-y-4">
        {/* Personal Information */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="firstName"
            placeholder="الاسم الأول"
            value={updateSpecialistData.firstName}
            onChange={handleUpdateSpecialistInputChange}
            className="p-2 border border-gray-300 rounded-md"
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="الاسم الأخير"
            value={updateSpecialistData.lastName}
            onChange={handleUpdateSpecialistInputChange}
            className="p-2 border border-gray-300 rounded-md"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="البريد الإلكتروني"
            value={updateSpecialistData.email}
            onChange={handleUpdateSpecialistInputChange}
            className="p-2 border border-gray-300 rounded-md"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="رقم الهاتف"
            value={updateSpecialistData.phone}
            onChange={handleUpdateSpecialistInputChange}
            className="p-2 border border-gray-300 rounded-md"
            required
          />
          {/* Nationality */}
<div>
  <label htmlFor="nationality" className="block mb-2 text-sm font-semibold">
    
  </label>
  <select
    name="nationality"
    value={updateSpecialistData.nationality}
    onChange={handleUpdateSpecialistInputChange}
    className="w-full p-2 border border-gray-300 rounded-md bg-[#D9D9D9]"
    required
  >
    <option value="">اختر الجنسية</option>
    {Object.keys(countryCodeMap).map((country) => (
      <option key={country} value={country}>
        {country}
      </option>
    ))}
  </select>
</div>
        </div>

        {/* Work Information */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="work"
            placeholder="المهنة"
            value={updateSpecialistData.work}
            onChange={handleUpdateSpecialistInputChange}
            className="p-2 border border-gray-300 rounded-md"
            required
          />
          <input
            type="text"
            name="workAddress"
            placeholder="عنوان العمل"
            value={updateSpecialistData.workAddress}
            onChange={handleUpdateSpecialistInputChange}
            className="p-2 border border-gray-300 rounded-md"
            required
          />
          <input
            type="text"
            name="homeAddress"
            placeholder="عنوان المنزل"
            value={updateSpecialistData.homeAddress}
            onChange={handleUpdateSpecialistInputChange}
            className="p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Bio */}
        <textarea
          name="bio"
          placeholder="نبذة عنك"
          value={updateSpecialistData.bio}
          onChange={handleUpdateSpecialistInputChange}
          className="w-full p-2 border border-gray-300 rounded-md"
          rows="4"
        />

        {/* Session Information */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="sessionPrice"
            placeholder="سعر الجلسة"
            value={updateSpecialistData.sessionPrice}
            onChange={handleUpdateSpecialistInputChange}
            className="p-2 border border-gray-300 rounded-md"
            required
          />
          <input
            type="number"
            name="yearsExperience"
            placeholder="سنوات الخبرة"
            value={updateSpecialistData.yearsExperience}
            onChange={handleUpdateSpecialistInputChange}
            className="p-2 border border-gray-300 rounded-md"
            required
          />
          <input
            type="number"
            name="sessionDuration"
            placeholder="مدة الجلسة (بالدقائق)"
            value={updateSpecialistData.sessionDuration}
            onChange={handleUpdateSpecialistInputChange}
            className="p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Specialties Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold">التخصصات</h3>
          {Object.entries(specialtiesOptions).map(([specialtyType, { title, options }]) => (
            <div key={specialtyType} className="space-y-2">
              <h4 className="font-medium">{title}</h4>
              <div className="grid grid-cols-2 gap-4">
                {options.map((option) => (
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={option}
                      checked={updateSpecialistData.specialties[specialtyType].includes(option)}
                      onChange={(e) => handleSpecialtyChange(e, specialtyType)}
                      className="form-checkbox"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit and Cancel Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            className="bg-gray-500 text-white p-2 rounded-md"
            onClick={() => setShowUpdateSpecialistForm(false)}
          >
            إلغاء
          </Button>
          <Button type="submit" className="bg-[#1F77BC] text-white p-2 rounded-md">
            تحديث
          </Button>
        </div>
      </form>
    </Card>
  </div>
)}

      {/* Specialist Form Modal */}
      {showSpecialistForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50 p-6">
          <Card className="w-full max-w-4xl p-6 overflow-y-auto max-h-[90vh]">
            <h2 className="text-lg font-bold mb-4">إضافة أخصائي جديد</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
  {/* Personal Information */}
  <div className="grid grid-cols-2 gap-4">
    <input
      type="text"
      name="firstName"
      placeholder="الاسم الأول"
      value={formData.firstName}
      onChange={handleInputChange}
      className="p-2 border border-gray-300 rounded-md"
      required
    />
    <input
      type="text"
      name="lastName"
      placeholder="الاسم الأخير"
      value={formData.lastName}
      onChange={handleInputChange}
      className="p-2 border border-gray-300 rounded-md"
      required
    />
    <input
      type="email"
      name="email"
      placeholder="البريد الإلكتروني"
      value={formData.email}
      onChange={handleInputChange}
      className="p-2 border border-gray-300 rounded-md"
      required
    />
    <input
      type="password"
      name="password"
      placeholder="كلمة المرور"
      value={formData.password}
      onChange={handleInputChange}
      className="p-2 border border-gray-300 rounded-md"
      required
    />
    <input
      type="text"
      name="phone"
      placeholder="رقم الهاتف"
      value={formData.phone}
      onChange={handleInputChange}
      className="p-2 border border-gray-300 rounded-md"
      required
    />
    <select
      name="nationality"
      value={formData.nationality}
      onChange={handleInputChange}
      className="w-full p-2 border border-gray-300 rounded-md bg-[#D9D9D9]"
      required
    >
      <option value="">اختر الجنسية</option>
      {Object.keys(countryCodeMap).map((country) => (
        <option key={country} value={country}>
          {country}
        </option>
      ))}
    </select>
  </div>

  {/* Work Information */}
  <div className="grid grid-cols-2 gap-4">
    <input
      type="text"
      name="work"
      placeholder="المهنة"
      value={formData.work}
      onChange={handleInputChange}
      className="p-2 border border-gray-300 rounded-md"
      required
    />
    <input
      type="text"
      name="workAddress"
      placeholder="عنوان العمل"
      value={formData.workAddress}
      onChange={handleInputChange}
      className="p-2 border border-gray-300 rounded-md"
      required
    />
    <input
      type="text"
      name="homeAddress"
      placeholder="عنوان المنزل"
      value={formData.homeAddress}
      onChange={handleInputChange}
      className="p-2 border border-gray-300 rounded-md"
      required
    />
  </div>

  {/* Bio */}
  <textarea
    name="bio"
    placeholder="نبذة عنك"
    value={formData.bio}
    onChange={handleInputChange}
    className="w-full p-2 border border-gray-300 rounded-md"
    rows="4"
  />

  {/* Session Information */}
  <div className="grid grid-cols-2 gap-4">
    <input
      type="number"
      name="sessionPrice"
      placeholder="سعر الجلسة"
      value={formData.sessionPrice}
      onChange={handleInputChange}
      className="p-2 border border-gray-300 rounded-md"
      required
    />
    <input
      type="number"
      name="yearsExperience"
      placeholder="سنوات الخبرة"
      value={formData.yearsExperience}
      onChange={handleInputChange}
      className="p-2 border border-gray-300 rounded-md"
      required
    />
    <input
      type="number"
      name="sessionDuration"
      placeholder="مدة الجلسة (بالدقائق)"
      value={formData.sessionDuration}
      onChange={handleInputChange}
      className="p-2 border border-gray-300 rounded-md"
      required
    />
  </div>

  {/* Specialties Section */}
  <div className="space-y-4">
    <h3 className="text-lg font-bold">التخصصات</h3>
    {Object.entries(specialtiesOptions).map(([specialtyType, { title, options }]) => (
      <div key={specialtyType} className="space-y-2">
        <h4 className="font-medium">{title}</h4>
        <div className="grid grid-cols-2 gap-4">
          {options.map((option) => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={option}
                checked={formData.specialties[specialtyType].includes(option)}
                onChange={(e) => handleSpecialtyChange(e, specialtyType)}
                className="form-checkbox"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>
    ))}
  </div>

  {/* File Uploads */}
  <div className="space-y-4">
    <input
      type="file"
      onChange={(e) => handleFileChange(e, setIdOrPassportFile)}
      className="w-full p-2 border border-gray-300 rounded-md"
      required
    />
    <input
      type="file"
      onChange={(e) => handleFileChange(e, setResumeFile)}
      className="w-full p-2 border border-gray-300 rounded-md"
      required
    />
    <input
      type="file"
      multiple
      onChange={(e) => handleMultipleFilesChange(e, setCertificatesFiles)}
      className="w-full p-2 border border-gray-300 rounded-md"
      required
    />
    <input
      type="file"
      onChange={(e) => handleFileChange(e, setMinistryLicenseFile)}
      className="w-full p-2 border border-gray-300 rounded-md"
      required
    />
    <input
      type="file"
      onChange={(e) => handleFileChange(e, setAssociationMembershipFile)}
      className="w-full p-2 border border-gray-300 rounded-md"
      required
    />
  </div>

  {/* Submit and Cancel Buttons */}
  <div className="flex justify-end gap-4">
    <Button
      type="button"
      className="bg-gray-500 text-white p-2 rounded-md"
      onClick={() => setShowSpecialistForm(false)}
    >
      إلغاء
    </Button>
    <Button type="submit" className="bg-[#1F77BC] text-white p-2 rounded-md">
      إرسال
    </Button>
  </div>
</form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Settings;