import { useState } from "react";
import Form from "../Form";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import "./dis.css";
import React from "react";
import axios from "axios";

export default function Dispenser({ click }) {
  const [days, setDays] = useState([]);
  const [times, setTimes] = useState([""]);
  const [sensitive, setIsSensitive] = useState(false);
  const [medicine_name, setMedicineName] = useState("");
  const [quantity, setMedicineQuantity] = useState("0");

  const handleAddTime = () => {
    setTimes([...times, ""]);
  };

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
      
      const token = JSON.parse(localStorage.getItem("authToken"));
      const query = token;
      // Assuming this is your UUID
      console.log(query);


      const trimmedTimes = times.map(time => time.replace(/^0+/, ''));
      // Check if `query` is a string
      const data = [
        {
            id: query,
          sensitive: sensitive,
       medicine_name: medicine_name,
       quantity: parseInt(quantity),
   days: days,  
   times: trimmedTimes.filter(time => time.trim() !== '') // Remove empty times
        },
        // Add more objects to the array if needed
      ];
      console.log("Hello",data);
      const response = await axios.post(
        `http://192.168.103.37:6175/dispenser?id=${query}`,
        data,
      );
      console.log("Inside try");
      if (response.status === 200) {
        console.log("Done");
        console.log("Data", data)
        click(data);
      }
    } catch (error) {
      console.log(error);
    }
  };


      return (
        <div className="flex flex-col justify-center w-screen" style={{marginLeft: "470px"}}>
            <div className="flex flex-col justify-center items-center w-fit">
                <div className="flex flex-col items-center mt-20">
                    <h1 className="text-4xl font-semibold">Medicine Dispenser Details</h1>
                    <p className="text-md text-gray-500 mt-6">Enter the details to get going!</p>
                </div>

                <div className="flex flex-col  space-y-4 mt-14">
                    <div className="flex flex-row justify-between">
                        <div className="flex"> 
                            <div>
                                Sensitive
                            </div>
                            <div className="ml-4">
                                <Toggle
                                    checked={sensitive}
                                    className="custom-classname"
                                    onChange={() => setIsSensitive(!sensitive)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row space-x-10">
                        <Form
                            placeholder="Enter medicine name"
                            text="Medicine Name"
                            type="text"
                            value={medicine_name}
                            onChange={setMedicineName}
                        />
                        <Form
                            placeholder="Enter quantity of medicine"
                            text="Medicine quantity"
                            type="text"
                            value={quantity}
                            onChange={setMedicineQuantity}
                        />
                    </div>

                    <div className="flex flex-row space-x-10">
                        <div className="flex flex-col space-y-4 w-80 mt-4">
                            <div>Days</div>
                            <div className="text-sm text-gray-400">Please choose days</div>
                            <div>
                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                                    <div key={index} className="flex flex-row space-x-4">
                                        <input
                                            type="checkbox"
                                            id={day}
                                            name={day}
                                            value={day}
                                            onChange={() => handleCheckboxChange(day)}
                                        />
                                        <label htmlFor={day}>{day}</label>
                                    </div>
                                ))} 
                            </div>
                        </div>

                        <div className="flex flex-col items-end min-w-80">
                            <div className="self-start mt-4">Time</div>
                            <div className="max-h-40 min-h-10 overflow-y-scroll">
                            {times.map((time, index) => (
                                <div key={index} className="flex flex-row justify-center items-center space-x-4 border-2 border-[#1C1F26] bg-black h-12 rounded-lg mt-3">
                                    <input
                                        type="time"
                                        value={time}
                                        className="bg-black outline-none ml-2 w-56"
                                        onChange={(e) => {
                                            const updatedTimes = [...times];
                                            updatedTimes[index] = e.target.value;
                                            setTimes(updatedTimes);
                                        }}
                                    />
                                    <button onClick={() => handleDeleteTime(index)} className="flex text-center items-center p-2 bg-red-600 hover:bg-red-700 h-full rounded-r-lg">Delete</button>
                                </div>
                            ))}
                            </div>
                            <button onClick={handleAddTime} className="w-24 bg-green-600 hover:bg-green-700 rounded-sm mt-6 h-8">Add Time</button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-row  mt-10">
                    <div className="flex justify-center  bg-blue-600 p-1 w-20 rounded-sm cursor-pointer hover:bg-blue-700" onClick={handleNextClick}>
                        <h1 className="text-white font-semibold">Next</h1>
                    </div>
                </div>
            </div>
        </div>
    );
}












// import React, { useState, useEffect } from "react";
// import Form from "../Form";
// import Toggle from 'react-toggle';
// import 'react-toggle/style.css';
// import "./dis.css";
// import axios from "axios";

// export default function Dispenser({ click }) {

//     const [id, setId] = useState(""); // Initialize id state

//     useEffect(() => {
//         // Get the id from localStorage when the component mounts
//         const savedId = localStorage.getItem("authToken");
//         console.log("Saved id:", savedId); // Debugging
//         if (savedId) {
//             setId(savedId);
//         }
//     }, []); // Empty dependency array ensures this effect runs only once

//     // console.log("Current id:", id); // Debugging

//     const [days, setDays] = useState([]);
//     const [times, setTimes] = useState(['']); 
//     const [sensitive, setIsSensitive] = useState(false);
    
//     const [medicine_name, setMedicineName] = useState(null); // Changed to null
//     const [quantity, setMedicineQuantity] = useState("0"); // Changed to null

//     const handleAddTime = () => {
//         setTimes([...times, '']);
//     };
  
//     const handleDeleteTime = (index) => {
//         const updatedTimes = [...times];
//         updatedTimes.splice(index, 1);
//         setTimes(updatedTimes);
//     };
  
//     const handleCheckboxChange = (day) => {
//         const index = days.indexOf(day);
//         if (index === -1) {
//             setDays([...days, day]);
//         } else {
//             const updatedDays = [...days];
//             updatedDays.splice(index, 1);
//             setDays(updatedDays);
//         }
//     };

//     const handleNextClick = async () => {
//         // Validate time format
//         const isTimeValid = times.every(time => {
//             // Regular expression for HH:MM format in 24-hour clock
//             const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
//             return timeRegex.test(time);
//         });

//         if (!isTimeValid) {
//             alert('Please enter the time in 24-hour format (HH:MM).');
//             return;
//         }

//         // Gather all the user input data
//         const userData = {
//             id: id,
//             sensitive: sensitive,
//             medicine_name: medicine_name,
//             quantity: parseInt(quantity),
//             days: days,
//             times: times.filter(time => time.trim() !== '') // Remove empty times

//         };

//         console.log(userData);
        
//         try {
//             // const response = await fetch(`http://192.168.103.37:6175/dispenser?id=${id}`, {
//             //     method: "POST",
//             //     headers: {  
//             //         "Content-Type": "application/json",
//             //     },
//             //     body: JSON.stringify(userData),
//             // });

//             // if (!response.ok) {
//             //     throw new Error("An error occurred while sending the data.");
//             // }

// const response = await axios.post(`http://192.168.103.37:6175/dispenser?id=${id}`,
//                userData
//             );
            

//             const responseData = await response;
//             console.log("API response:", responseData);
//             // Call click function or do any other necessary actions upon successful API call
//             click(userData);
//         } catch (error) {
//             console.error("Error:", error.message);
//             // Handle error
//         }
//     };

//     return (
//         <div className="flex flex-col justify-center w-screen" style={{marginLeft: "470px"}}>
//             <div className="flex flex-col justify-center items-center w-fit">
//                 <div className="flex flex-col items-center mt-20">
//                     <h1 className="text-4xl font-semibold">Medicine Dispenser Details</h1>
//                     <p className="text-md text-gray-500 mt-6">Enter the details to get going!</p>
//                 </div>

//                 <div className="flex flex-col  space-y-4 mt-14">
//                     <div className="flex flex-row justify-between">
//                         <div className="flex"> 
//                             <div>
//                                 Sensitive
//                             </div>
//                             <div className="ml-4">
//                                 <Toggle
//                                     checked={sensitive}
//                                     className="custom-classname"
//                                     onChange={() => setIsSensitive(!sensitive)}
//                                 />
//                             </div>
//                         </div>
//                     </div>

//                     <div className="flex flex-row space-x-10">
//                         <Form
//                             placeholder="Enter medicine name"
//                             text="Medicine Name"
//                             type="text"
//                             value={medicine_name}
//                             onChange={setMedicineName}
//                         />
//                         <Form
//                             placeholder="Enter quantity of medicine"
//                             text="Medicine quantity"
//                             type="text"
//                             value={quantity}
//                             onChange={setMedicineQuantity}
//                         />
//                     </div>

//                     <div className="flex flex-row space-x-10">
//                         <div className="flex flex-col space-y-4 w-80 mt-4">
//                             <div>Days</div>
//                             <div className="text-sm text-gray-400">Please choose days</div>
//                             <div>
//                                 {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
//                                     <div key={index} className="flex flex-row space-x-4">
//                                         <input
//                                             type="checkbox"
//                                             id={day}
//                                             name={day}
//                                             value={day}
//                                             onChange={() => handleCheckboxChange(day)}
//                                         />
//                                         <label htmlFor={day}>{day}</label>
//                                     </div>
//                                 ))} 
//                             </div>
//                         </div>

//                         <div className="flex flex-col items-end min-w-80">
//                             <div className="self-start mt-4">Time</div>
//                             <div className="max-h-40 min-h-10 overflow-y-scroll">
//                             {times.map((time, index) => (
//                                 <div key={index} className="flex flex-row justify-center items-center space-x-4 border-2 border-[#1C1F26] bg-black h-12 rounded-lg mt-3">
//                                     <input
//                                         type="time"
//                                         value={time}
//                                         className="bg-black outline-none ml-2 w-56"
//                                         onChange={(e) => {
//                                             const updatedTimes = [...times];
//                                             updatedTimes[index] = e.target.value;
//                                             setTimes(updatedTimes);
//                                         }}
//                                     />
//                                     <button onClick={() => handleDeleteTime(index)} className="flex text-center items-center p-2 bg-red-600 hover:bg-red-700 h-full rounded-r-lg">Delete</button>
//                                 </div>
//                             ))}
//                             </div>
//                             <button onClick={handleAddTime} className="w-24 bg-green-600 hover:bg-green-700 rounded-sm mt-6 h-8">Add Time</button>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="flex flex-row  mt-10">
//                     <div className="flex justify-center  bg-blue-600 p-1 w-20 rounded-sm cursor-pointer hover:bg-blue-700" onClick={handleNextClick}>
//                         <h1 className="text-white font-semibold">Next</h1>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
