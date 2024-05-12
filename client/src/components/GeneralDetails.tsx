import { useState } from "react";
import Form from "./Form";
import Nav from "./Nav";
import React from "react";

const GeneralDetails = ({ click }) => {
  return (
    <div className="flex w-screen  ">

<div className="flex flex-col" style={{marginLeft: "470px"}}>

      <div className="flex flex-col items-center mt-20">
        <h1 className="text-4xl font-semibold">Patient Record Details</h1>
        <p className="text-md text-gray-500 mt-6">
          Enter the details to get going!
        </p>
      </div>
      

      
      <div className="flex flex-col space-y-4 mt-10">

        {/* Col-1 */}
        <div className="flex flex-row space-x-16">
          <Form
          placeholder="Enter your first name"
          text="First Name"
          type="text"
        />
        <Form placeholder="Enter your last name" text="Last Name" type="text" />
        </div>

        {/* Col-2 */}
        <div className="flex flex-row space-x-16">
        <Form placeholder="Gender" text="Gender" type="text" />
        <Form placeholder="Date of Birth" text="DOB" type="date" />
        </div>

        {/* Col-3 */}
        <div className="flex flex-row space-x-16">
           <Form
          placeholder="Enter nurse's first name"
          text="Nurse's First Name"
          type="text"
        />  
        <Form
         placeholder="Enter nurse's last name"
         text="Nurste's Last Name"
         type="text"
       />
        </div>
        
        {/* Col-4 */}
        <div className="flex flex-row space-x-16">
       <Form
         placeholder="Enter your phone number"
         text="Phone Number"
         type="text"
       />
        <Form
          placeholder="Enter your email address"
          text="Email"
          type="email"
        />
        </div>
       
      </div>
  

      <div className="flex justify-center items-start mt-10">
        <div
          className="flex justify-center items-center bg-blue-600 p-1 w-20 rounded-sm cursor-pointer hover:bg-blue-700"
          onClick={click}
        >
          <h1 className="text-white font-semibold">Next</h1>
        </div>
      </div>
      </div>
    </div>
  );
};

export default GeneralDetails;
