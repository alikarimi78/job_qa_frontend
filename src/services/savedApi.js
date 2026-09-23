/** Endpoints for starred analyses: list them page by page, open one, star an answer, and remove a star. */
import { baseApi } from "./baseApi";

const savedApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    savedSearches: builder.query({
      query: ({ page, pageSize }) => ({
        url: "/saved",
        params: { page, page_size: pageSize },
      }),
      providesTags: ["Saved"],
    }),
    savedSearch: builder.query({
      query: (id) => `/saved/${id}`,
      providesTags: (result, error, id) => [{ type: "Saved", id }],
    }),
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
