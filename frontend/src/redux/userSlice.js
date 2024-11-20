import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: { following: [] },
    otherUsers: [],
    profile: {},
  },
  reducers: {
    // multiple actions
    getUser: (state, action) => {
      state.user = action.payload;
    },
    getOtherUsers: (state, action) => {
      state.otherUsers = action.payload;
    },
    getMyProfile: (state, action) => {
      state.profile = action.payload;
    },
    followingUpdate: (state, action) => {
      // Unfollow
      if (state.user.following.includes(action.payload)) {
        // Unfollow karo
        state.user.following = state.user.following.filter((itemId) => {
          return itemId !== action.payload;
        });
      }
      // Follow
      else {
        state.user.following.push(action.payload);
      }
    },
  },
});

// exporting the getUser and getOtherUsers from userSlice.actions
export const { getUser, getOtherUsers, getMyProfile, followingUpdate } =
  userSlice.actions;

export default userSlice.reducer;
