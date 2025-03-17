import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function TreatmentProgramForm({ onClose }) {
    const [formData, setFormData] = useState({
        name: "",
        importance: "",
        treatmentPlan: "",
        goals: "",
        stages: "",
        techniques: "",
        sessions: "",
        skillTraining: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form Submitted:", formData);

        // Prepare the data for the API
        const payload = {
            name: formData.name,
            importance: formData.importance,
            treatmentPlan: formData.treatmentPlan,
            goals: formData.goals,
            stages: formData.stages.split(",").map((stage) => stage.trim()), // Convert stages to an array
            techniques: formData.techniques.split(",").map((technique) => technique.trim()), // Convert techniques to an array
            skillTraining: formData.skillTraining.split(",").map((skill) => skill.trim()), // Convert skillTraining to an array
            sessions: formData.sessions,
        };

        try {
            const response = await fetch("https://wellbeingproject.onrender.com/api/treatment/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Treatment program added successfully:", result);

                // Show success notification
                toast.success("تم إضافة البرنامج العلاجي بنجاح!", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });

                // Delay closing the form until the toast is displayed
                setTimeout(() => {
                    onClose();
                }, 1000); // Delay for 1 second (adjust as needed)
            } else {
                console.error("Failed to add treatment program:", response.statusText);

                // Show error notification
                toast.error("فشل إضافة البرنامج العلاجي. يرجى المحاولة مرة أخرى.", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        } catch (error) {
            console.error("Error:", error);

            // Show error notification
            toast.error("حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="font-semibold text-[#1F77BC] rounded-lg w-full max-w-2xl mx-auto p-4">
                <h3 className="text-center mb-6 text-xl">إضافة برنامج علاجي</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="mb-4">
                        <label htmlFor="name" className="block mb-2">اسم البرنامج:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="اسم البرنامج"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-[15px] bg-[#D9D9D9]"
                            required
                        />
                    </div>

                    {/* Stages */}
                    <div className="mb-4">
                        <label htmlFor="stages" className="block mb-2">المراحل:</label>
                        <textarea
                            type="text"
                            id="stages"
                            name="stages"
                            placeholder="أدخل المراحل مفصولة بفاصلة (،)"
                            value={formData.stages}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-[15px] bg-[#D9D9D9]"
                            required
                        />
                    </div>

                    {/* Importance */}
                    <div className="mb-4">
                        <label htmlFor="importance" className="block mb-2">أهمية البرنامج:</label>
                        <textarea
                            id="importance"
                            name="importance"
                            placeholder="أهمية البرنامج"
                            value={formData.importance}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-[15px] bg-[#D9D9D9]"
                            rows="3"
                            required
                        />
                    </div>

                    {/* Techniques */}
                    <div className="mb-4">
                        <label htmlFor="techniques" className="block mb-2">التقنيات:</label>
                        <textarea
                            type="text"
                            id="techniques"
                            name="techniques"
                            placeholder="أدخل التقنيات مفصولة بفاصلة (،)"
                            value={formData.techniques}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-[15px] bg-[#D9D9D9]"
                            required
                        />
                    </div>

                    {/* Treatment Plan */}
                    <div className="mb-4">
                        <label htmlFor="treatmentPlan" className="block mb-2">الخطة/ العلاج:</label>
                        <textarea
                            id="treatmentPlan"
                            name="treatmentPlan"
                            placeholder="خطة العلاج"
                            value={formData.treatmentPlan}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-[15px] bg-[#D9D9D9]"
                            rows="3"
                            required
                        />
                    </div>

                    {/* Sessions */}
                    <div className="mb-4">
                        <label htmlFor="sessions" className="block mb-2">الجلسات:</label>
                        <textarea
                            type="text"
                            id="sessions"
                            name="sessions"
                            placeholder="عدد الجلسات"
                            value={formData.sessions}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-[15px] bg-[#D9D9D9]"
                            required
                        />
                    </div>

                    {/* Goals */}
                    <div className="mb-4">
                        <label htmlFor="goals" className="block mb-2">الأهداف:</label>
                        <textarea
                            id="goals"
                            name="goals"
                            placeholder="الأهداف"
                            value={formData.goals}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-[15px] bg-[#D9D9D9]"
                            rows="3"
                            required
                        />
                    </div>

                    {/* Skill Training */}
                    <div className="mb-4">
                        <label htmlFor="skillTraining" className="block mb-2">تدريب على مهارات:</label>
                        <textarea
                            type="text"
                            id="skillTraining"
                            name="skillTraining"
                            placeholder="أدخل المهارات مفصولة بفاصلة (،)"
                            value={formData.skillTraining}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-[15px] bg-[#D9D9D9]"
                            required
                        />
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-center gap-8 mt-6">
                    <button
                        type="submit"
                        className="bg-white w-[85px] font-medium hover:bg-[#B2CEF2] text-[#1F77BC] border-2 border-[#19649E] px-3 py-1 rounded-[20px]"
                    >
                        حفظ
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-white w-[85px] font-medium hover:bg-[#B2CEF2] text-[#1F77BC] border-2 border-[#19649E] px-3 py-1 rounded-[20px]"
                    >
                        الغاء
                    </button>
                </div>
            </form>

            {/* Toast Container for Notifications */}
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={true} // Enable right-to-left layout for Arabic
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </>
    );
}

export default TreatmentProgramForm;