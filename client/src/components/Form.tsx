import React from "react";

const Form = ({ placeholder, text, type, value, onChange }) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="self-start mt-4">{text}</h1>
      <div className="flex border-2 border-[#1C1F26] w-80 w-min-auto bg-black h-12 rounded-lg mt-3">
        <input
          required
          placeholder={placeholder}
          className="bg-black outline-none ml-2 w-80 text-white"
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Form;
