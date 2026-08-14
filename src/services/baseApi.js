import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logoutUser } from "@store/slices/authSlice";

// Everything goes through /api — Vite proxies it in dev, nginx in production.
const rawBaseQuery = fetchBaseQuery({
  baseUrl: "/api",
  prepareHeaders: (headers, { getState }) => {
    const { token } = getState().auth;
    if (token) headers.set("authorization", `Bearer ${token}`);
    return headers;
  },
});

// A token lasts an hour, and `get_current_user_optional` re-checks is_active on every
// request — so an account blocked mid-session starts answering 401 immediately. Clear
// the session once, here, instead of letting every page invent its own handling; the
// router then sends the user to /login on the next render.
const baseQuery = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error?.status === 401 && api.getState().auth.token) {
    api.dispatch(logoutUser());
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery,
  // `OrgLogo` is per-id and separate from `Organization` on purpose: the image is
  // fetched by its own endpoint, so editing one organization's logo must not throw away
  // every other one's cached image.
  tagTypes: ["Me", "Account", "Organization", "OrgLogo", "Unit", "Suggestion",
             "MySuggestion", "Rebuild", "Stats"],
  endpoints: () => ({}),
});
