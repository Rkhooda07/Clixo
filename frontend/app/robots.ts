import type { MetadataRoute } from "next";

// Private, wallet-gated routes have nothing to index and would surface as
// empty auth prompts in search results.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/create-task"],
    },
  };
}
