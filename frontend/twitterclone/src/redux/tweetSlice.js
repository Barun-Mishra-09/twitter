import { createSlice } from "@reduxjs/toolkit";

const tweetSlice = createSlice({
  name: "tweet",
  initialState: {
    tweets: [],
    refresh: false,
    isActive: true,
  },
  reducers: {
    getAllTweets: (state, action) => {
      state.tweets = action.payload;
    },
    // refresh ke liye bas toggle hi karna hai so yaha action ka need nhi hoga
    getRefresh: (state) => {
      console.log("getRefresh dispatched");
      state.refresh = !state.refresh;
    },
    getIsActive: (state, action) => {
      state.isActive = action.payload;
    },
  },
});
export const { getAllTweets, getRefresh, getIsActive } = tweetSlice.actions;
export default tweetSlice.reducer;
