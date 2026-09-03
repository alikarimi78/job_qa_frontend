import { baseApi } from "./baseApi";

// Moderation is super-admin only, including for an org_admin: approving a
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
    // the server rebuilds — so it invalidates the same tags, `Job` among them: the new
    // record belongs in the corpus listing below.
    //
    // Nothing calls it any more: the «افزودن مستقیم شغل» form was taken off /admin (see
    // `pages/Admin.jsx`), since a super_admin reaches the same row by suggesting it and
    // approving it. It is kept here because this file is the API surface of
    // `src/routers/admin.py`, and the endpoint is still there.
    createJob: builder.mutation({
      query: (body) => ({ url: "/admin/jobs", method: "POST", body }),
      invalidatesTags: ["Suggestion", "Job", "Stats", "Rebuild"],
    }),
    // The corpus itself, one page at a time — 1118 approved records of ~4.5 KB each are
    // not a list to fetch whole. The search is the server's, not a filter over a page
    // that is already here: what is being looked for is usually on some other one.
    //
    // One `Job` tag rather than one per row. Which page a record sits on depends on the
    // search and on the title it is sorted by, and an edit can change the title — so
    // after any mutation the honest answer is that the whole listing may have moved.
    jobs: builder.query({
      query: ({ q = "", page = 1, pageSize = 20 } = {}) => ({
        url: "/admin/jobs",
        params: { q, page, page_size: pageSize },
      }),
      providesTags: ["Job"],
    }),
    // Editing a record that is already in the corpus — a dataset edit, not a review,
    // which is why it is not `updateSuggestion` with a different id. The server starts
    // the rebuild itself the moment the row is written (the third path that does, with
    // approving and adding directly), so `Rebuild` is invalidated here too and the
    // status badge picks the run up without waiting out its polling interval.
    updateJob: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/admin/jobs/${id}`, method: "PUT", body }),
      invalidatesTags: ["Job", "Rebuild", "Stats"],
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
  useJobsQuery,
  useUpdateJobMutation,
  useRebuildMutation,
  useRebuildStatusQuery,
} = adminApi;
