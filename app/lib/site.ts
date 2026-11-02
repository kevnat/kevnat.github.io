// Production builds show the "coming soon" page by default; `next dev` shows
// the full site. To publish the real site, set NEXT_PUBLIC_COMING_SOON=false
// in the deploy workflow's build step (or "true" to preview the holding page locally).
const flag = process.env.NEXT_PUBLIC_COMING_SOON;

export const comingSoon = flag
  ? flag === "true"
  : process.env.NODE_ENV === "production";
