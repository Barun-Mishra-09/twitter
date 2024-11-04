import React from "react";
import Avatar from "react-avatar";
import ProfilePic from "../Images/profile_pic.jpg";
import { FaRegComment } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { CiBookmark } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { TWEET_API_END_POINT } from "../utils/Constant";
import axios from "axios";
import toast from "react-hot-toast";
import { getRefresh } from "../redux/tweetSlice";
import { timeSince } from "../utils/Constant";

const Tweet = ({ tweet }) => {
  const { user } = useSelector((store) => store.user);
  // use of the useDispatch
  const dispatch = useDispatch();

  // create a  function likeOrDislikeHandler
  const likeOrDislikeHandler = async (id) => {
    try {
      const res = await axios.put(
        `${TWEET_API_END_POINT}/like/${id}`,
        { id: user?._id },
        {
          withCredentials: true,
        }
      );
      // use of the dispatch when getRefresh()  function will be passed
      dispatch(getRefresh());

      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data.message);
      console.log(error);
    }
  };

  // create a function named deleteTweet
  const deleteTweetHandler = async (id) => {
    // withcredentials true karne ka new tarika
    try {
      const res = await axios.delete(`${TWEET_API_END_POINT}/delete/${id}`, {
        withCredentials: true,
      });

      console.log(res);

      dispatch(getRefresh());
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };
  return (
    <div>
      <div className="border-b border-gray-200 px-3 py-5">
        <div className="flex items-center ml-2 hover:cursor-pointer">
          <Avatar className="mb-14" src={ProfilePic} size="40" round={true} />
          <div className="ml-2 w-full">
            {/* for creating the username and name we use one div */}

            <div className="flex items-center ">
              <h1 className="font-bold"> {tweet?.userDetails[0]?.name}</h1>
              <p className="ml-2 ">{`@${
                tweet?.userDetails[0]?.username
              } . ${timeSince(tweet?.createdAt)}`}</p>
            </div>
            <div>
              <p>{tweet?.description}</p>
            </div>
            {/* let's create a div for the comments like and bookmarks section */}
            <div className="flex justify-between px-4 py-2">
              <div className="flex items-center">
                <div className="p-2 hover:bg-blue-200 rounded-full">
                  <FaRegComment />
                </div>
                <p>0</p>
              </div>
              <div className="flex items-center ">
                <div
                  onClick={() => likeOrDislikeHandler(tweet?._id)}
                  className="p-1 hover:bg-pink-300 rounded-full"
                >
                  <CiHeart size="24px" />
                </div>
                <p>{tweet?.like?.length}</p>
              </div>
              <div className="flex items-center">
                <div className="p-1 hover:bg-green-300 rounded-full">
                  <CiBookmark size="21px" />
                </div>
              </div>

              {/* check the condition that delete tweet will show only to the loggedIn user  */}
              {user?._id === tweet?.userId && (
                <div
                  onClick={() => deleteTweetHandler(tweet?._id)}
                  className="flex items-center"
                >
                  <div className="p-1 hover:bg-red-400 rounded-full">
                    <MdDeleteOutline size="21px" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tweet;
