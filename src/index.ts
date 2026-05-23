import { Hono } from "hono";

const app = new Hono();

app.get("/", c => {
	return c.text("Hello Hono!");
});

app.get("/random", c => {
	const text =
		"The wind moved through the empty street like a quiet thought nobody finished thinking. A broken neon sign flickered twice, then gave up, leaving the corner store in a softer kind of darkness. Somewhere down the block, a dog barked at nothing in particular, as if keeping time with a rhythm only it could hear. The night didn't feel late so much as paused—waiting for something that might never arrive.";

	return c.text(text);
});

export default app;
