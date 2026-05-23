import { Hono } from "hono";
import { getSupabase } from "./db/supabase";
import { imagesRoute } from "./routes/images";
import { decksRoute } from "./routes/decks";
import { cardsRoute } from "./routes/cards";
import type { Context, Next } from "hono";
import type { Bindings } from "./types";

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", async c => {
	const res = await fetch("https://dummyjson.com/quotes/random");
	const data = await res.json();

	const text = (data as any).quote;
	return c.text(text);
});

app.use("*", async (c: Context, next: Next) => {
	c.set("supabase", getSupabase(c.env));
	await next();
});

app.route("card", cardsRoute);

app.route("deck", decksRoute);

app.route("image", imagesRoute);

export default app;
