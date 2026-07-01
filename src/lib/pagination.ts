export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

export function clampPagination(args: { limit?: number; offset?: number }) {
  const limitRaw = Number(args.limit ?? DEFAULT_LIMIT);
  const offsetRaw = Number(args.offset ?? 0);
  const limitSafe = Number.isFinite(limitRaw) ? Math.floor(limitRaw) : DEFAULT_LIMIT;
  const offsetSafe = Number.isFinite(offsetRaw) ? Math.floor(offsetRaw) : 0;
  const limit = Math.min(Math.max(limitSafe, 1), MAX_LIMIT);
  const offset = Math.max(offsetSafe, 0);
  return { limit, offset };
}
