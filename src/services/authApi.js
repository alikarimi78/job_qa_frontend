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
    // The caller's own password, and the only endpoint that acts on the caller's own
    // account. `/accounts/{id}/password` refuses one's own row, which leaves a
    // super_admin — who has nobody above them — with no way to change their password at
    // all. The current one is required here and stands in for the authority an admin
    // resetting somebody else's would have; nothing cached changes, so no tag moves.
    changeOwnPassword: builder.mutation({
      query: (body) => ({ url: "/auth/password", method: "POST", body }),
    }),
    // The caller's own name. No password asked for, unlike the endpoint above — a name
    // is not a credential — and it exists for the same reason: an admin can fix the name
    // on any account below them, and the seeded first super_admin has nobody above them
    // and no name at all. Invalidates `Me`, since the header reads it.
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
