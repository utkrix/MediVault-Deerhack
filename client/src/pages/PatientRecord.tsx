import { useState } from "react";
import GeneralDetails from "../components/GeneralDetails";
import MedicalDetails from "../components/MedicalDetails";
import Confirmation from "../components/Confirmation";
import React from "react";

const PatientRecord = () => {
  const [pageNo, setPageNo] = useState(1);

  const handleClickNext = () => {
    setPageNo(pageNo < 3 ? pageNo + 1 : 3);
    console.log(pageNo);
  };

  return (
    <>
      {pageNo === 1 && <GeneralDetails click={handleClickNext} />}
      {/* {pageNo === 2 && <MedicalDetails click={handleClickNext} />}
      {pageNo === 3 && <Confirmation click={handleClickNext} />} */}
    </>
  );
};

export default PatientRecord;
