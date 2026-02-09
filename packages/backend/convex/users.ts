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

    // Debug: Log allowlist and user ID
    console.log("Environment variable ADMIN_AUTH_PROVIDER_ID:", process.env.ADMIN_AUTH_PROVIDER_ID);
    console.log("Parsed allowlist:", allowlist);
    console.log("User identity.subject:", identity.subject);
    console.log("Is user in allowlist?", allowlist.includes(identity.subject));

    if (!allowlist.includes(identity.subject)) {
      console.log("User NOT in allowlist - returning null");
      return null;
    }

    console.log("User IS in allowlist - creating admin user");

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
