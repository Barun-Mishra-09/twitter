import React, { useState } from "react";
import TwitterLogo from "../Images/twitterLogo.jpeg";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/Constant";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getUser } from "../redux/userSlice";

const Login = () => {
  // create a useState for login
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // use the navigate to navigate or direct to some pages
  const navigate = useNavigate();
  // use the use disPatach for the redux
  const disPatach = useDispatch();
  // create a function submitHandler to submit the form successfully
  const submitHandler = async (e) => {
    e.preventDefault();
    // console.log(name, username, email, password); // It is only used for checking that our input name, username, email and password is successfully taken or not
    if (isLogin) {
      // login
      try {
        const res = await axios.post(
          `${USER_API_END_POINT}/login`,
          {
            email,
            password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        console.log(res.data);
        // call the disPatch here from the concept of the redux
        disPatach(getUser(res?.data?.user));

        if (res.data.success) {
          // use the navigate to redirect to the page home
          navigate("/");
          toast.success(res.data.message);
        }
      } catch (error) {
        toast.error(error.response.data.message);
        console.log(error);
      }
    } else {
      // signUp
      try {
        const res = await axios.post(
          `${USER_API_END_POINT}/register`,
          {
            name,
            username,
            email,
            password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        console.log(res);
        // use of the react-hot-toast for the beautiful toastify message
        if (res.data.success) {
          setIsLogin(true);
          toast.success(res.data.message);
        }
      } catch (error) {
        toast.error(error.response.data.message);
        console.log(error);
      }
    }
  };
  // create a function loginSignUpHandler for toggle signin and signUP
  const loginSignUpHandler = () => {
    setIsLogin(!isLogin);
  };
  // hmlog ka kaam ki ye div login ko beech mai x aur y axis ke beech mai lana hai uske liye w-screen h-screen flex items-center justify-center
  return (
    <div className=" flex w-screen h-screen  items-center justify-center">
      <div className="flex items-center justify-evenly w-[80%]">
        {/* 2 div one for image and other for input field */}
        <div className="mt-12">
          <img
            className="ml-5 w-[500px] h-[330px] mt-11"
            src={TwitterLogo}
            alt="twitter-clone"
          />
        </div>

        <div>
          <div className="my-4">
            <h1 className="font-bold text-[90px]  mb-4">Happening now</h1>
            <h2 className="font-bold text-5xl  pb-[-10px]">Join today.</h2>
          </div>
          <h1 className="font-bold text-2xl mt-[1px] mb-2 ">
            {isLogin ? "Login" : "SignUp"}
          </h1>
          <form onSubmit={submitHandler} className="flex flex-col w-[40%]">
            {/* agar user login hai to sirf 2 field show karo  */}
            {!isLogin && (
              <>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  className="outline-blue-500 border border-gray-800 px-3 py-2 rounded-full my-1 font-semibold"
                />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="outline-blue-500 border border-gray-700 px-3 py-2 rounded-full my-1 font-semibold"
                />
              </>
            )}

            <input
              type="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="outline-blue-500 border border-gray-700 px-3 py-2 rounded-full my-1 font-semibold"
            />
            <input
              type="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="outline-blue-500 border border-gray-700 px-3 py-2 rounded-full my-1 font-semibold"
            />
            {/* button for login */}
            <button className="bg-[#1D9BF0] border-none py-2 my-5 rounded-full text-lg text-white">
              {isLogin ? "Login" : "Create Account"}
            </button>
            <h1>
              {isLogin ? "Do not have an account?" : "Already have an account?"}{" "}
              <span
                onClick={loginSignUpHandler}
                className="font-bold text-blue-600 cursor-pointer hover:underline"
              >
                {" "}
                {isLogin ? "Signup" : "Login"}
              </span>
            </h1>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
