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
    // A reviewer correcting a record before deciding on it. The whole ten-column body
    // goes back — the same `JobIn` the suggester filled in — and the server refuses it
    // for anything already approved or rejected.
    updateSuggestion: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/admin/suggestions/${id}`, method: "PUT", body }),
      invalidatesTags: ["Suggestion", "MySuggestion"],
    }),
    // Approving starts the rebuild on the server (`app/routers/admin.py`), so `Rebuild`
    // is invalidated with the rest: the status panel picks the run up at once instead of
    // waiting out its polling interval.
    approveSuggestion: builder.mutation({
      query: (id) => ({ url: `/admin/suggestions/${id}/approve`, method: "POST" }),
      invalidatesTags: ["Suggestion", "MySuggestion", "Stats", "Rebuild"],
    }),
    rejectSuggestion: builder.mutation({
      query: (id) => ({ url: `/admin/suggestions/${id}/reject`, method: "POST" }),
      invalidatesTags: ["Suggestion", "MySuggestion", "Stats"],
    }),
    // Same as an approval from the corpus's point of view — an approved row goes in and
    // the server rebuilds — so it invalidates the same tags.
    createJob: builder.mutation({
      query: (body) => ({ url: "/admin/jobs", method: "POST", body }),
      invalidatesTags: ["Suggestion", "Stats", "Rebuild"],
    }),
    // 202: the engine is rebuilt on a daemon thread and swapped in atomically, so
    // this returns immediately and the page polls the status below.
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
  useRebuildMutation,
  useRebuildStatusQuery,
} = adminApi;
