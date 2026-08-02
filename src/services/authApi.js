import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // LoginIn is a JSON body, not a form post: {username, password} -> TokenOut
    login: builder.mutation({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    // Role plus where the caller sits — a unit_admin's organization is resolved
    // through its unit here rather than stored twice.
    currentUser: builder.query({
      query: () => "/auth/me",
      providesTags: ["Me"],
    }),
  }),
});

export const { useLoginMutation, useCurrentUserQuery, useLazyCurrentUserQuery } = authApi;
