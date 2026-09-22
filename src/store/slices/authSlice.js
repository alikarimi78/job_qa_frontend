import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  role: null,
  username: null,
  userInfo: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthToken(state, action) {
      state.token = action.payload.accessToken;
      state.role = action.payload.role;
      state.username = action.payload.username;
    },
    setUserInfo(state, action) {
      state.userInfo = action.payload;
    },
    logoutUser() {
      return initialState;
    },
  },
});

export const { setAuthToken, setUserInfo, logoutUser } = authSlice.actions;
export default authSlice.reducer;
