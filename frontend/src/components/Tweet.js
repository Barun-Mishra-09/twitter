import React, { useState, useEffect } from "react";
import Avatar from "react-avatar";
import ProfilePic from "../Images/profile_pic.jpg";
import { FaRegComment } from "react-icons/fa";
import { CiHeart, CiBookmark } from "react-icons/ci";
import { BiSolidBookmark, BiSolidHeart } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { TWEET_API_END_POINT } from "../utils/Constant";
import axios from "axios";
import toast from "react-hot-toast";
import { getRefresh } from "../redux/tweetSlice";
import { timeSince } from "../utils/Constant";

// for twitter like button and animation
import confetti from "canvas-confetti";

const Tweet = ({ tweet, page }) => {
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // for the animation of the like button
  // const [isAnimaton, setIsAnimation] = useState(false);

  useEffect(() => {
    tweet?.bookmarks?.forEach((bookmark) => {
      if (bookmark.includes(user?._id)) {
        setIsBookmarked(true);
        // console.log(bookmark + " is " + tweet?._id + " user: " + user?._id);
      }
    });
    tweet?.like?.forEach((like) => {
      if (like.includes(user?._id)) {
        setIsLiked(true);
      }
    });
  }, [tweet, user]);

  const likeOrDislikeHandler = async (id) => {
    try {
      const res = await axios.put(
        `${TWEET_API_END_POINT}/like/${id}`,
        { id: user?._id },
        { withCredentials: true }
      );
      setIsLiked((prev) => !prev);
      if (!isLiked) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#ff0000", "#f0a202", "#ff79c6", "#8be9fd", "#50fa7b"],
        });
      }

      // setIsAnimation(true);
      // setTimeout(() => setIsAnimation(false), 400);
      dispatch(getRefresh());
      toast.success(res.data.message);
    } catch (error) {
      setIsLiked((prev) => !prev); // Revert state on error
      toast.error(error.response?.data.message || "Something went wrong!");
      console.error(error);
    }
  };

  const bookmarkHandler = async (id) => {
    setIsBookmarked((prev) => !prev);
    try {
      const res = await axios.put(
        `${TWEET_API_END_POINT}/bookmark/${id}`,
        { id: user?._id },
        { withCredentials: true }
      );

      dispatch(getRefresh());
      toast.success(res.data.message);
    } catch (error) {
      setIsBookmarked((prev) => !prev); // Revert state on error
      toast.error(error.response?.data.message || "Something went wrong!");
      console.error(error);
    }
  };

  const deleteTweetHandler = async (id) => {
    try {
      const res = await axios.delete(`${TWEET_API_END_POINT}/delete/${id}`, {
        withCredentials: true,
      });
      dispatch(getRefresh());
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data.message || "Something went wrong!");
      console.error(error);
    }
  };

  return (
    <div>
      <div className="border-b border-gray-200 px-3 py-5">
        <div className="flex items-center ml-2 hover:cursor-pointer">
          <Avatar className="mb-14" src={ProfilePic} size="40" round={true} />
          <div className="ml-2 w-full">
            <div className="flex items-center">
              <h1 className="font-bold">{tweet?.userDetails[0]?.name}</h1>
              <p className="ml-2">{`@${tweet?.userDetails[0]?.username} . ${
                timeSince(tweet?.createdAt) || 0
              }`}</p>
            </div>
            <div>
              <p>{tweet?.description}</p>
            </div>
            <div className="flex justify-between px-4 py-2">
              <div className="flex items-center">
                <div className="p-2 hover:bg-blue-500 rounded-full">
                  <FaRegComment />
                </div>
                <p>0</p>
              </div>
              <style>
                {/* {`
         @keyframes bounce {
  0% {
    transform: scale(1);
  }
  30% {
    transform: scale(1.5);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.animate-bounce {
  animation: bounce 0.4s ease-out;
}

        `} */}

                {/* for speically heart animation */}
                {/* {`@keyframes heart-pop {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}

.heart-pop {
  animation: heart-pop 0.4s ease-in-out;
}
`} */}
              </style>
              <div className="flex items-center">
                <div
                  onClick={() => likeOrDislikeHandler(tweet?._id)}
                  className={`flex p-1 rounded-full ${
                    isLiked ? "heart-pop" : ""
                  }`}
                >
                  {isLiked ? (
                    <BiSolidHeart size="21px" className="text-red-500" />
                  ) : (
                    <CiHeart size="21px" className="text-black-500" />
                  )}
                  <p
                    className={`ml-1 ${
                      isLiked ? "text-red-500" : "text-black-500"
                    }`}
                  >
                    {tweet?.like?.length}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div
                  onClick={() => bookmarkHandler(tweet?._id)}
                  className="p-1 rounded-full"
                >
                  {isBookmarked ? (
                    <BiSolidBookmark size="21px" className="text-blue-500" />
                  ) : (
                    <CiBookmark size="21px" className="text-black-500" />
                  )}
                </div>
              </div>

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
