import { Hono } from "hono";
import { getSupabase } from "./db/supabase";

const app = new Hono<{ Bindings: Bindings }>();

type Bindings = {
	SUPABASE_URL: string;
	SUPABASE_ANON_KEY: string;
};

app.get("/", c => {
	return c.text("Hello Hono!");
});

app.get("/random", c => {
	const text =
		"The wind moved through the empty street like a quiet thought nobody finished thinking. A broken neon sign flickered twice, then gave up, leaving the corner store in a softer kind of darkness. Somewhere down the block, a dog barked at nothing in particular, as if keeping time with a rhythm only it could hear. The night didn't feel late so much as paused—waiting for something that might never arrive.";

	return c.text(text);
});

app.use("*", async (c, next) => {
	c.set("supabase", getSupabase(c.env));
	await next();
});

// CARDS
app.get("/card/all", async c => {
	const supabase = c.get("supabase");
	const { data: cards } = await supabase.from("Card_Table").select();
	console.log({ cards });
	return c.json({ message: "retrieving all cards", data: cards });
});

app.get("/card/:id", async c => {
	const id = c.req.param("id");
	const supabase = c.get("supabase");
	const { data: cards } = await supabase
		.from("Card_Table")
		.select()
		.eq("id", id);
	return c.json({ message: `retrieving card ${id}`, data: cards });
});

app.post("/card", async c => {
	const body = c.req.parseBody();
	console.log({ body });
	// const { error } = await supabase.from("Card_Table").insert({ front, back });
	return c.text("adding new card");
});

// DECKS
app.get("/deck/all", c => {
	return c.text("retrieving all decks");
});

app.get("/deck/:id", c => {
	const id = c.req.param("id");
	return c.text(`retrieving deck ${id}`);
});

app.put("/deck/:id", c => {
	const id = c.req.param("id");
	return c.text(`updating deck ${id}`);
});

app.post("/deck", c => {
	return c.text("adding new deck");
});

// IMAGES
app.get("/image/:id", c => {
	const id = c.req.param("id");
	return c.text(`retrieving image ${id}`);
});

app.put("/image/:id", c => {
	const id = c.req.param("id");
	return c.text(`updating image ${id}`);
});

app.post("/image", c => {
	return c.text("adding new image");
});

export default app;
