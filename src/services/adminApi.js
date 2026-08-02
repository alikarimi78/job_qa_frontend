import { baseApi } from "./baseApi";

// Moderation is super-admin only, including for org and unit admins: approving a
// suggestion writes into the one global corpus every organization searches.
export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    suggestions: builder.query({
      query: (jobStatus = "pending") => ({
        url: "/admin/suggestions",
        params: { job_status: jobStatus },
      }),
      providesTags: ["Suggestion"],
    }),
    approveSuggestion: builder.mutation({
      query: (id) => ({ url: `/admin/suggestions/${id}/approve`, method: "POST" }),
      invalidatesTags: ["Suggestion", "MySuggestion"],
    }),
    rejectSuggestion: builder.mutation({
      query: (id) => ({ url: `/admin/suggestions/${id}/reject`, method: "POST" }),
      invalidatesTags: ["Suggestion", "MySuggestion"],
    }),
    createJob: builder.mutation({
      query: (body) => ({ url: "/admin/jobs", method: "POST", body }),
      invalidatesTags: ["Suggestion"],
    }),
    // 202: the engine is rebuilt on a daemon thread and swapped in atomically, so
    // this returns immediately and the page polls the status below.
    rebuild: builder.mutation({
      query: (forceEmbeddings = false) => ({
        url: "/admin/rebuild",
        method: "POST",
        params: { force_embeddings: forceEmbeddings },
      }),
      invalidatesTags: ["Rebuild"],
    }),
    rebuildStatus: builder.query({
      query: () => "/admin/rebuild/status",
      providesTags: ["Rebuild"],
    }),
  }),
});

export const {
  useSuggestionsQuery,
  useApproveSuggestionMutation,
  useRejectSuggestionMutation,
  useCreateJobMutation,
  useRebuildMutation,
  useRebuildStatusQuery,
} = adminApi;
