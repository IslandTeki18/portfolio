import { QueryCtx, MutationCtx } from "./_generated/server";

export async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthenticated");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_authProviderId", (q) =>
      q.eq("authProviderId", identity.subject),
    )
    .unique();

  if (!user || user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  return { identity, user };
}
