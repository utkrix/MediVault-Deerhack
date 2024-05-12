import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const RegistrationPage = () => {
  const [eyeClick, setEyeClick] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);


  const navigate = useNavigate();
  
  const handleLogin = async () => {
    if (email && password ) {
     
      
      // Proceed with registration
      try {
        // Send email, password, and phone number to the API
        const response = await fetch("http://192.168.103.37:6175/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body:  JSON.stringify( {"email" : email, "password": password}),
        });
        const data =  await response.json();
        
        if (response.status == 200) {
          localStorage.setItem("authToken", JSON.stringify(data.id));
          const storedUserData = JSON.parse(localStorage.getItem("authToken"));
          console.log("local", storedUserData);
          navigate('/', { replace: true });
        } else {
          console.log("no id found");
        }
        
        console.log(data);
        // Reset form fields and errors
        setEmail("");
        setPassword("");
        setError("");
        setIsEmailValid(true);
        setIsPasswordValid(true);
      } catch (error) {
        setError("An error occurred. Please try again.");
      }
    } else {
      setError("Please fill in all fields.");
      if (!email) setIsEmailValid(false);
      if (!password) setIsPasswordValid(false);
    }
  };

  const handleClick = () => {
    setEyeClick((prev) => !prev);
  };
  return (
    <div className="flex flex-col w-screen h-screen justify-center items-center">
      {/* title */}
      <div className="flex flex-col text-center">
        <div>
          <h1 className="text-5xl text-center font-semibold">
            Medi-
            <span className="text-[#0f766e] font-extrabold">Vault</span>
          </h1>
        </div>
        <div className="mt-3">
          <h1 className="text-2xl font-bold">Ready to fire your neurons?</h1>
          <p className="text-md text-slate-400 mt-2">
            Please Enter your account details
          </p>
        </div>
      </div>

      {/* Registration Form */}
      <div>

        
        <div className="flex flex-col mt-5 justify-center">
          <h1 className="text-xl font-bold">Email</h1>
          <div className={`border-2 w-96 mt-4 h-12 flex items-center justify-center rounded-lg ${!isEmailValid && 'border-red-500 focus:border-red-500'}`}>
            <input
              type="email"
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

        {/* Error Message */}
        {error && <div className="text-red-500 mt-2">{error}</div>}

        <div className="flex justify-center mt-8 items-center">
          <div
            className="flex border-2 justify-center w-96 bg-emerald-900 h-14 items-center rounded-lg cursor-pointer"
            onClick={handleLogin}
          >
            <h1 className="text-slate-200 text-lg">Sign In</h1>
          </div>
        </div>

        <div className="flex flex-row justify-between mt-4 text-sm ">
          <div>Haven't registered yet?</div>
          <Link to={"/register"} className="text-blue-400 hover:underline hover:underline-offset-2 cursor-pointer">
            Registor now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
