import React, { useState } from "react";
import MedicalDetails from "../components/MedicalDetails";
import MedicalView from "../components/MedicalView";

const MedicalRecord = () => {
  const [pageNo, setPageNo] = useState(1);
  const [medicalReport, setMedicalReport] = useState({
    patient_id: "random",
    doctor: "",
    treatment: "",
    timestamp: "",
    diagnosis: "",
    image_cid: "sannux"
  });

  const handleNextClick = (report) => {
    setMedicalReport(report);
    setPageNo((prevPageNo) => Math.min(prevPageNo + 1, 2));
  };

  return (
    <>
      {pageNo === 1 && <MedicalDetails click={handleNextClick} />}
      {/* {pageNo === 2 && <MedicalView medicalReport={medicalReport} />} */}
    </>
  );
};

export default MedicalRecord;
