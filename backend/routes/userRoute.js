import express from "express";
import {
  follow,
  getMyProfile,
  getOtherUserProfile,
  login,
  logout,
  Register,
  unfollow,
  getAllSavedBookmarks,
} from "../controllers/userController.js";
import isAuthenticated from "../config/auth.js";

const router = express.Router();

// Q. Why post method? Ans:- register karte time hmlog data de rhe hai user ka so post method hota hai
router.route("/register").post(Register);
router.route("/login").post(login);

// since logout mai koi data dete nhi isliye hmlog get method use karenge
router.route("/logout").get(logout);

// jo bhi update ka kaam hota hai waha put function use hoga

router
  .route("/getAllSavedBookmarks/:id")
  .get(isAuthenticated, getAllSavedBookmarks);
router.route("/profile/:id").get(isAuthenticated, getMyProfile);
router.route("/otheruser/:id").get(isAuthenticated, getOtherUserProfile);
router.route("/follow/:id").post(isAuthenticated, follow);
router.route("/unfollow/:id").post(isAuthenticated, unfollow);
export default router;
