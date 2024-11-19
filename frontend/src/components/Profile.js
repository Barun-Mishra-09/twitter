import React from "react";
import ProfilePic from "../Images/profile_pic.jpg";
import profileBackground from "../Images/profile_background.jpg";
import Avatar from "react-avatar";
import { IoMdArrowBack } from "react-icons/io";
import { Link, useParams } from "react-router-dom";
import useGetProfile from "../hooks/useGetProfile";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/Constant";
import toast from "react-hot-toast";
import { followingUpdate } from "../redux/userSlice";
import { getRefresh } from "../redux/tweetSlice";

const Profile = () => {
  // redux se koi chij uttha ke lana hai to simply use karte hai useSelector

  const { user, profile } = useSelector((store) => store.user);
  const { id } = useParams();
  useGetProfile(id);
  const dispatch = useDispatch();

  // create a function followAndUnfollowHandler for showing following and unfollow Api
  const followAndUnfollowHandler = async () => {
    // for the "Unfollow"
    if (user.following.includes(id)) {
      try {
        const res = await axios.post(
          `${USER_API_END_POINT}/unfollow/${id}`,
          {
            id: user?._id,
          },
          {
            withCredentials: true,
          }
        );
        console.log(res);
        dispatch(followingUpdate(id));
        // use disPatch for the getRefresh
        dispatch(getRefresh());
        toast.success(res.data.message);
      } catch (error) {
        toast.error(error.response.data.message);
        console.log(error);
      }
    } else {
      // Follow
      try {
        const res = await axios.post(
          `${USER_API_END_POINT}/follow/${id}`,
          {
            id: user?._id,
          },
          {
            withCredentials: true,
          }
        );
        console.log(res);
        // use the dispatch of the userSlice state like followingUpdate
        dispatch(followingUpdate(id));
        dispatch(getRefresh());
        toast.success(res.data.message);
      } catch (error) {
        toast.error(error.response.data.message);
        console.log(error);
      }
    }
  };

  return (
    <div className="w-[50%]">
      <div>
        <div className="flex items-center">
          <Link
            to="/"
            className="p-2 rounded-full hover:bg-gray-100 hover:cursor-pointer"
          >
            <IoMdArrowBack size="24px" />
          </Link>
          <div className="cursor-pointer px-2">
            <h1 className="font-bold text-lg ">
              {profile?.name || "Loading..."}
            </h1>
            <p className="text-sm text-gray-600">9 post</p>
          </div>
        </div>
        <div>
          <img
            src={profileBackground}
            alt="backgroundProfile"
            className="w-[598px] h-[198px] object-cover my-2"
          />
          {/* another div for the avatar */}
          <div className="absolute top-48 ml-2 border-4 border-black rounded-full">
            <Avatar src={ProfilePic} size="140" round={true} />
          </div>

          <div className="text-right m-4">
            {/* Let's write logic for follow button and edit profile */}
            {profile?._id === user?._id ? (
              <button className="px-4 py-1 text-lg border border-gray-400 rounded-full hover:bg-gray-300">
                Edit Profile
              </button>
            ) : (
              <button
                onClick={followAndUnfollowHandler}
                className="px-4 py-1 text-lg bg-black text-white rounded-full "
              >
                {user.following.includes(id) ? "Following" : "follow"}
              </button>
            )}
          </div>
          {/* for name and usename */}
          <div className="m-4 py-5 px-6">
            <h1 className="font-bold text-xl leading-none">
              {profile?.name || "User"}
            </h1>
            <p>{`@${profile?.username || "username"}`}</p>
          </div>
          {/* for bio  */}
          <div className="ml-9 text-sm leading-none">
            <p>
              I am a full Stack Developer👨🏼‍💻| Problem solver by day 🌅and coder
              by night🌃 I love to build new and unique things about web🌏
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
