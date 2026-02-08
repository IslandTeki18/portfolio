import { query, mutation } from "./_generated/server";

export const upsertMe = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const existing = await ctx.db
      .query("users")
      .withIndex("by_authProviderId", (q) =>
        q.eq("authProviderId", identity.subject),
      )
      .unique();

    if (existing) {
      return existing._id;
    }

    const allowlist = (process.env.ADMIN_AUTH_PROVIDER_ID ?? "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    if (!allowlist.includes(identity.subject)) {
      return null;
    }

    return await ctx.db.insert("users", {
      authProviderId: identity.subject,
      role: "admin",
      createdAt: Date.now(),
    });
  },
});

export const getMyRole = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_authProviderId", (q) =>
        q.eq("authProviderId", identity.subject),
      )
      .unique();

    return user?.role ?? null;
  },
});
