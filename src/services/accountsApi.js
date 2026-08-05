import { baseApi } from "./baseApi";

// The provisioning chain, endpoint for endpoint. Every list the server returns is
// already scoped to the caller, so nothing here filters for privacy.
//
// Creating an account invalidates Organization and Unit as well as Account: the
// «ادمین ندارد» line beside each organization and unit is read off the account list,
// so it has to move the moment an admin is created.
export const accountsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    accounts: builder.query({
      query: (params) => ({ url: "/accounts", params }),
      providesTags: ["Account"],
    }),
    createSuperAdmin: builder.mutation({
      query: (body) => ({ url: "/accounts/super-admins", method: "POST", body }),
      invalidatesTags: ["Account", "Stats"],
    }),
    createOrgAdmin: builder.mutation({
      query: (body) => ({ url: "/accounts/org-admins", method: "POST", body }),
      invalidatesTags: ["Account", "Organization", "Stats"],
    }),
    createUnitAdmin: builder.mutation({
      query: (body) => ({ url: "/accounts/unit-admins", method: "POST", body }),
      invalidatesTags: ["Account", "Unit", "Stats"],
    }),
    createUser: builder.mutation({
      query: (body) => ({ url: "/accounts/users", method: "POST", body }),
      invalidatesTags: ["Account", "Stats"],
    }),
    blockAccount: builder.mutation({
      query: (id) => ({ url: `/accounts/${id}/block`, method: "POST" }),
      invalidatesTags: ["Account", "Stats"],
    }),
    unblockAccount: builder.mutation({
      query: (id) => ({ url: `/accounts/${id}/unblock`, method: "POST" }),
      invalidatesTags: ["Account", "Stats"],
    }),
    // Deliberately does not ask for the old password — it exists for the account
    // that cannot supply it.
    resetPassword: builder.mutation({
      query: ({ id, password }) => ({
        url: `/accounts/${id}/password`,
        method: "POST",
        body: { password },
      }),
      invalidatesTags: ["Account"],
    }),
    moveAccount: builder.mutation({
      query: ({ id, unitId }) => ({
        url: `/accounts/${id}/unit`,
        method: "POST",
        body: { unit_id: unitId },
      }),
      invalidatesTags: ["Account", "Unit", "Stats"],
    }),
    deleteAccount: builder.mutation({
      query: (id) => ({ url: `/accounts/${id}`, method: "DELETE" }),
      invalidatesTags: ["Account", "Organization", "Unit", "Stats"],
    }),

    // ---------- organizations ----------
    organizations: builder.query({
      query: () => "/orgs",
      providesTags: ["Organization"],
    }),
    createOrganization: builder.mutation({
      query: (name) => ({ url: "/orgs", method: "POST", body: { name } }),
      invalidatesTags: ["Organization", "Stats"],
    }),
    // Refused with a 409 naming what is still inside; there is no cascade on purpose.
    deleteOrganization: builder.mutation({
      query: (id) => ({ url: `/orgs/${id}`, method: "DELETE" }),
      invalidatesTags: ["Organization", "Unit", "Account", "Stats"],
    }),

    // ---------- units ----------
    units: builder.query({
      query: (params) => ({ url: "/units", params }),
      providesTags: ["Unit"],
    }),
    createUnit: builder.mutation({
      query: (body) => ({ url: "/units", method: "POST", body }),
      invalidatesTags: ["Unit", "Stats"],
    }),
    deleteUnit: builder.mutation({
      query: (id) => ({ url: `/units/${id}`, method: "DELETE" }),
      invalidatesTags: ["Unit", "Account", "Stats"],
    }),
  }),
});

export const {
  useAccountsQuery,
  useCreateSuperAdminMutation,
  useCreateOrgAdminMutation,
  useCreateUnitAdminMutation,
  useCreateUserMutation,
  useBlockAccountMutation,
  useUnblockAccountMutation,
  useResetPasswordMutation,
  useMoveAccountMutation,
  useDeleteAccountMutation,
  useOrganizationsQuery,
  useCreateOrganizationMutation,
  useDeleteOrganizationMutation,
  useUnitsQuery,
  useCreateUnitMutation,
  useDeleteUnitMutation,
} = accountsApi;
