import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("about", "routes/about.tsx"),
	route("blog", "routes/blog._index.tsx"),
	route("blog/:slug", "routes/blog.$slug.tsx"),
	route("*", "routes/$.tsx"),
] satisfies RouteConfig;
