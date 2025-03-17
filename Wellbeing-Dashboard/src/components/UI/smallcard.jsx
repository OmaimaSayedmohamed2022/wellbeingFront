import React from "react";

const SmallCard = ({ className, children }) => {
  return (
    <div className={`bg-[#1F77BC] text-white rounded-[20px] p-4 ${className}`}>
      {children}
    </div>
  );
};

export default SmallCard;
