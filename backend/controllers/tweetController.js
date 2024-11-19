import { Tweet } from "../models/tweetSchema.js";
import { User } from "../models/userSchema.js";

export const createTweet = async (req, res) => {
  try {
    const { description, id } = req.body;
    if (!description || !id) {
      return res.status(401).json({
        message: "Fields are required",
        success: false,
      });
    }
    const user = await User.findById(id).select("-password");
    await Tweet.create({
      description,
      userId: id,
      userDetails: user,
    });

    return res.status(201).json({
      message: "Tweet Created Successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// create function for the deleteTweet
export const deleteTweet = async (req, res) => {
  try {
    const { id } = req.params;
    await Tweet.findByIdAndDelete(id);
    return res.status(201).json({
      message: "Tweet deleted Successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// create a function for likeOrDislike
export const likeOrDislike = async (req, res) => {
  try {
    const loggedInUserId = req.body.id;
    const tweetId = req.params.id;

    const tweet = await Tweet.findById(tweetId);

    // Dislike logic
    if (tweet.like.includes(loggedInUserId)) {
      // dislike
      await Tweet.findByIdAndUpdate(tweetId, {
        $pull: { like: loggedInUserId },
      });
      return res.status(201).json({
        message: "User disliked your tweet",
      });
    }
    // like
    else {
      await Tweet.findByIdAndUpdate(tweetId, {
        $push: { like: loggedInUserId },
      });
      return res.status(201).json({
        message: "User Liked your tweet",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// create a function for the bookmark
export const bookmark = async (req, res) => {
  try {
    const loggedInUserId = req.body.id;
    const tweetId = req.params.id;

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    if (tweet.bookmarks.includes(loggedInUserId)) {
      // Remove from bookmarks
      await Tweet.findByIdAndUpdate(tweetId, {
        $pull: { bookmarks: loggedInUserId },
      });
      return res.status(200).json({ message: "Removed from bookmarks" });
    } else {
      // Add to bookmarks
      await Tweet.findByIdAndUpdate(tweetId, {
        $push: { bookmarks: loggedInUserId },
      });
      return res.status(200).json({ message: "Saved to bookmarks", tweet });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

// function for getting all the tweets
// All Tweets == LoggedInUserTweet + Following user tweet
export const getAllTweets = async (req, res) => {
  try {
    const id = req.params.id;
    const loggedInUser = await User.findById(id);
    const loggedInUserTweets = await Tweet.find({ userId: id });

    // for the following User tweet
    const followingUserTweet = await Promise.all(
      loggedInUser.following.map((otherUsersId) => {
        return Tweet.find({ userId: otherUsersId });
      })
    );
    return res.status(200).json({
      tweets: loggedInUserTweets.concat(...followingUserTweet),
    });
  } catch (error) {
    console.log(error);
  }
};

export const getTweetsByIds = async (req, res) => {
  try {
    const { ids } = req.body;

    // Validate input
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        message: "Invalid or empty tweet IDs array",
        success: false,
      });
    }

    // Fetch tweets
    const tweets = await Tweet.find({ _id: { $in: ids } });

    // Return the tweets
    return res.status(200).json({
      tweets,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching tweets by IDs:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// create a function for only following tweets will show on the screen when you follow anyone
export const getFollowingTweets = async (req, res) => {
  try {
    const id = req.params.id;
    const loggedInUser = await User.findById(id);
    // following user tweet
    const followingUserTweet = await Promise.all(
      loggedInUser.following.map((otherUsersId) => {
        return Tweet.find({ userId: otherUsersId });
      })
    );
    return res.status(200).json({
      tweets: [].concat(...followingUserTweet),
    });
  } catch (error) {
    console.log(error);
  }
};
