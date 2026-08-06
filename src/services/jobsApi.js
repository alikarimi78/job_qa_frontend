import { baseApi } from "./baseApi";

export const jobsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // A mutation rather than a query: the question is the input, there is nothing to
    // cache across questions, and the page fires it on submit.
    search: builder.mutation({
      query: (question) => ({ url: "/search", method: "POST", body: { question } }),
    }),
    // The answer on screen, posted back to be printed. The server does not re-run the
    // search: that would spend a second LLM call and could hand back different prose
    // from the report's own first page.
    //
    // `responseHandler` has to be spelled out because the body is a PDF, and it branches
    // on `response.ok` — a 401 or 422 still arrives through here, and reading *that* as a
    // blob would hide the `detail` string `errorMessage` prints.
    searchReport: builder.mutation({
      query: (result) => ({
        url: "/reports/search",
        method: "POST",
        body: result,
        responseHandler: (response) => (response.ok ? response.blob() : response.json()),
      }),
    }),
    suggestJob: builder.mutation({
      query: (body) => ({ url: "/jobs/suggestions", method: "POST", body }),
      invalidatesTags: ["MySuggestion", "Suggestion", "Stats"],
    }),
    mySuggestions: builder.query({
      query: () => "/jobs/suggestions/mine",
      providesTags: ["MySuggestion"],
    }),
  }),
});

export const {
  useSearchMutation,
  useSearchReportMutation,
  useSuggestJobMutation,
  useMySuggestionsQuery,
} = jobsApi;
