import { Hono } from "hono";
import { requireApiKey } from "../middleware/auth";
import { cleanUpdate } from "../utils";
import type { Context } from "hono";
import type { Bindings } from "../types";

export const cardsRoute = new Hono<{ Bindings: Bindings }>();

cardsRoute.get("/all", async (c: Context) => {
	const supabase = c.get("supabase");
	const { data: cards, error } = await supabase.from("Card_Table").select();
	if (error) return c.json({ message: "Something went wrong", error }, 500);
	return c.json({ message: "retrieving all cards", data: cards }, 200);
});

cardsRoute.get("/:id", async (c: Context) => {
	const id = c.req.param("id");
	const supabase = c.get("supabase");
	const { data: cards, error } = await supabase
		.from("Card_Table")
		.select()
		.eq("id", id);
	if (error) return c.json({ message: "Something went wrong", error }, 500);

	return c.json({ message: `retrieving card ${id}`, data: cards });
});

cardsRoute.put("/:id", requireApiKey, async (c: Context) => {
	const id = c.req.param("id");
	const { front, back, deck_id } = await c.req.json();
	const supabase = c.get("supabase");

	const updatedData = cleanUpdate({ front, back, deck_id });

	const { data: cards, error } = await supabase
		.from("Card_Table")
		.update(updatedData)
		.eq("id", id)
		.select();
	if (error) return c.json({ message: "Something went wrong", error }, 500);

	return c.json({ message: `retrieving card ${id}`, data: cards });
});

cardsRoute.post("/", requireApiKey, async (c: Context) => {
	const { front, back, name, deck_id } = await c.req.json();
	const supabase = c.get("supabase");

	// get deck id from deck name
	let resolvedDeckId = deck_id;

	if (!resolvedDeckId) {
		const { data: decks, error: deckError } = await supabase
			.from("Deck_Table")
			.select("id")
			.eq("name", name)
			.single();

		if (deckError || !decks) {
			return c.json({ message: "Deck not found", error: deckError }, 404);
		}

		resolvedDeckId = decks.id;
	}

	const { data, error } = await supabase
		.from("Card_Table")
		.insert({
			front,
			back,
			deck_id: resolvedDeckId,
		})
		.select()
		.single();

	if (error) return c.json({ message: "Something went wrong", error }, 500);
	return c.json({ message: "adding new card", data }, 200);
});
