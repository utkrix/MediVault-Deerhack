import React, { useState } from "react";
import Dispenser from "../components/Dispenser/DispenserDetails";
import DispenserView from "../components/Dispenser/DispenserView";
import axios from "axios";

const DispenserRecord = () => {
  const [pageNo, setPageNo] = useState(1);
  const [dispenserData, setDispenserData] = useState({
    medicineName: "", // Add medicineName
    medicineQuantity: "", // Add medicineQuantity
    isSensitive: false, // Add isSensitive
    days: [], // Add days
    times: [""], // Add times
  });

  const handleDeleteTime = (index) => {
    const updatedTimes = [...times];
    updatedTimes.splice(index, 1);
    setTimes(updatedTimes);
  };

  const handleCheckboxChange = (day) => {
    const index = days.indexOf(day);
    if (index === -1) {
      setDays([...days, day]);
    } else {
      const updatedDays = [...days];
      updatedDays.splice(index, 1);
      setDays(updatedDays);
    }
  };

  const handleNextClick = async () => {
    try {
      console.log("try");
      const token = JSON.parse(localStorage.getItem("authToken"));
      console.log(token);
      const query = token.id;
      // Assuming this is your UUID
      console.log(typeof query);
      // Check if `query` is a string
      const data = [
        {
          id: query,
          sensitive,
          medicine_name,
          days,
          times,
          quantity: parseInt(quantity),
        },
        // Add more objects to the array if needed
      ];
      console.log(data);
      const response = await axios.post(
        `http://0.0.0.0:6175/dispenser?id=${query}`,
        data
      );
      console.log("Inside try");
      if (response.status === 200) {
        console.log("Done");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {pageNo === 1 && <Dispenser click={handleNextClick} />}
      {pageNo === 2 && <DispenserView DispenserRec={dispenserData} />}
    </>
  );
};

export default DispenserRecord;
