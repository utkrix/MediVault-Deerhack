import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const RegistrationPage = () => {
  const generateRandomId = () => {
    // Generate a random string of alphanumeric characters
    return Math.random().toString(36).substring(2);
  };

  const [eyeClick, setEyeClick] = useState(false);
  const [email, setEmail] = useState("");
  // const [id, setId] = useState(generateRandomId());
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [emergency_email, setEmergencyEmail] = useState("");
  const [error, setError] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isEmergencyEmailValid, setIsEmergencyEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(true);
  const [isUsernameValid, setIsUsernameValid] = useState(true);

  const handleLogin = async () => {
    
    if (email && password && phone_number && username) {
      try {
        const response = await fetch("http://192.168.103.37:6175/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, phone_number, username, emergency_email }),
        });
        const data = await response.json();
        console.log(data);
        // Reset form fields and errors
        setUsername("");
        setEmail("");
        setEmergencyEmail("");
        setPassword("");
        setPhoneNumber("");
        setError("");
        setIsEmailValid(true);
        setIsPasswordValid(true);
        setIsPhoneNumberValid(true);
      } catch (error) {
        setError("");
      }
    } else {
      setError("Please fill in all fields.");
      if (!email) setIsEmailValid(false);
      if (!password) setIsPasswordValid(false);
      if (!phone_number) setIsPhoneNumberValid(false);
    }
  };

  const handleClick = () => {
    setEyeClick((prev) => !prev);
  };

  return (
    <div className="flex flex-col w-screen h-screen justify-center items-center">
      <div className="flex flex-col text-center">
        <div>
          <h1 className="text-5xl text-center font-semibold">
            Medi-
            <span className="text-[#0f766e] font-extrabold">Vault</span>
          </h1>
        </div>
        <div className="mt-3">
          <h1 className="text-2xl font-bold">Registration Form</h1>
          <p className="text-md text-slate-400 mt-2">Please Enter your account details</p>
        </div>
      </div>

      <div>
        <div className="flex flex-col mt-10 justify-center">
          <h1 className="text-xl font-bold">User Name</h1>
          <div className={`border-2 w-96 mt-4 h-12 flex items-center justify-center rounded-lg ${!isUsernameValid && 'border-red-500 focus:border-red-500'}`}>
            <input
              placeholder="Enter your user name"
              className={`focus:outline-none w-96 ml-4 bg-black ${!isUsernameValid && 'border-red-500 focus:border-red-500'}`}
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              onFocus={() => setIsUsernameValid(true)}
              onBlur={() => setIsUsernameValid(!!username)}
            />
          </div>
        </div>

        <div className="flex flex-col mt-5 justify-center">
          <h1 className="text-xl font-bold">Email</h1>
          <div className={`border-2 w-96 mt-4 h-12 flex items-center justify-center rounded-lg ${!isEmailValid && 'border-red-500 focus:border-red-500'}`}>
            <input
              placeholder="Enter your email"
              className={`focus:outline-none w-96 ml-4 bg-black ${!isEmailValid && 'border-red-500 focus:border-red-500'}`}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              onFocus={() => setIsEmailValid(true)}
              onBlur={() => setIsEmailValid(!!email)}
            />
          </div>
        </div>

        <div className="flex flex-col mt-5 justify-center">
          <h1 className="text-xl font-bold">Emergency Email</h1>
          <div className={`border-2 w-96 mt-4 h-12 flex items-center justify-center rounded-lg ${!isEmergencyEmailValid && 'border-red-500 focus:border-red-500'}`}>
            <input
              placeholder="Enter your emergency email"
              className={`focus:outline-none w-96 ml-4 bg-black ${!isEmergencyEmailValid && 'border-red-500 focus:border-red-500'}`}
              onChange={(e) => setEmergencyEmail(e.target.value)}
              value={emergency_email}
              onFocus={() => setIsEmergencyEmailValid(true)}
              onBlur={() => setIsEmergencyEmailValid(!!emergency_email)}
            />
          </div>
        </div>

        <div className="flex flex-col mt-5 justify-center">
          <h1 className="text-xl font-bold">Phone Number</h1>
          <div className={`border-2 w-96 mt-4 h-12 flex items-center justify-center rounded-lg ${!isPhoneNumberValid && 'border-red-500 focus:border-red-500'}`}>
            <input
              placeholder="Enter your phone number"
              className={`focus:outline-none w-96 ml-4 bg-black ${!isPhoneNumberValid && 'border-red-500 focus:border-red-500'}`}
              onChange={(e) => setPhoneNumber(e.target.value)}
              value={phone_number}
              onFocus={() => setIsPhoneNumberValid(true)}
              onBlur={() => setIsPhoneNumberValid(!!phone_number)}
            />
          </div>
        </div>

        <div className="flex flex-col mt-5 justify-center">
          <h1 className="text-xl font-bold">Password</h1>
          <div className={`border-2 w-96 mt-4 h-12 flex items-center justify-center rounded-lg ${!isPasswordValid && 'border-red-500 focus:border-red-500'}`}>
            <input
              placeholder="Enter your password"
              className={`focus:outline-none w-96 ml-4 bg-black ${!isPasswordValid && 'border-red-500 focus:border-red-500'}`}
              onChange={(e) => setPassword(e.target.value)}
              type={eyeClick ? "text" : "password"}
              value={password}
              onFocus={() => setIsPasswordValid(true)}
              onBlur={() => setIsPasswordValid(!!password)}
            />
            <FontAwesomeIcon
              icon={eyeClick ? faEye : faEyeSlash}
              className="text-slate-400 mr-2 cursor-pointer"
              onClick={handleClick}
            />
          </div>
        </div>

        {error && <div className="text-red-500 mt-2">{error}</div>}

        <div className="flex justify-center mt-8 items-center">
          <div className="flex border-2 justify-center w-96 bg-emerald-900 h-14 items-center rounded-lg cursor-pointer" onClick={handleLogin}>
            <h1 className="text-slate-200 text-lg">Register</h1>
          </div>
        </div>

        <div className="flex flex-row justify-between mt-4 text-sm ">
          <div>Already Registered?</div>
          <Link to={"/login"} className="text-blue-400 hover:underline hover:underline-offset-2 cursor-pointer">Sign in now</Link>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
