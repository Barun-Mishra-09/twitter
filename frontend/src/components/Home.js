import React, { useEffect } from "react";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useOtherUsers from "../hooks/useOtherUsers";
import useGetMyTweets from "../hooks/useGetMyTweets";

const Home = () => {
  // create our custom hooks
  const { user, otherUsers } = useSelector((store) => store.user);

  const navigate = useNavigate();
  // check for the condition is the user is not found then navigate to the login page
  useEffect(() => {
    console.log("User state:", user);
    if (!user?._id) {
      navigate("/login");
    }
  }, [user, navigate]);

  // // custom hooks
  useOtherUsers(user?._id);
  useGetMyTweets(user?._id);

  return (
    <div className="flex justify-between w-[80%] mx-auto ">
      <LeftSidebar />
      {/* use outlet for  rendering the children conditionally i.e children ko condition ke basis pe apply karta hai*/}
      <Outlet />
      {/* pass the otherUsers as the props  */}

      <RightSidebar otherUsers={otherUsers} />
    </div>
  );
};

export default Home;
