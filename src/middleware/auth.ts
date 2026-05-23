import type { Context, Next } from "hono";

export const requireApiKey = async (c: Context, next: Next) => {
	const apiKey = c.req.header("x-api-key");

	if (!apiKey || apiKey !== c.env.API_KEY) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	await next();
};
