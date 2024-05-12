import Brain from "../assets/buk.jpeg";
import Logo from "../assets/logom.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as solidIcons from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import PatientRecord from "./PatientRecord";
import MedicalRecord from "./MedicalRecord";
import Dispenser from "./Dispenser";
import MedicalFetch from "./MedFetch";
import React from "react";

const feedData = [
  {
    id: 0,
    name: "Dispenser",
    icon: <FontAwesomeIcon icon={solidIcons.faMedkit} />,
    component: Dispenser,
  },
  {
    id: 1,
    name: "Medical record",
    icon: <FontAwesomeIcon icon={solidIcons.faTablet} />,
    component: MedicalRecord,
  },
  {
    id: 2,
    name: "Medical View",
    icon: <FontAwesomeIcon icon={solidIcons.faStethoscope} />,
    component: MedicalFetch,
  },
];

const MainPage = () => {
  const [selected, setSelected] = useState(0);
  const select = selected > 0 ? true : false;

  const SelectedTab = feedData.find((item) => item.id === selected)?.component;

  return (
    <div className="flex flex-col h-screen fixed w-screen">

      <div className="flex mx-20 items-center justify-between p-1">

        <div className="flex items-center ml-4">
          <img src={Logo} className=" text-lg  size-10" />
          <h1 className="text-gray-400 font-bold text-lg ml-2">Medi</h1>
          <h1 className="text-[#0f766e] font-bold text-lg">Vault</h1>
        </div>
        <div className="flex items-center border bg-gray-900 border-gray-800 w-4/12 h-8 rounded-xl">
          <FontAwesomeIcon icon={solidIcons.faSearch} className="size-6 ml-2" />
          <input
            className="bg-gray-900 focus:outline-none h-6 ml-6 w-64 text-white "
            placeholder="Search medicine description"
          />      
        </div>
        <div>
          <div className="border border-gray-500 rounded-full mr-4">
            <img src={Brain} className="size-10 rounded-full" />
          </div>
        </div>
      </div>


      <div className="flex  border-t border-gray-500 h-screen">
        <div
          className={`flex flex-col border-r border-gray-700  min-w-60`}
        >
          <div className="flex flex-col ml-4 max-lg:mr-4">
            {feedData.map((items) => {
              return (
                <div
                  className={`flex flex-row items-center text-base mt-3 cursor-pointer hover:bg-gray-800 h-12 ${
                    selected === items.id
                      ? "border bg-gray-700 border-gray-800 rounded-md w-11/12"
                      : ""
                  }`}
                  key={items.id}
                  onClick={() => setSelected(items.id)}
                >
                  <div
                    className={`${
                      selected === items.id ? "text-white" : "text-gray-500"
                    } text-xl ml-4 hover:text-white max-lg:mr-4
                    }`}
                  > 
                    {items.icon}
                  </div>
                  <div
                    className={`${
                      selected === items.id ? "text-white" : "text-gray-500"
                    } text-base ml-2 hover:text-white max-lg:hidden 
                    }`}
                  >
                    {items.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div>{SelectedTab && <SelectedTab />}</div>
      </div>

    </div>
  );
};

export default MainPage;
