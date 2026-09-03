import { baseApi } from "./baseApi";

export const statsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    stats: builder.query({
      query: () => "/stats",
      providesTags: ["Stats"],
    }),
  }),
});

export const { useStatsQuery } = statsApi;
