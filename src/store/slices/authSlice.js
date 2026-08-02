import { createSlice } from "@reduxjs/toolkit";

// What survives a reload. `role` arrives with the token from POST /auth/login and is
// enough to decide what to render; `userInfo` is the fuller answer from GET /auth/me
// (id, organization, unit) and is refetched rather than trusted after a rehydrate.
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
    // The role is re-read from the database on every backend request, so a token
    // minted before a change carries no stale rights — but the copy kept here is
    // what the menu renders from, and it has to follow /auth/me.
    setRoleUser(state, action) {
      state.role = action.payload;
    },
    logoutUser() {
      return initialState;
    },
  },
});

export const { setAuthToken, setUserInfo, setRoleUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
