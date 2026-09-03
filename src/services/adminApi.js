import { baseApi } from "./baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    suggestions: builder.query({
      query: (jobStatus = "pending") => ({
        url: "/admin/suggestions",
        params: { job_status: jobStatus },
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
      query: ({ q = "", page = 1, pageSize = 20 } = {}) => ({
        url: "/admin/jobs",
        params: { q, page, page_size: pageSize },
      }),
      providesTags: ["Job"],
    }),
    updateJob: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/admin/jobs/${id}`, method: "PUT", body }),
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
  useRebuildMutation,
  useRebuildStatusQuery,
} = adminApi;
