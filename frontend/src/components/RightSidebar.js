import React from "react";
import { CiSearch } from "react-icons/ci";
import Avatar from "react-avatar";
import ProfilePic from "../Images/profile_pic.jpg";
import { Link } from "react-router-dom";

const RightSidebar = ({ otherUsers }) => {
  return (
    <div className="w-[25%]">
      <div className="flex items-center p-2 bg-gray-200 rounded-full hover:cursor-pointer ">
        <CiSearch size="24px" />
        <input
          type="text"
          placeholder="Search"
          className="outline-none border-none bg-transparent ml-2 hover:cursor-pointer "
        />
      </div>

      {/* 2 div for the who to follow section */}
      <div className="p-4 bg-gray-100 rounded-2xl mt-2 mb-2">
        <h1 className="font-bold text-lg">Who to follow</h1>

        {/* use map to display multiple of users */}
        {otherUsers?.map((user) => {
          return (
            <div
              key={user?._id}
              className="flex items-center justify-between mt-2 mb-2 hover:cursor-pointer"
            >
              <div className="flex">
                <div>
                  <Avatar
                    className="mb-2 "
                    src={ProfilePic}
                    size="40"
                    round={true}
                  />
                </div>
                <div className="ml-2 ">
                  {/* leading-none == line-height == none */}
                  <h1 className="font-bold leading-none">{user?.name}</h1>
                  <p className="text-normal">{`@${user?.username}`}</p>
                </div>
              </div>
              <div className="mx-6 mt-4 mb-3">
                {/* for follow button */}
                <Link to={`/profile/${user?._id}`}>
                  <button className="px-4 py-1 bg-black font-semibold text-white  rounded-full">
                    Profile
                  </button>
                </Link>
              </div>
            </div>
          );
        })}

        {/* for multiple follow users */}
      </div>
    </div>
  );
};

export default RightSidebar;
