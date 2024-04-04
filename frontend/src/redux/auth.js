import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "authentication",
  initialState: {
    authScreenStatus: "SignUp",
    userInfo: null,
  },
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setAuthScreenStatus: (state, action) => {
      state.authScreenStatus = action.payload;
    },
  },
});

export const { setAuthScreenStatus, setUserInfo } = authSlice.actions;
export default authSlice.reducer;
