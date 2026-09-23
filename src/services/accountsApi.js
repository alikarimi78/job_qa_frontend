/** Endpoints for managing accounts (create by role, block, reset password, rename, move, delete) and organizations (list, create, edit, logo, delete). */
import { baseApi } from "./baseApi";

const accountsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    accounts: builder.query({
      query: () => "/accounts",
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
    resetPassword: builder.mutation({
      query: ({ id, password }) => ({
        url: `/accounts/${id}/password`,
        method: "POST",
        body: { password },
      }),
      invalidatesTags: ["Account"],
    }),
    renameAccount: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/accounts/${id}/name`, method: "POST", body }),
      invalidatesTags: ["Account"],
    }),
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
      invalidatesTags: ["Account", "Organization", "Stats"],
    }),

    organizations: builder.query({
      query: () => "/orgs",
      providesTags: ["Organization"],
    }),
    createOrganization: builder.mutation({
      query: (body) => ({ url: "/orgs", method: "POST", body }),
      invalidatesTags: ["Organization", "Stats"],
    }),
    updateOrganization: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/orgs/${id}`, method: "PATCH", body }),
      invalidatesTags: (result, error, { id }) => [
        "Organization",
        { type: "OrgLogo", id },
      ],
    }),
    organizationLogo: builder.query({
      query: (id) => `/orgs/${id}/logo`,
      providesTags: (result, error, id) => [{ type: "OrgLogo", id }],
    }),
    deleteOrganization: builder.mutation({
      query: (id) => ({ url: `/orgs/${id}`, method: "DELETE" }),
      invalidatesTags: ["Organization", "Account", "Stats"],
    }),
  }),
});

export const {
  useAccountsQuery,
  useCreateSuperAdminMutation,
  useCreateOrgAdminMutation,
  useCreateUserMutation,
  useBlockAccountMutation,
  useUnblockAccountMutation,
  useResetPasswordMutation,
  useRenameAccountMutation,
  useMoveAccountOrganizationMutation,
  useDeleteAccountMutation,
  useOrganizationsQuery,
  useCreateOrganizationMutation,
  useUpdateOrganizationMutation,
  useOrganizationLogoQuery,
  useDeleteOrganizationMutation,
} = accountsApi;
