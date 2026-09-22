import { baseApi } from "./baseApi";

const statsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    stats: builder.query({
      query: (organizationId) => ({
        url: "/stats",
        params: organizationId ? { organization_id: organizationId } : undefined,
      }),
      providesTags: ["Stats"],
    }),
  }),
});

export const { useStatsQuery } = statsApi;
