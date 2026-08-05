import { baseApi } from "./baseApi";

export const jobsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // A mutation rather than a query: the question is the input, there is nothing to
    // cache across questions, and the page fires it on submit.
    search: builder.mutation({
      query: (question) => ({ url: "/search", method: "POST", body: { question } }),
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

export const { useSearchMutation, useSuggestJobMutation, useMySuggestionsQuery } = jobsApi;
