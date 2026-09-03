import { baseApi } from "./baseApi";

export const jobsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    search: builder.mutation({
      query: (question) => ({ url: "/search", method: "POST", body: { question } }),
    }),
    advancedSearch: builder.mutation({
      query: (profile) => ({ url: "/search/advanced", method: "POST", body: { profile } }),
    }),
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
  useAdvancedSearchMutation,
  useSearchReportMutation,
  useSuggestJobMutation,
  useMySuggestionsQuery,
} = jobsApi;
