import React, { useState, useContext } from "react";
import axios from "axios";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { AuthContext } from "../../context/authContext";
import backgroundImage from "../../assets/images/bg.png";
import logo from "../../assets/images/logo2.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Card from "../UI/card.jsx";

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgetPasswordModal, setShowForgetPasswordModal] = useState(false);
  const [showVerifyCodeModal, setShowVerifyCodeModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isResendingCode, setIsResendingCode] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  async function submit(values) {
    setIsLoading(true);
    try {
      const res = await axios.post("https://wellbeingproject.onrender.com/api/auth/login", values);
      if (res.data.user.role === "admin") {
        toast.success("Login successful! Redirecting to the dashboard...");
        const receivedToken = res.data.token;
        const userData = res.data.user;
        login(receivedToken, userData);
        navigate("/الرئيسية");
      } else {
        toast.error("You do not have permission to access this page.");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Invalid email or password. Please try again.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const validation = yup.object().shape({
    email: yup
      .string()
      .required("Email is required")
      .email("Invalid email"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
  });

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    onSubmit: submit,
    validationSchema: validation,
  });

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

  return (
    <div className="h-screen flex flex-row-reverse bg-[#B2CEF2]">
      {/* Left Side - Background Image */}
      <div className="w-2/5 hidden md:block inset-0 object-cover">
        <img src={backgroundImage} alt="Background" className="h-full w-full" />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 mt-[-70px]">
        <div className="text-center max-w-md w-full">
          <img src={logo} alt="Logo" className="mb-8 pb-8 w-52 mx-auto" />
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border-b-2 bg-transparent text-left border-[#1F77BC] font-medium text-[#1F77BC] placeholder-[#1F77BC] focus:outline-none py-2 px-3"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-sm text-red-600 mt-2">{formik.errors.email}</div>
              )}
            </div>

            {/* Password Field */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border-b-2 bg-transparent text-left border-[#1F77BC] font-medium text-[#1F77BC] placeholder-[#1F77BC] focus:outline-none py-2 px-3"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-[#1F77BC]"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228L6.228 3m0 3.228l.778-.778M12 12l-.778-.778M18.778 18.778L12 12m6.778 6.778l3 3m-3-3l-3 3"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
              </button>
              {formik.touched.password && formik.errors.password && (
                <div className="text-sm text-red-600 mt-2">{formik.errors.password}</div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1F77BC] hover:bg-[#165c97] text-white py-2 rounded-lg"
            >
              {isLoading ? "Loading..." : "تسجيل الدخول"}
            </button>
          </form>

          {/* Forgot Password Link */}
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => setShowForgetPasswordModal(true)}
              className="text-[#1F77BC] hover:text-[#165c97] underline"
            >
              نسيت كلمة المرور؟
            </button>
          </div>
        </div>
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

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}

export default Login;