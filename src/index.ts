import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";
import { connectDb } from "./configs/db";
import { ALLOWED_ORIGINS, PORT } from "./configs/env";
import { router } from "./routers";
import { sendMsg } from "./utils";

connectDb();

const app = new Hono();

app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true
}));

app.use(logger());

app.get("/", (c) => {
  return c.text("Chat API");
});

app.route("/", router);

app.onError((err, c) => {
  console.error(err);
  return c.json(sendMsg("Internal server error."), 500);
});

const port = PORT;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});
