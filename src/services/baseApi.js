import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logoutUser } from "@store/slices/authSlice";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "/api",
  prepareHeaders: (headers, { getState }) => {
    const { token } = getState().auth;
    if (token) headers.set("authorization", `Bearer ${token}`);
    return headers;
  },
});

// The two endpoints that check a password answer 401 when it is wrong, which is not a
// dead session: logging out there threw a signed-in user out of the app over a typo in
// the *current* password field.
const CREDENTIAL_CHECKS = ["/auth/login", "/auth/password"];

const baseQuery = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  const url = typeof args === "string" ? args : args?.url;
  const checking = CREDENTIAL_CHECKS.some((path) => url === path);
  if (result.error?.status === 401 && !checking && api.getState().auth.token) {
    api.dispatch(logoutUser());
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Me", "Account", "Organization", "OrgLogo", "Suggestion",
             "MySuggestion", "Job", "Rebuild", "Stats", "Saved"],
  endpoints: () => ({}),
});
