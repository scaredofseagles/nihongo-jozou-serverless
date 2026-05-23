import { Hono } from "hono";
import { requireApiKey } from "../middleware/auth";
import type { Context } from "hono";
import type { Bindings } from "../types";
import { cleanUpdate } from "../utils";

export const decksRoute = new Hono<{ Bindings: Bindings }>();

decksRoute.get("/all", async (c: Context) => {
	const supabase = c.get("supabase");
	const { data } = await supabase.from("Deck_Table").select(`
    id,
    name,
    Card_Table (
      id,
      front,
      back
    )
  `);
	return c.json({ message: "retrieving all decks", data }, 200);
});

decksRoute.get("/:id", async (c: Context) => {
	const id = c.req.param("id");
	const supabase = c.get("supabase");
	const { data } = await supabase
		.from("Deck_Table")
		.select(
			`
    id,
    name,
    Card_Table (
      id,
      front,
      back
    )
  `,
		)
		.eq("id", id);
	return c.json({ message: `retrieving deck ${id}`, data });
});

decksRoute.put("/:id", requireApiKey, async (c: Context) => {
	const id = c.req.param("id");
	const { name } = await c.req.json();
	const supabase = c.get("supabase");

	const updatedData = cleanUpdate({ name });

	const { data, error } = await supabase
		.from("Deck_Table")
		.update(updatedData)
		.eq("id", id)
		.select();
	if (error) return c.json({ message: "Something went wrong", error }, 500);
	return c.json({ message: `updating deck ${id}`, data }, 200);
});

decksRoute.post("/", requireApiKey, async (c: Context) => {
	const { name } = await c.req.json();
	const supabase = c.get("supabase");
	const { error } = await supabase
		.from("Deck_Table")
		.insert({ name })
		.select()
		.single();
	if (error) return c.json({ message: "Something went wrong", error }, 500);
	return c.json({ message: "adding new deck" }, 200);
});
