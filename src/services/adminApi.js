import { baseApi } from "./baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    suggestions: builder.query({
      // organizationId names one organization, publicOnly the records that belong to
      // none; neither is sent unless it was asked for, and an org_admin is scoped by
      // the server whatever they send.
      query: ({ jobStatus = "pending", organizationId, publicOnly } = {}) => ({
        url: "/admin/suggestions",
        params: {
          job_status: jobStatus,
          organization_id: organizationId || undefined,
          public: publicOnly || undefined,
        },
      }),
      providesTags: ["Suggestion"],
    }),
    updateSuggestion: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/admin/suggestions/${id}`, method: "PUT", body }),
      invalidatesTags: ["Suggestion", "MySuggestion"],
    }),
    approveSuggestion: builder.mutation({
      query: (id) => ({ url: `/admin/suggestions/${id}/approve`, method: "POST" }),
      invalidatesTags: ["Suggestion", "MySuggestion", "Stats", "Rebuild"],
    }),
    rejectSuggestion: builder.mutation({
      query: (id) => ({ url: `/admin/suggestions/${id}/reject`, method: "POST" }),
      invalidatesTags: ["Suggestion", "MySuggestion", "Stats"],
    }),
    createJob: builder.mutation({
      query: (body) => ({ url: "/admin/jobs", method: "POST", body }),
      invalidatesTags: ["Suggestion", "Job", "Stats", "Rebuild"],
    }),
    jobs: builder.query({
      query: ({ q = "", page = 1, pageSize = 20, organizationId, publicOnly } = {}) => ({
        url: "/admin/jobs",
        params: {
          q,
          page,
          page_size: pageSize,
          organization_id: organizationId || undefined,
          public: publicOnly || undefined,
        },
      }),
      providesTags: ["Job"],
    }),
    updateJob: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/admin/jobs/${id}`, method: "PUT", body }),
      invalidatesTags: ["Job", "Rebuild", "Stats"],
    }),
    // Deleting starts the same rebuild an edit does, so the status badge is refetched too.
    deleteJob: builder.mutation({
      query: (id) => ({ url: `/admin/jobs/${id}`, method: "DELETE" }),
      invalidatesTags: ["Job", "Rebuild", "Stats"],
    }),
    rebuild: builder.mutation({
      query: (forceEmbeddings = false) => ({
        url: "/admin/rebuild",
        method: "POST",
        params: { force_embeddings: forceEmbeddings },
      }),
      invalidatesTags: ["Rebuild", "Stats"],
    }),
    rebuildStatus: builder.query({
      query: () => "/admin/rebuild/status",
      providesTags: ["Rebuild"],
    }),
  }),
});

export const {
  useSuggestionsQuery,
  useUpdateSuggestionMutation,
  useApproveSuggestionMutation,
  useRejectSuggestionMutation,
  useCreateJobMutation,
  useJobsQuery,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useRebuildMutation,
  useRebuildStatusQuery,
} = adminApi;
