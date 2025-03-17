import React from "react";

const Card = ({ className, children }) => {
  return (
    <div
      className={`bg-white rounded-[20px] shadow-md p-4 max-h-auto ${className}`}
    >
      {/* Inner scrollable container */}
      <div className=" overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200 max-h-full md:scrollbar-thin md:scrollbar-thumb-blue-500 md:scrollbar-track-gray-200">
        {children}
      </div>
    </div>
  );
};

export default Card;