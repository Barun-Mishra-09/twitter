import React, { useState, useEffect } from "react";
import Avatar from "react-avatar";
import ProfilePic from "../Images/profile_pic.jpg";
import { CiImageOn } from "react-icons/ci";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { AiOutlineGif } from "react-icons/ai";
import axios from "axios";
import { TWEET_API_END_POINT } from "../utils/Constant";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getIsActive, getRefresh } from "../redux/tweetSlice";
// import PostButton from "./PostButton";

const CreatePost = () => {
  const [description, setDescription] = useState("");
  const [desc, setDesc] = useState("");

  // for taking the id
  const { user } = useSelector((store) => store.user);
  // for taking the isActive true or false from the tweetSlice
  const { isActive } = useSelector((store) => store.tweet);
  const dispatch = useDispatch();

  const submitHandler = async () => {
    try {
      if (!user || !user._id) {
        toast.error("User not found. Please log in again.");
        return;
      }
      const res = await axios.post(
        `${TWEET_API_END_POINT}/create`,
        { description, id: user?._id },
        {
          headers: {
            "Content-Type": "application/json",
          },

          withCredentials: true,
        }
      );
      dispatch(getRefresh());
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.log(error);
    }
    // last mai input field ko empty karne ke liye setDiscription ko empty string pass krna hota hai
    setDescription("");
  };

  // create a function forYouHandler for checking the tweet is on the for you side
  const forYouHandler = () => {
    // alert("For You");
    dispatch(getIsActive(true));
  };
  const followingHandler = () => {
    // alert("Following");
    dispatch(getIsActive(false));
  };

  useEffect(() => {
    if (desc) {
      setDescription(""); // Reset description
      setDesc(false); // Reset the flag
    }
  }, [desc]);

  return (
    <div className="w-[100%] flex items-center justify-between">
      <div className="w-[100%]">
        <div>
          <div className="flex items-center justify-evenly ">
            {/* 2 div one for for you and other for the following */}
            <div
              onClick={forYouHandler}
              className={`${
                isActive
                  ? "border-b-4 border-blue-600"
                  : "border-b-4 border-transparent"
              } cursor-pointer  hover:bg-gray-200 w-full text-center border-b-2 px-4 py-2`}
            >
              <h1 className="font-semibold text-lg text-gray-500 hover:font-bold hover:bg-gray-200">
                For you
              </h1>
            </div>
            <div
              onClick={followingHandler}
              className={`${
                !isActive
                  ? "border-b-4 border-blue-600"
                  : "border-b-4 border-transparent"
              } cursor-pointer  hover:bg-gray-200 w-full text-center border-b-2 px-4 py-2`}
            >
              <h1 className="font-semibold text-lg text-gray-500 hover:font-bold">
                Following
              </h1>
            </div>
          </div>

          <div className="m-4">
            <div className="flex items-center ">
              <div className="hover:cursor-pointer">
                <Avatar src={ProfilePic} size="40" round={true} />
              </div>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full outline-none border-none text-xl ml-2"
                type="text"
                placeholder="What is happening?!"
              />
            </div>
            {/* for small post img and file button and logo */}
            <div className="flex items-center justify-between m-4  border-t-2 border-b-2 border-gray-200">
              {/* Icons Wrapper */}
              <div className="flex space-x-2 p-4 ">
                {/* Image Icon */}

                <div
                  className="cursor-pointer group relative inline-block"
                  onClick={() => document.getElementById("uploadImage").click()}
                >
                  <CiImageOn size="25px" />
                  <span className=" cursor-pointer absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-blue-700 p-1 rounded text-sm text-white">
                    Media
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    id="uploadImage"
                    alt="imageUpload"
                    hidden="true"
                  />
                </div>

                {/* GIF Icon */}
                <div className="group relative inline-block cursor-pointer">
                  <AiOutlineGif size="25px" />
                  <span className=" absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-blue-700 p-1 rounded text-sm text-white">
                    GIF
                  </span>
                </div>

                {/* Emoji Icon */}
                <div className=" cursor-pointer group relative inline-block">
                  <MdOutlineEmojiEmotions size="25px" />
                  <span className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-blue-700 p-1 rounded text-sm text-white">
                    Emoji
                  </span>
                </div>
              </div>

              {/* Post Button */}
              <button
                onClick={submitHandler}
                className="bg-[#1D9BF0]  px-4 py-1 text-lg font-semibold text-white rounded-full"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
