import React from "react";
import { IoMdArrowBack } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { IoPeopleSharp } from "react-icons/io5";
import { Link } from "react-router-dom";

const Community = () => {
  return (
    <div className="w-[50%]">
      <div className="flex items-center cursor-pointer border border-b-gray-200">
        <Link to="/" className="p-2 hover:bg-gray-200 hover:rounded-full">
          <IoMdArrowBack size="24px" />
        </Link>

        <div>
          <h1 className="font-bold text-xl px-2">Communities</h1>
        </div>
        <div className="flex items-center ml-80">
          <div className="hover:rounded-full hover:bg-gray-200 p-2">
            <CiSearch size="24px" />
          </div>
          <div className="ml-4 hover:rounded-full hover:bg-gray-200 p-2">
            <IoPeopleSharp size="24px" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
