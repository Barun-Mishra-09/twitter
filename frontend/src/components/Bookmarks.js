import React, { useState, useEffect, useCallback } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { Link } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT, TWEET_API_END_POINT } from "../utils/Constant";
import { useSelector, useDispatch } from "react-redux";
import { getRefresh } from "../redux/tweetSlice";
import { getAllTweets } from "../redux/tweetSlice";

import Tweet from "./Tweet";

const Bookmarks = () => {
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [bookmarks, setBookmarks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMyTweets = async (id) => {
    try {
      const res = await axios.get(`${TWEET_API_END_POINT}/alltweets/${id}`, {
        withCredentials: true,
      });
      // console.log(res.data.tweets);
      setBookmarks(res.data.tweets);
      // dispatch(getRefresh());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchMyTweets(user._id);
    }
  }, [user, fetchMyTweets]);

  return (
    <div className="w-[60%] mx-7 border border-b-gray-200">
      <div className="flex items-center cursor-pointer border border-gray-200">
        <Link to="/" className="p-2 hover:bg-gray-200 hover:rounded-full">
          <IoMdArrowBack size="24px" />
        </Link>
        <div>
          <h1 className="font-bold text-xl px-2">Bookmarks</h1>
        </div>
      </div>

      <div className="w-[40%] flex justify-start mt-4 ml-6">
        <div className="w-full flex items-center p-2 bg-gray-200 rounded-full hover:cursor-pointer ml-10">
          <CiSearch size="24px" />
          <input
            type="text"
            placeholder="Search Bookmarks"
            className="w-full outline-none border-none bg-transparent ml-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6 px-4">
        {bookmarks.length > 0 ? (
          bookmarks
            .filter((tweet) =>
              tweet.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((tweet) => {
              if (tweet.bookmarks == user._id) {
                return <Tweet key={tweet._id} tweet={tweet} page="bookmark" />;
              }
            })
        ) : (
          <p>No bookmarks found</p>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
