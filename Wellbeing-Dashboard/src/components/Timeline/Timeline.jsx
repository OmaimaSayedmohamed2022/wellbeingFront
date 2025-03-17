import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import Card from "../UI/card.jsx";
import SmallCard from "../UI/smallcard.jsx";
import { Phone, Send } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Data for charts
const pieData = [
    { name: "الصحة النفسية", value: 30, color: "#B2CEF2" },
    { name: "صحة جسدية", value: 50, color: "#1F77BC" },
];

function SpecialistCard({ spec, showActions, showActions2, onCancel, onAccept }) {
    const [showConfirmation, setShowConfirmation] = useState(false); // State for confirmation modal
    const [showAcceptConfirmation, setShowAcceptConfirmation] = useState(false); // State for accept confirmation modal

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

        const countryCode = isFadi ? "+961" : countryCodes[nationality] || "+20"; // Default to Egypt if nationality is not found
        const cleanedPhoneNumber = phoneNumber.replace(/^0+/, "").replace(/\D/g, "");
        const whatsappUrl = `https://wa.me/${countryCode}${cleanedPhoneNumber}`;
        window.open(whatsappUrl, '_blank');
    };

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

    const handleCancelClick = () => {
        setShowConfirmation(true); // Show confirmation modal
    };

    const handleAcceptClick = () => {
        setShowAcceptConfirmation(true); // Show accept confirmation modal
    };

    const confirmCancel = async () => {
        try {
            const response = await fetch(`https://wellbeingproject.onrender.com/api/sessions/cancel/${spec._id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("تم إلغاء الجلسة بنجاح", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                onCancel(spec._id); // Notify parent component to update the list
            } else {
                toast.error("فشل في إلغاء الجلسة", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        } catch (error) {
            console.error("Error canceling session:", error);
            toast.error("حدث خطأ أثناء إلغاء الجلسة", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } finally {
            setShowConfirmation(false); // Hide confirmation modal
        }
    };

    const confirmAccept = async () => {
        try {
            let response;
            if (spec.status === "Scheduled") {
                // Update the status to "Completed" for المواعيد المجدوله
                response = await fetch(`https://scopey.onrender.com/api/sessions/update/${spec._id}`, {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        status: "Completed"
                    })
                });
            } else if (spec.status === "Pending") {
                // Move from Pending to Scheduled for المواعيد المعلقه
                response = await fetch(`https://scopey.onrender.com/api/sessions/update/pendingToScheduled/${spec._id}`, {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });
            }

            const data = await response.json();

            if (response.ok) {
                toast.success("تم قبول الجلسة بنجاح", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                onAccept(spec._id); // Notify parent component to update the list
            } else {
                toast.error("فشل في قبول الجلسة", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        } catch (error) {
            console.error("Error accepting session:", error);
            toast.error("حدث خطأ أثناء قبول الجلسة", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } finally {
            setShowAcceptConfirmation(false); // Hide confirmation modal
        }
    };

    return (
        <SmallCard className="p-4 flex flex-col gap-2 font-medium">
            {/* Name + Icons in One Row */}
            <div className="flex justify-between items-center">
                <p>
                    الاسم:{" "}
                    {spec?.beneficiary?.length > 0
                        ? `${spec.beneficiary[0]?.firstName || ""} ${spec.beneficiary[0]?.lastName || ""}`.trim() || "غير محدد"
                        : "غير محدد"}
                </p>
                {showActions2 && (
                    <div className="flex gap-8">
                        <Send
                            className="w-7 h-7 bg-[#B2CEF2] rounded-md items-center justify-center mt-1 text-white cursor-pointer"
                            onClick={() => handleEmailClick(spec?.beneficiary?.[0]?.email || "")}
                        />
                        <Phone
                            className="w-7 h-7 bg-[#B2CEF2] rounded-md items-center justify-center mt-1 text-white cursor-pointer"
                            onClick={() => handleWhatsAppClick(spec?.beneficiary?.[0]?.phone || "", spec?.beneficiary?.[0]?.nationality || "مصر")}
                        />
                    </div>
                )}
            </div>
            <div className="flex justify-between items-center">
                <p>دكتور: {spec.doctor || "فادي (المشرف)"}</p>
                {showActions2 && (
                    <div className="flex gap-8">
                        <Send
                            className="w-7 h-7 bg-[#B2CEF2] rounded-md items-center justify-center mt-1 text-white cursor-pointer"
                            onClick={() => handleEmailClick(spec?.specialist?.email || "")}
                        />
                        <Phone
                            className="w-7 h-7 bg-[#B2CEF2] rounded-md items-center justify-center mt-1 text-white cursor-pointer"
                            onClick={() => handleWhatsAppClick(spec?.specialist?.phone || "", spec?.specialist?.nationality || "مصر")}
                        />
                    </div>
                )}
            </div>
            <p>النوع: {spec.subcategory || "غير متوفر"} ({spec.category || "غير متوفر"})</p>
            <p>موعد الجلسه: {spec.sessionDate || "غير متوفر"}</p>

            {showActions && (
                <div className="flex gap-6 mt-2 items-center justify-center">
                    <button
                        className="bg-white w-[85px] font-medium hover:bg-[#B2CEF2] text-[#1F77BC] border-2 border-[#19649E] px-3 py-1 rounded-[20px] text-m"
                        onClick={handleAcceptClick}
                    >
                        قبول
                    </button>
                    <button
                        className="bg-white w-[85px] font-medium hover:bg-[#B2CEF2] text-[#1F77BC] border-2 border-[#19649E] px-3 py-1 rounded-[20px] text-m"
                        onClick={handleCancelClick}
                    >
                        رفض
                    </button>
                </div>
            )}

            {/* Confirmation Modal for Cancel */}
            {showConfirmation && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-bold mb-4 text-[#1F77BC]">هل أنت متأكد من إلغاء الجلسة؟</h3>
                        <div className="flex gap-4 items-center justify-center">
                            <button
                                className=" bg-transparent text-[#1F77BC] border-2 border-[#1F77BC] hover:bg-[#B2CEF2] px-6 py-2 rounded-[20px] text-lg"
                                onClick={confirmCancel}
                            >
                                نعم
                            </button>
                            <button
                                className="bg-transparent text-[#1F77BC] border-2 border-[#1F77BC] hover:bg-[#B2CEF2] px-6 py-2 rounded-[20px] text-lg"
                                onClick={() => setShowConfirmation(false)}
                            >
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal for Accept */}
            {showAcceptConfirmation && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-bold mb-4 text-[#1F77BC]">هل أنت متأكد من قبول الجلسة؟</h3>
                        <div className="flex gap-4 items-center justify-center">
                            <button
                                className=" bg-transparent text-[#1F77BC] border-2 border-[#1F77BC] hover:bg-[#B2CEF2] px-6 py-2 rounded-[20px] text-lg"
                                onClick={confirmAccept}
                            >
                                نعم
                            </button>
                            <button
                                className="bg-transparent text-[#1F77BC] border-2 border-[#1F77BC] hover:bg-[#B2CEF2] px-6 py-2 rounded-[20px] text-lg"
                                onClick={() => setShowAcceptConfirmation(false)}
                            >
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </SmallCard>
    );
}

export default function Beneficiary() {
    const [attendanceData, setAttendanceData] = useState([
        { name: "المواعيد المؤكدة", value: 0, color: "#4A90E2" },
        { name: "المواعيد الملغاة", value: 0, color: "#B2CEF2" }
    ]);
    const [confirmedPercentage, setConfirmedPercentage] = useState("0.00%");
    const [cancelledPercentage, setCancelledPercentage] = useState("0.00%");
    const [scheduledSessions, setScheduledSessions] = useState([]);
    const [canceledSessions, setCanceledSessions] = useState([]);
    const [pendingSessions, setPendingSessions] = useState([]);
    const [complianceData, setComplianceData] = useState([]); // State for التزام المستفيدين بالمواعيد data
    const [scheduledCount, setScheduledCount] = useState(0); // State for the count of scheduled sessions

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch admin stats
                const response = await fetch('https://wellbeingproject.onrender.com/api/admin/stat', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                setConfirmedPercentage(data.confirmedPercentage);
                setCancelledPercentage(data.cancelledPercentage);
                setAttendanceData([
                    { name: "المواعيد المؤكدة", value: parseFloat(data.confirmedPercentage), color: "#4A90E2" },
                    { name: "المواعيد الملغاة", value: parseFloat(data.cancelledPercentage), color: "#B2CEF2" }
                ]);

                // Fetch Scheduled Sessions
                const scheduledResponse = await fetch('https://wellbeingproject.onrender.com/api/sessions/status/Scheduled', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });
                const scheduledData = await scheduledResponse.json();
                setScheduledSessions(scheduledData.sessions.map(session => ({
                    ...session,
                    beneficiary: session.beneficiary || [] // Ensure beneficiary is always an array
                })));

                // Count the number of scheduled sessions
                setScheduledCount(scheduledData.sessions.length);

                // Fetch Canceled Sessions
                const canceledResponse = await fetch('https://wellbeingproject.onrender.com/api/sessions/status/Canceled');
                const canceledData = await canceledResponse.json();
                setCanceledSessions(canceledData.sessions || []);

                // Fetch Pending Sessions
                const pendingResponse = await fetch('https://wellbeingproject.onrender.com/api/sessions/status/Pending');
                const pendingData = await pendingResponse.json();
                setPendingSessions(pendingData.sessions || []);

                // Fetch التزام المستفيدين بالمواعيد data
                const complianceResponse = await fetch('https://wellbeingproject.onrender.com/api/admin/countComplete', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const complianceData = await complianceResponse.json();
                console.log("Compliance Data:", complianceData);

                // Transform the data for the bar chart
                const transformedData = complianceData.map((item) => ({
                    name: `${new Date(item._id.year, item._id.month - 1).toLocaleString('ar', { month: 'long' })} ${item._id.year}`,
                    value: item.count
                }));
                setComplianceData(transformedData);

                // Fetch Session Status Ratios
                const sessionStatusResponse = await fetch('https://wellbeingproject.onrender.com/api/admin/sessionStatusRatio/67a4a7a716033e66a957deb6', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const sessionStatusData = await sessionStatusResponse.json();
                console.log("Session Status Ratios:", sessionStatusData);

            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };
        fetchData();
    }, []);

    // Update the pie chart data with the count of scheduled sessions
    const updatedPieData = [
        { name: "المواعيد المجدوله", value: scheduledCount, color: "#1F77BC" },
        { name: "المواعيد الأخرى", value: 100 - scheduledCount, color: "#B2CEF2" }
    ];

    // Handle session cancellation
    const handleCancelSession = (sessionId) => {
        setScheduledSessions((prevSessions) =>
            prevSessions.filter((session) => session._id !== sessionId)
        );
    };

    // Handle session acceptance
    const handleAcceptSession = (sessionId) => {
        setScheduledSessions((prevSessions) =>
            prevSessions.filter((session) => session._id !== sessionId)
        );
    };

    return (
        <div className="container mx-auto min-h-screen p-4 lg:p-6 flex flex-col gap-6 text-[#1F77BC]">
            <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover />
            {/* Metrics Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Bar Chart */}
                <Card className="p-4 text-center col-span-2">
                    <h3 className="text-lg font-bold mb-2">التزام المستفيدين بالمواعيد</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={complianceData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#4A90E2" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                {/* Pie Chart - Attendance Rate */}
                <Card className="p-4 text-center col-span-2">
                    <h3 className="font-bold mb-2 text-sm sm:text-base">المواعيد المجدوله</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={updatedPieData}
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
                                {updatedPieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Legend verticalAlign="bottom" align="center" iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            {/* Appointments Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Upcoming Appointments (Taller Card) */}
                <Card className="p-4 row-span-2 max-h-[550px]">
                    <h3 className="text-lg font-bold mb-2">المواعيد القادمه</h3>
                    <div className="space-y-4">
                        {scheduledSessions.map((session, index) => (
                            <SpecialistCard
                                key={index}
                                spec={{
                                    ...session,
                                    beneficiary: session.beneficiary || [], // Ensure beneficiary is always an array
                                    work: session.category || "غير متوفر",
                                    doctor: session.specialist ? `${session.specialist.firstName || ""} ${session.specialist.lastName || ""}`.trim() || "فادي (المشرف)" : "فادي (المشرف)",
                                    sessionDate: session.sessionDate ? new Date(session.sessionDate).toLocaleDateString() : "غير متوفر",
                                    email: session.specialist?.email || "", // Ensure email is included
                                    phone: session.specialist?.phone || "", // Ensure phone number is included
                                    nationality: session.specialist?.nationality || "مصري" // Default to Egypt if nationality is missing
                                }}
                                showActions2={true}
                                onCancel={handleCancelSession} // Pass the cancel handler
                                onAccept={handleAcceptSession} // Pass the accept handler
                            />
                        ))}
                    </div>
                </Card>

                {/* Cancelled Appointments (Taller Card) */}
                <Card className="p-4 row-span-2 max-h-[550px]">
                    <h3 className="text-lg font-bold mb-2">المواعيد الملغاة</h3>
                    <div className="space-y-4">
                        {canceledSessions.map((session, index) => (
                            <SpecialistCard
                                key={index}
                                spec={{
                                    ...session,
                                    beneficiary: session.beneficiary || [], // Ensure beneficiary is always an array
                                    work: session.category || "غير متوفر",
                                    doctor: session.specialist ? `${session.specialist.firstName || ""} ${session.specialist.lastName || ""}`.trim() || "فادي (المشرف)" : "فادي (المشرف)",
                                    sessionDate: session.sessionDate ? new Date(session.sessionDate).toLocaleDateString() : "غير متوفر",
                                    email: session.specialist?.email || "", // Ensure email is included
                                    phone: session.specialist?.phone || "", // Ensure phone number is included
                                    nationality: session.specialist?.nationality || "مصري" // Default to Egypt if nationality is missing
                                }}
                                showActions2={true}
                            />
                        ))}
                    </div>
                </Card>

                {/* Scheduled Appointments (Shorter Card) */}
                <Card className="p-4 max-h-[260px]">
                    <h3 className="text-lg font-bold mb-2">المواعيد المجدوله</h3>
                    <div className="space-y-4">
                        {scheduledSessions.map((session, index) => (
                            <SpecialistCard
                                key={index}
                                spec={{
                                    ...session,
                                    beneficiary: session.beneficiary || [], // Ensure beneficiary is always an array
                                    work: session.category || "غير متوفر",
                                    doctor: session.specialist ? `${session.specialist.firstName || ""} ${session.specialist.lastName || ""}`.trim() || "فادي (المشرف)" : "فادي (المشرف)",
                                    sessionDate: session.sessionDate ? new Date(session.sessionDate).toLocaleDateString() : "غير متوفر",
                                    email: session.specialist?.email || "", // Ensure email is included
                                    phone: session.specialist?.phone || "", // Ensure phone number is included
                                    nationality: session.specialist?.nationality || "مصري" // Default to Egypt if nationality is missing
                                }}
                                showActions={true}
                                showActions2={true}
                                onCancel={handleCancelSession} // Pass the cancel handler
                                onAccept={handleAcceptSession} // Pass the accept handler
                            />
                        ))}
                    </div>
                </Card>

                {/* Pending Appointments (Shorter Card) */}
                <Card className="p-4 max-h-[260px]">
                    <h3 className="text-lg font-bold mb-2">المواعيد المعلقه</h3>
                    <div className="space-y-4">
                        {pendingSessions.map((session, index) => (
                            <SpecialistCard
                                key={index}
                                spec={{
                                    ...session,
                                    beneficiary: session.beneficiary || [], // Ensure beneficiary is always an array
                                    work: session.category || "غير متوفر",
                                    doctor: session.specialist ? `${session.specialist.firstName || ""} ${session.specialist.lastName || ""}`.trim() || "فادي (المشرف)" : "فادي (المشرف)",
                                    sessionDate: session.sessionDate ? new Date(session.sessionDate).toLocaleDateString() : "غير متوفر",
                                    email: session.specialist?.email || "", // Ensure email is included
                                    phone: session.specialist?.phone || "", // Ensure phone number is included
                                    nationality: session.specialist?.nationality || "مصري" // Default to Egypt if nationality is missing
                                }}
                                showActions={true}
                                showActions2={true}
                            />
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}