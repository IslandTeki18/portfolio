/**
 * Static site copy that is not stored in Convex.
 * Edit here; every page reads from this object.
 */
export const SITE = {
  name: "Landon McKell",
  availability: "Available for contract work",
  hero: {
    title: "Full stack apps for web, mobile and desktop.",
    lede: "I'm a full stack web and mobile developer. I build scheduling, dispatch and billing tools for trades and service businesses, from the database up to the app your crew uses in the truck.",
    stats: ["6 years shipping production apps", "React · React Native · Node", "Based in Utah, working remote"],
  },
  contact: {
    title: "Tell me what's slowing the work down.",
    lede: "A short description of the problem is enough to start. I'll reply within two business days, and the first call is a conversation, not a pitch.",
    email: "landon.roney7923@gmail.com",
    location: "Spanish Fork, UT · MT",
  },
  links: {
    github: "https://github.com/IslandTeki18",
    linkedin: "https://www.linkedin.com/",
  },
} as const;
