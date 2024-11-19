import express from "express";
import dotenv from "dotenv";
import databaseConnection from "./config/database.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import tweetRoute from "./routes/tweetRoute.js";
import cors from "cors";
import path from "path";

dotenv.config({
  path: ".env",
});
// call the function of the database.js like databaseConnection
databaseConnection();
const app = express();

// use the path of the file
const _dirname = path.resolve();

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

// use the path
app.use(express.static(path.join(_dirname, "/frontend/build")));
app.get("*", (_, res) => {
  res.sendFile(path.resolve(_dirname, "frontend", "build", "index.html"));
});

app.listen(process.env.PORT, () => {
  console.log(`Server listen at port ${process.env.PORT}`);
});
