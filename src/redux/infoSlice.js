import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userinfo: {},
};

const infoSlice = createSlice({
  name: "public",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userinfo = action.payload;
    },
  },
});

export const { setUser } = infoSlice.actions;

export default infoSlice.reducer;
