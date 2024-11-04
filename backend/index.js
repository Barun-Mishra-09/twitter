import express from "express";
import dotenv from "dotenv";
import databaseConnection from "./config/database.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import tweetRoute from "./routes/tweetRoute.js";
import cors from "cors";

dotenv.config({
  path: ".env",
});
// call the function of the database.js like databaseConnection
databaseConnection();
const app = express();

// middlewares using :- This is basic middleware in which it is required for every backend
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// using the cors so that cors-policy http error can resolve
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
// now use the corsOptions and pass it as the argument
app.use(cors(corsOptions));
// api create
app.use("/api/v1/user", userRoute);
app.use("/api/v1/tweet", tweetRoute);
app.listen(process.env.PORT, () => {
  console.log(`Server listen at port ${process.env.PORT}`);
});
