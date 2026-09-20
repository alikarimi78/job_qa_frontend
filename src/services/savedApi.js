import { baseApi } from "./baseApi";

// A reader's starred analyses. The listing carries what a row is recognised by; the answer
// itself is fetched only for the one that is opened.
export const savedApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    savedSearches: builder.query({
      query: ({ page = 1, pageSize = 20 } = {}) => ({
        url: "/saved",
        params: { page, page_size: pageSize },
      }),
      providesTags: ["Saved"],
    }),
    savedSearch: builder.query({
      query: (id) => `/saved/${id}`,
      providesTags: (result, error, id) => [{ type: "Saved", id }],
    }),
    // Starring the same question again refreshes the answer the row kept, so this is the
    // button's only call whether or not the question was starred before.
    saveSearch: builder.mutation({
      query: (body) => ({ url: "/saved", method: "POST", body }),
      invalidatesTags: ["Saved"],
    }),
    deleteSavedSearch: builder.mutation({
      query: (id) => ({ url: `/saved/${id}`, method: "DELETE" }),
      invalidatesTags: ["Saved"],
    }),
  }),
});

export const {
  useSavedSearchesQuery,
  useSavedSearchQuery,
  useSaveSearchMutation,
  useDeleteSavedSearchMutation,
} = savedApi;

export default savedApi;
