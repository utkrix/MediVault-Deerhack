
import React, { useState } from "react";
import Form from "./Form";
import hashValue from "../../utils/hash";

const MedicalDetails = ({ click }) => {
  const [medicalReport, setMedicalReport] = useState({
    patient_id: "random",
    doctor: "",
    treatment: "",
    timestamp: 12224,
    diagnosis: "",
    image_cid: "sannux",
    nmc_number: 1,
  });

  const [file, setFile] = useState(null);

  const handleInputChange = (field, value) => {
    //const token = JSON.parse(localStorage.getItem("authToken"));
    //const query = token.id;
    setMedicalReport({
      ...medicalReport,
      [field]: value,
      // patient_id: query,
    });
    console.log(medicalReport);
  };

  const token = JSON.parse(localStorage.getItem("authToken"));
      const query = token;
      // Assuming this is your UUID
      

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const   handleNextClick = () => {
    // Convert timestamp to Unix time
    const timestampUnix = new Date(medicalReport.timestamp).getTime();
    const tempCid = "https//:hello:" + medicalReport.image_cid;

    console.log("medicalReport ", medicalReport);

    // Update medicalReport with Unix timestamp
    const updatedReport = {
      ...medicalReport,
      timestamp: timestampUnix,
      image_cid: tempCid, 
      patient_id: hashValue(query),
      nmc_number: 1234
    };

    console.log(updatedReport)
    // Pass medical report data to the parent component
    //  click(updatedReport);

    // Convert updated medicalReport object to JSON string
    const jsonData = JSON.stringify(updatedReport);

    const formData = new FormData();
    formData.append("jsonData", jsonData);
    formData.append("imageFile", file);

    fetch("http://192.168.103.55:1582/api/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="flex justify-center">
      <div style={{ marginLeft: "470px" }}>
        <div className="flex flex-col items-center mt-20">
          <h1 className="text-4xl font-semibold ">Medical Report Details</h1>
          <p className="text-md text-gray-500 mt-6">
            Enter the details to get going!
          </p>
        </div>

        <div className="flex flex-col space-y-4 mt-10">
          <div className="flex flex-row space-x-16">
            <Form
              placeholder="Enter Doctor Name"
              text="Doctor Name"
              type="text"
              value={medicalReport.doctor}
              onChange={(value) => handleInputChange("doctor", value)}
            />
            <div className="mt-16">
              <input
                type="file"
                className="bg-black outline-none"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="flex flex-row space-x-16">
            <Form
              placeholder="Prescribed Treatment"
              text="Treatment"
              type="text"
              value={medicalReport.treatment}
              onChange={(value) => handleInputChange("treatment", value)}
            />
            <Form
              placeholder="Timestamp"
              text="Timestamp"
              type="date"
              value={medicalReport.timestamp}
              onChange={(value) => handleInputChange("timestamp", value)}
            />
          </div>

          <div className="flex flex-row space-x-16">
            <Form
              placeholder="Enter the diagnosis"
              text="Diagnosis"
              type="text"
              value={medicalReport.diagnosis}
              onChange={(value) => handleInputChange("diagnosis", value)}
            />
            <Form
              placeholder="Enter NMC number"
              text="nmc_number"
              type="number"
              value={medicalReport.nmc_number}
              onChange={(value) => handleInputChange("nmc_number", parseInt(value))}
            />
          </div>
        </div>

        <div className="flex flex-row justify-center items-start mt-10">
          <div
            className="flex justify-center items-center bg-green-600 p-1 w-20 rounded-sm cursor-pointer hover:bg-green-700"
            onClick={handleNextClick}
          >
            <h1 className="text-white font-semibold">Submit</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalDetails;
