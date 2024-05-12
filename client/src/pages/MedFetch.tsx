import React, { useState } from "react";
import MedicalDetails from "../components/MedicalDetails";
import MedicalFetch from "../components/MedicalFetch";

const MedicalRecord = () => {
  const [pageNo, setPageNo] = useState(1);


  const handleNextClick = () => {
    setPageNo((prevPageNo) => Math.min(prevPageNo + 1, 2));
  };

  return (
    <>
      {pageNo === 1 && <MedicalFetch click={handleNextClick} />}
 
    </>
  );
};

export default MedicalRecord;
