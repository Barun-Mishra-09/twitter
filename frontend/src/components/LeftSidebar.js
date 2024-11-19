import React from "react";
import TwitterLogo from "../Images/twitterLogo.jpeg";
import { IoHome } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import { BsFillPeopleFill } from "react-icons/bs";
import { IoBookmarkSharp } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { IoMdLogOut } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/Constant";
import toast from "react-hot-toast";
import { getMyProfile, getOtherUsers, getUser } from "../redux/userSlice";
import { TWEET_API_END_POINT } from "../utils/Constant";
import { getRefresh } from "../redux/tweetSlice";

// import PostButton from "./PostButton";

const LeftSidebar = ({ description, setdesc }) => {
  const { user } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      console.log(res);
      // set null to the user details
      dispatch(getUser(null));
      dispatch(getOtherUsers(null));
      dispatch(getMyProfile(null));
      navigate("/login");
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  const submitHandler = async () => {
    try {
      if (!user || !user._id) {
        toast.error("User not found. Please log in again.");
        return;
      }

      const res = await axios.post(
        `${TWEET_API_END_POINT}/create`,
        { description, id: user._id },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(getRefresh()); // Trigger state update after successful post
        setdesc(true); // Clear the input field
        navigate("/");
      } else {
        toast.error("Failed to post. Please try again.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
      console.error(error);
    }
  };

  return (
    <div className="w-[20%]">
      {/* 2 div for leftsidebar . One div is for the logo and other div is for the all other components like home, notification and all */}

      <div>
        <div className="px-2 hover: cursor-pointer">
          <img
            src={TwitterLogo}
            alt="twitter-clone"
            width={"50px"}
            height={"50px"}
          />
        </div>

        {/* now 2 div for the all the section like home, notification and all */}
        <div className="my-4">
          <Link
            to="/"
            className="flex items-center my-2 px-4 py-2 hover:bg-gray-200 hover:cursor-pointer rounded-full"
          >
            <div>
              <IoHome size="24px" />
            </div>
            <h1 className="px-3 font-bold text-xl">Home</h1>
          </Link>

          {/* for another feature of the leftsidebar */}
          <div className="flex items-center my-2 px-4 py-2 hover:bg-gray-200 hover:cursor-pointer rounded-full">
            <div>
              <FaSearch size="24px" />
            </div>
            <h1 className="px-3 font-semibold text-xl">Explore</h1>
          </div>
          <div className="flex items-center my-2 px-3 py-2 hover:bg-gray-200 hover:cursor-pointer rounded-full">
            <div>
              <IoMdNotifications size="24px" />
            </div>
            <h1 className="px-3 font-semibold text-xl">Notifications</h1>
          </div>
          <Link
            to="/community"
            className="flex items-center my-2 px-4 py-2 hover:bg-gray-200 hover:cursor-pointer rounded-full"
          >
            <div>
              <BsFillPeopleFill size="24px" />
            </div>
            <h1 className="px-3 font-semibold text-xl">Communities</h1>
          </Link>
          <Link
            to="/bookmark"
            className="flex items-center my-2 px-4 py-2 hover:bg-gray-200 hover:cursor-pointer rounded-full"
          >
            <div>
              <IoBookmarkSharp size="24px" />
            </div>
            <h1 className="px-3 font-semibold text-xl">Bookmarks</h1>
          </Link>

          <Link
            to={`/profile/${user?._id}`}
            className="flex items-center my-2 px-4 py-2 hover:bg-gray-200 hover:cursor-pointer rounded-full"
          >
            <div>
              <CgProfile size="24px" />
            </div>
            <h1 className="px-3 font-semibold text-xl">Profile</h1>
          </Link>
          <div
            onClick={logoutHandler}
            className="flex items-center my-2 px-4 py-2 hover:bg-gray-200 hover:cursor-pointer rounded-full"
          >
            <div>
              <IoMdLogOut size="27px" />
            </div>
            <h1 className="px-3 font-bold text-lg">Logout</h1>
          </div>

          {/* create a button for post button */}
          <Link
            to="/"
            onClick={submitHandler}
            className="px-10 py-3 w-80 text-lg font-bold rounded-full bg-[#1D9BF0] border-none text-white"
          >
            post
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
