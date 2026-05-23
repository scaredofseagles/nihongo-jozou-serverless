import { Hono } from "hono";
import type { Bindings } from "../types";

export const imagesRoute = new Hono<{ Bindings: Bindings }>();

imagesRoute.get("/:id", c => {
	const id = c.req.param("id");
	return c.text(`retrieving image ${id}`);
});

imagesRoute.put("/:id", c => {
	const id = c.req.param("id");
	return c.text(`updating image ${id}`);
});

imagesRoute.post("/", c => {
	return c.text("adding new image");
});
