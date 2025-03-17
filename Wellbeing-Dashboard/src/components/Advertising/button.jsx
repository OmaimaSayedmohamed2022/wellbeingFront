import React from "react";

const Button = ({ children, className = "", onClick, type = "button", disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 bg-[#1F77BC] text-white rounded-2xl shadow-md hover:bg-[#19649E] transition 
                  disabled:bg-gray-400 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
