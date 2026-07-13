import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { siteConfig } from "@/config";

export const GET: APIRoute = async () => {
	const posts = await getCollection("posts", ({ data }) => !data.draft);
	const site = siteConfig.site || "https://www.kukie.cn";

	const staticPages = ["", "friends/", "about/", "sponsors/", "changelog/1/"];
	const postPages = posts.map((post) => `posts/${post.slug}/`);

	const allPages = [...staticPages, ...postPages];

	const urls = allPages
		.map(
			(path) => `  <url>
    <loc>${site}/${path}</loc>
    <changefreq>weekly</changefreq>
    <priority>${path === "" ? "1.0" : "0.8"}</priority>
  </url>`
		)
		.join("\n");

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

	return new Response(xml, {
		headers: { "Content-Type": "application/xml; charset=utf-8" },
	});
};
