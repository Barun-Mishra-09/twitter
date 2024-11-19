import { User } from "../models/userSchema.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { Tweet } from "../models/tweetSchema.js";

export const Register = async (req, res) => {
  try {
    // request.body se user ke detials ko lenge
    const { name, username, email, password } = req.body;
    // basic validation
    if (!name || !username || !email || !password) {
      return res.status(401).json({
        message: "All fields are required.",
        success: false,
      });
    }
    // check karna hai ki jis user se wo create kar rha hai wo pehle se create to nhi h na
    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({
        message: "User already exist",
        success: false,
      });
    }

    // ab agar uss email id se koi user registered i.e create nhi hai to ab create karwayeng
    const hashedPassword = await bcryptjs.hash(password, 16);

    await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Account Created Successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// Now for the login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        message: "All fiels are required.",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    // ab hmlog ko password ko match karna hai jo backend mai password save ho chuka hai'
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, {
      expiresIn: "1d",
    });

    return res
      .status(201)
      .cookie("token", token, { expiresIn: "1d", httpOnly: true })
      .json({
        message: `Welcome back sir ${user.name}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

// function for the Logout
export const logout = (req, res) => {
  return res.cookie("token", "", { expiresIn: new Date(Date.now()) }).json({
    message: "User logged out Successfully,",
    success: true,
  });
};

// function for controller of the bookmarks
// export const bookmark = async (req, res) => {
//   try {
//     const loggedInUserId = req.body.id;
//     const tweetId = req.params.id;

//     const user = await User.findById(loggedInUserId);

//     if (user.bookmarks.includes(tweetId)) {
//       // save hai pehle se ab remove karn hai
//       await User.findByIdAndUpdate(loggedInUserId, {
//         $pull: { bookmarks: tweetId },
//       });
//       return res.status(200).json({
//         message: "Remove from bookmarks",
//       });
//     } else {
//       // bookmarks
//       await User.findByIdAndUpdate(loggedInUserId, {
//         $push: { bookmarks: tweetId },
//       });
//       return res.status(200).json({
//         message: "Saved to bookmarks",
//         user,
//       });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

// function for getting all saved bookmarks
export const getAllSavedBookmarks = async (req, res) => {
  try {
    const loggedInUserId = req.params.id; // Get the ID from the URL parameter

    // Find the user by their ID and populate the bookmarked tweets data
    const user = await User.findById(loggedInUserId).populate("bookmarks");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Check if the user has any bookmarks
    if (user.bookmarks.length === 0) {
      return res.status(200).json({
        message: "No bookmarks found",
        success: true,
        bookmarks: [],
      });
    }

    // Return the user's bookmarks
    return res.status(200).json({
      message: "Bookmarks retrieved successfully",
      success: true,
      bookmarks: user.bookmarks,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

// function for the getMyProfile
export const getMyProfile = async (req, res) => {
  try {
    // id and user
    const id = req.params.id;
    const user = await User.findById(id).select("-password");

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

// function for the otherProfile
export const getOtherUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    // logic for all other user but not the loggedIn user
    // {_id: {$ne:id}} == wo saare user ka id dedo jo loggedIn user na ho
    const otherUsers = await User.find({ _id: { $ne: id } }).select(
      "-password"
    );
    if (!otherUsers) {
      return res.status(401).json({
        message: "At present there is not any others user available",
      });
    }
    return res.status(200).json({
      otherUsers,
    });
  } catch (error) {
    console.log(error);
  }
};

// function for the otherUser
export const follow = async (req, res) => {
  try {
    const loggedInUserId = req.body.id; // jo logged in user hai like Barun
    const userId = req.params.id; // jisko follow karna hai like Sahil
    const loggedInUser = await User.findById(loggedInUserId); // keshav logged hai jaise barun
    const user = await User.findById(userId); // keshav otherUser hai jaise ki sahil otherUser hai

    if (!user.followers.includes(loggedInUserId)) {
      // otheruser ke followers mai loggedInuser ka id daalna hai
      await user.updateOne({ $push: { followers: loggedInUserId } });
      // loggedInUser ke following mai otherUser ka id hoga like keshav(Barun)  ke id mai keshav(sahil)
      await loggedInUser.updateOne({ $push: { following: userId } });
    } else {
      return res.status(400).json({
        message: `User already followed to ${user.name}`,
      });
    }
    // agar sab sahi raha to follow ho jayega
    return res.status(200).json({
      message: `${loggedInUser.name} follow to ${user.name}`,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// function for UNFOLLOW user
export const unfollow = async (req, res) => {
  try {
    const loggedInUserId = req.body.id;
    const userId = req.params.id;

    const loggedInUser = await User.findById(loggedInUserId);
    const user = await User.findById(userId);

    if (loggedInUser.following.includes(userId)) {
      await user.updateOne({ $pull: { followers: loggedInUserId } });
      await loggedInUser.updateOne({ $pull: { following: userId } });
    } else {
      return res.status(400).json({
        message: `User has not followed yet`,
      });
    }
    return res.status(200).json({
      message: `${loggedInUser.name} unfollow to ${user.name}`,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
