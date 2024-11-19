import express from "express";
import {
  bookmark,
  createTweet,
  deleteTweet,
  getAllTweets,
  getFollowingTweets,
  getTweetsByIds,
  likeOrDislike,
} from "../controllers/tweetController.js";
import isAuthenticated from "../config/auth.js";

const router = express.Router();

router.route("/create").post(isAuthenticated, createTweet);
router.route("/delete/:id").delete(isAuthenticated, deleteTweet);

router.route("/like/:id").put(isAuthenticated, likeOrDislike);
router.route("/bookmark/:id").put(isAuthenticated, bookmark);
router.route("/alltweets/:id").get(isAuthenticated, getAllTweets);
router.route("/getTweetsByIds").post(isAuthenticated, getTweetsByIds);

router.route("/followingtweets/:id").get(isAuthenticated, getFollowingTweets);

export default router;
