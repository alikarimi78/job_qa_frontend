import { baseApi } from "./baseApi";

// One request feeds the whole dashboard. The server scopes it exactly as it scopes
// `/accounts`, so nothing here filters: an org_admin's totals already stop at its own
// organization.
export const statsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    stats: builder.query({
      query: () => "/stats",
      providesTags: ["Stats"],
    }),
  }),
});

export const { useStatsQuery } = statsApi;
