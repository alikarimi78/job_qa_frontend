import { baseApi } from "./baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    currentUser: builder.query({
      query: () => "/auth/me",
      providesTags: ["Me"],
    }),
    changeOwnPassword: builder.mutation({
      query: (body) => ({ url: "/auth/password", method: "POST", body }),
    }),
    changeOwnName: builder.mutation({
      query: (body) => ({ url: "/auth/name", method: "POST", body }),
      invalidatesTags: ["Me", "Account"],
    }),
  }),
});

export const {
  useLoginMutation,
  useCurrentUserQuery,
  useLazyCurrentUserQuery,
  useChangeOwnPasswordMutation,
  useChangeOwnNameMutation,
} = authApi;
