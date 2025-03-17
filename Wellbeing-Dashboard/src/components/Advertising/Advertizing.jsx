import React, { useState, useEffect, useContext } from "react";
import Card from "../UI/card.jsx";
import SmallCard from "../UI/smallcard.jsx";
import Button from "./button.jsx";
import { motion } from "framer-motion";
import adv from "../../assets/images/adv.png";
import { Plus } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import axios from "axios";
import { AuthContext } from "../../context/authContext.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdListComponent = () => {
  const [showForm, setShowForm] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [ads, setAds] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [adToDelete, setAdToDelete] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [adToEdit, setAdToEdit] = useState(null);
  const { token } = useContext(AuthContext);
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    if (!token) {
      toast.error("Please log in to view this section.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      window.location.href = "/login";
    } else {
      fetchAds();
      fetchEngagementData();
      fetchInteractionData();
    }
  }, [token]);

  const fetchEngagementData = async () => {
    try {
      const response = await axios.get(
        "https://wellbeingproject.onrender.com/api/adv/getAdvEngagementRate",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const formattedData = response.data.engagement.map((item) => ({
        name: item._id ? item._id.toString() : "Unknown",
        value: item.totalViews,
      }));
      setBarData(formattedData);
    } catch (error) {
      console.error("Failed to fetch engagement data:", error);
    }
  };

  const fetchInteractionData = async () => {
    try {
      const response = await axios.get(
        "https://wellbeingproject.onrender.com/api/adv/getAdvInteractions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const sortedData = response.data.interactions
        .sort((a, b) => b.totalViews - a.totalViews)
        .slice(0, 3);
      const formattedData = sortedData.map((item) => ({
        name: item._id,
        value: item.totalViews,
      }));
      setPieData(formattedData);
    } catch (error) {
      console.error("Failed to fetch interaction data:", error);
    }
  };

  const fetchAds = async () => {
    try {
      const response = await axios.get(
        "https://wellbeingproject.onrender.com/api/admin/getAdv",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAds(response.data.advs);
    } catch (error) {
      console.error("Failed to fetch ads:", error);
      toast.error("Failed to fetch ads. Please try again.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleDelete = async (adId) => {
    if (!token) {
      toast.error("Please log in to delete an advertisement.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    try {
      const response = await axios.delete(
        `https://scopey.onrender.com/api/adv/delete/${adId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("تم حذف الإعلان بنجاح!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        fetchAds();
      }
    } catch (error) {
      console.error("Error deleting advertisement:", error);
      toast.error("فشل في حذف الإعلان. يرجى المحاولة مرة أخرى.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setShowDeleteConfirmation(false);
    }
  };

  const confirmDelete = (adId) => {
    setAdToDelete(adId);
    setShowDeleteConfirmation(true);
  };

  const cancelDelete = () => {
    setAdToDelete(null);
    setShowDeleteConfirmation(false);
  };

  const handleEditClick = (ad) => {
    setAdToEdit(ad);
    setTitle(ad.title);
    setType(ad.type);
    setUploadedImage(ad.photo || null);
    setShowEditForm(true);
  };

  const handleUpdate = async () => {
    if (!token) {
      toast.error("يرجى تسجيل الدخول لتحديث الإعلان.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("type", type);

      if (uploadedImage && uploadedImage !== adToEdit.photo) {
        const file = dataURLtoFile(uploadedImage, "advertisement.jpg");
        formData.append("photo", file);
      } else if (adToEdit.photo) {
        const response = await fetch(adToEdit.photo);
        const blob = await response.blob();
        const file = new File([blob], "existing_advertisement.jpg", {
          type: blob.type,
        });
        formData.append("photo", file);
      } else {
        toast.error("يرجى تحميل صورة للإعلان.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }

      toast.info("جارٍ تحديث الإعلان...", {
        position: "top-center",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
      });

      const response = await axios.put(
        `https://scopey.onrender.com/api/adv/update/${adToEdit._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const updatedAd = response.data.adv;
        toast.success("تم تحديث الإعلان بنجاح!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setAds((prevAds) =>
          prevAds.map((ad) => (ad._id === updatedAd._id ? updatedAd : ad))
        );
        setShowEditForm(false);
      }
    } catch (error) {
      console.error("Error updating advertisement:", error);
      toast.error("فشل في تحديث الإعلان. يرجى المحاولة مرة أخرى.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const dataURLtoFile = (dataUrl, filename) => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleAddClick = () => {
    if (!token) {
      toast.error("Please log in to add an advertisement.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    setShowForm(true);
  };

  const handleCancelClick = () => {
    setShowForm(false);
    setShowEditForm(false);
    setUploadedImage(null);
    setTitle("");
    setType("");
    setAdToEdit(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!token) {
      toast.error("Please log in to add an advertisement.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("type", type);
      if (uploadedImage) {
        const blob = dataURLtoBlob(uploadedImage);
        formData.append("photo", blob, "advertisement.jpg");
      }

      const response = await axios.post(
        "https://scopey.onrender.com/api/adv/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("تمت إضافة الإعلان بنجاح!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      handleCancelClick();
      fetchAds();
    } catch (error) {
      console.error("Error adding advertisement:", error);
      toast.error("Failed to add advertisement. Please try again.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const dataURLtoBlob = (dataUrl) => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const COLORS = ["#19649E", "#B2CEF2", "#4D83AE"];

  return (
    <div className="p-4 text-[#1F77BC]">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Engagement Rate Chart */}
        <Card className="rounded-2xl shadow-md p-4 bg-white">
          <h3 className="text-lg font-semibold mb-2">معدل التفاعل مع الإعلانات</h3>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#1F77BC" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Interaction Chart */}
        <Card className="rounded-2xl shadow-md p-4 bg-white">
          <h3 className="text-lg font-semibold mb-2">أكثر نوع إعلانات تفاعلاً</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={50}
                fill="#1F77BC"
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
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                layout="horizontal"
                align="center"
                verticalAlign="bottom"
                iconType="circle"
                wrapperStyle={{
                  paddingTop: "10px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Ads List Section */}
      <Card className="rounded-2xl shadow-md p-4 bg-white max-h-[600px] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">الإعلانات</h3>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Ads List */}
          <div className="flex-1 space-y-4">
            {ads.map((ad, index) => (
              <SmallCard
                key={index}
                className="rounded-2xl shadow-md p-4"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <img
                    src={ad.photo || adv}
                    alt="Ad"
                    className="rounded-xl w-full md:w-80 h-48 object-cover"
                  />
                  <div className="flex flex-col justify-between flex-1">
                    <div className="mt-4">
                      <h3 className="text-xl font-semibold">
                        العنوان: {ad.title}
                      </h3>
                      <p className="text-[17px]">النوع: {ad.type}</p>
                      <p className="text-[17px]">
                        التاريخ:{" "}
                        {new Date(ad.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {/* Buttons Section */}
                    <div className="flex gap-2 mt-2">
                      <button
                        className="bg-white w-[85px] font-medium hover:bg-[#B2CEF2] text-[#1F77BC] border-2 border-[#19649E] px-3 py-1 rounded-[20px] text-sm"
                        onClick={() => handleEditClick(ad)}
                      >
                        تعديل
                      </button>
                      <button
                        className="bg-white w-[85px] font-medium hover:bg-[#B2CEF2] text-[#1F77BC] border-2 border-[#19649E] px-3 py-1 rounded-[20px] text-sm"
                        onClick={() => confirmDelete(ad._id)}
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              </SmallCard>
            ))}
          </div>

          {/* Add Button */}
          <div className="w-full md:w-auto flex m-8 justify-center md:justify-start">
            <Button
              className="bg-[#1F77BC] text-white rounded-2xl w-24 h-60 flex items-center justify-center"
              onClick={handleAddClick}
            >
              <Plus size={32} />
            </Button>
          </div>
        </div>
      </Card>

      {/* Add Ad Form Modal */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50"
        >
          <Card className="rounded-2xl shadow-md p-8 bg-white w-[90%] max-w-[400px]">
            <h2 className="text-xl font-bold mb-4 text-[#1F77BC]">
              إضافة إعلان
            </h2>
            <div className="mb-4 overflow-hidden">
              <label className="block text-sm mb-2">تحميل صورة</label>
              <div className="bg-gray-200 h-32 flex items-center justify-center rounded-md relative">
                {uploadedImage ? (
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <Plus size={48} className="text-gray-500" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleImageChange}
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-2">عنوان الإعلان</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="عنوان الإعلان"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-2">نوع الإعلان</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="نوع الإعلان"
                value={type}
                onChange={(e) => setType(e.target.value)}
              />
            </div>
            <div className="flex justify-center gap-8">
              <button
                type="submit"
                className="bg-white w-[85px] font-medium hover:bg-[#B2CEF2] text-[#1F77BC] border-2 border-[#19649E] px-3 py-1 rounded-[20px] mr-2"
                onClick={handleSubmit}
              >
                حفظ
              </button>
              <button
                type="button"
                className="bg-white w-[85px] font-medium hover:bg-[#B2CEF2] text-[#1F77BC] border-2 border-[#19649E] px-3 py-1 rounded-[20px]"
                onClick={handleCancelClick}
              >
                الغاء
              </button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Edit Ad Form Modal */}
      {showEditForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50"
        >
          <Card className="rounded-2xl shadow-md p-8 bg-white w-[90%] max-w-[400px]">
            <h2 className="text-xl font-bold mb-4 text-[#1F77BC]">
              تعديل الإعلان
            </h2>
            <div className="mb-4 overflow-hidden">
              <label className="block text-sm mb-2">تحميل صورة</label>
              <div className="bg-gray-200 h-32 flex items-center justify-center rounded-md relative">
                {uploadedImage ? (
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <Plus size={48} className="text-gray-500" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleImageChange}
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-2">عنوان الإعلان</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="عنوان الإعلان"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-2">نوع الإعلان</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="نوع الإعلان"
                value={type}
                onChange={(e) => setType(e.target.value)}
              />
            </div>
            <div className="flex justify-center gap-8">
              <button
                type="submit"
                className="bg-white w-[85px] font-medium hover:bg-[#B2CEF2] text-[#1F77BC] border-2 border-[#19649E] px-3 py-1 rounded-[20px] mr-2"
                onClick={handleUpdate}
              >
                حفظ
              </button>
              <button
                type="button"
                className="bg-white w-[85px] font-medium hover:bg-[#B2CEF2] text-[#1F77BC] border-2 border-[#19649E] px-3 py-1 rounded-[20px]"
                onClick={handleCancelClick}
              >
                الغاء
              </button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50"
        >
          <Card className="rounded-2xl shadow-md p-8 bg-white w-[90%] max-w-[400px]">
            <h2 className="text-xl font-bold mb-4 text-[#1F77BC]">
              تأكيد الحذف
            </h2>
            <p className="text-lg mb-4">
              هل أنت متأكد أنك تريد حذف هذا الإعلان؟
            </p>
            <div className="flex justify-center gap-8">
              <button
                className="bg-white w-[85px] font-medium hover:bg-[#B2CEF2] text-[#1F77BC] border-2 border-[#19649E] px-3 py-1 rounded-[20px]"
                onClick={() => handleDelete(adToDelete)}
              >
                نعم
              </button>
              <button
                className="bg-white w-[85px] font-medium hover:bg-[#B2CEF2] text-[#1F77BC] border-2 border-[#19649E] px-3 py-1 rounded-[20px]"
                onClick={cancelDelete}
              >
                لا
              </button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default AdListComponent;