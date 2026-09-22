import { baseApi } from "./baseApi";

const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    suggestions: builder.query({
      query: ({ organizationId, publicOnly }) => ({
        url: "/admin/suggestions",
        params: {
          job_status: "pending",
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
    jobs: builder.query({
      query: ({ q, page, pageSize, organizationId, publicOnly }) => ({
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
    deleteJob: builder.mutation({
      query: (id) => ({ url: `/admin/jobs/${id}`, method: "DELETE" }),
      invalidatesTags: ["Job", "Rebuild", "Stats"],
    }),
    rebuild: builder.mutation({
      query: () => ({ url: "/admin/rebuild", method: "POST" }),
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
  useJobsQuery,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useRebuildMutation,
  useRebuildStatusQuery,
} = adminApi;
