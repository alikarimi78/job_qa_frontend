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
    // The person's name, not the credential: `username` is what you log in with and has
    // no endpoint at all. Fills in an account created before the columns existed, too.
    renameAccount: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/accounts/${id}/name`, method: "POST", body }),
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
    // The same move for an org_admin, which sits in an organization rather than in a
    // unit and has nowhere to go through the endpoint above. Invalidates Organization
    // too: the «ادمین ندارد» line beside a row is read off the account list, and this
    // moves it for two organizations at once.
    moveAccountOrganization: builder.mutation({
      query: ({ id, organizationId }) => ({
        url: `/accounts/${id}/organization`,
        method: "POST",
        body: { organization_id: organizationId },
      }),
      invalidatesTags: ["Account", "Organization", "Stats"],
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
    // An organization is a name plus the contact detail admin_panel.mp4 asks for —
    // شناسه، آدرس، شماره تماس، پست الکترونیکی and a logo. The whole form goes up as one
    // body; the server takes what it is sent and leaves the rest alone.
    createOrganization: builder.mutation({
      query: (body) => ({ url: "/orgs", method: "POST", body }),
      invalidatesTags: ["Organization", "Stats"],
    }),
    // PATCH applies only the fields present in the body, so this backs both the whole
    // edit dialog and a one-box correction. `Logo` is invalidated separately because the
    // image lives behind its own endpoint and is not in the row this returns.
    updateOrganization: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/orgs/${id}`, method: "PATCH", body }),
      invalidatesTags: (result, error, { id }) => [
        "Organization",
        { type: "OrgLogo", id },
      ],
    }),
    // The image, fetched per organization rather than carried in the list — see
    // `OrganizationOut.has_logo`. It arrives as a data URI because an `<img src>` cannot
    // send the Authorization header this endpoint needs like every other one.
    organizationLogo: builder.query({
      query: (id) => `/orgs/${id}/logo`,
      providesTags: (result, error, id) => [{ type: "OrgLogo", id }],
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
    renameUnit: builder.mutation({
      query: ({ id, name }) => ({ url: `/units/${id}`, method: "PATCH", body: { name } }),
      invalidatesTags: ["Unit"],
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
  useRenameAccountMutation,
  useMoveAccountMutation,
  useMoveAccountOrganizationMutation,
  useDeleteAccountMutation,
  useOrganizationsQuery,
  useCreateOrganizationMutation,
  useUpdateOrganizationMutation,
  useOrganizationLogoQuery,
  useDeleteOrganizationMutation,
  useUnitsQuery,
  useCreateUnitMutation,
  useRenameUnitMutation,
  useDeleteUnitMutation,
} = accountsApi;
