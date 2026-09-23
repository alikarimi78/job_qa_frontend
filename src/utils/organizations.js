/** Organization lookups shared by the admin pages: index a list by id, name an organization id, and turn a scope filter into query parameters. */
import { SCOPE_PUBLIC } from "@constants/organizationScope";

export const indexById = (items) => Object.fromEntries(items.map((item) => [item.id, item]));

export const organizationName = (organizationsById, id, fallbackPrefix = "سازمان") =>
  organizationsById[id]?.name ?? `${fallbackPrefix} ${id}`;

export const scopeFilterParams = (scope) => ({
  organizationId: scope && scope !== SCOPE_PUBLIC ? Number(scope) : undefined,
  publicOnly: scope === SCOPE_PUBLIC,
});
