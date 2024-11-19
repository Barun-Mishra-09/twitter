import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { TWEET_API_END_POINT } from "../utils/Constant";
import { getRefresh } from "../redux/tweetSlice";

const PostButton = ({ description, setdesc }) => {
  const { user } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    <button
      type="button"
      onClick={submitHandler}
      className="px-4 py-3 text-lg font-bold w-full rounded-full bg-[#1D9BF0] border-none text-white"
    >
      Post
    </button>
  );
};

export default PostButton;
