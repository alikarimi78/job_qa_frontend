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
  tagTypes: ["Me", "Account", "Organization", "OrgLogo", "Suggestion",
             "MySuggestion", "Job", "Rebuild", "Stats"],
  endpoints: () => ({}),
});
