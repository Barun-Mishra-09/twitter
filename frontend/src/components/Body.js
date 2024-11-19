import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import Feed from "./Feed";
import Profile from "./Profile";
import Community from "./Community";
import Bookmarks from "./Bookmarks";

const Body = () => {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      //   ab jo click ho wahi change hoga jaise ki agar /profile mai click kiya hai to profile hi change hoga leftsidebar and rightsidebar change nhi hoga

      children: [
        {
          path: "",
          element: <Feed />,
        },
        {
          path: "/profile/:id",
          element: <Profile />,
        },
        {
          path: "/community",
          element: <Community />,
        },
        {
          path: "/bookmark",
          element: <Bookmarks />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);

  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
};

export default Body;
