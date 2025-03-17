// utils/api.js
import { toast } from 'react-toastify';
import { isTokenExpired } from './tokenUtils';

export const apiRequest = async (url, options = {}) => {
  const response = await fetch(url, options);
  if (response.status === 401) {
    const token = localStorage.getItem('token');
    if (token && isTokenExpired(token)) {
      toast.error("يرجى تسجيل الدخول مرة أخرى، فقد انتهت صلاحية جلسةك.", {
        autoClose: false,
        pauseOnHover: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false,
        progress: undefined,
        theme: "colored",
      });
      localStorage.removeItem('token'); // Clear the expired token
      window.location.href = '/login'; // Redirect to login page
    } else {
      toast.error("غير مصرح لك بالوصول إلى هذه الصفحة.");
    }
  } else if (!response.ok) {
    const data = await response.json();
    toast.error(data.message || "حدث خطأ غير متوقع.");
  }
  return response;
};