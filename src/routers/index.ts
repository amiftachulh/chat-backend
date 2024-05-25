import { Hono } from "hono";
import { auth } from "./auth.router";
import { chatRooms } from "./chat-rooms.router";
import { users } from "./users.router";

export const router = new Hono()
  .basePath("/v1")
  .route("/auth", auth)
  .route("/users", users)
  .route("/chat-rooms", chatRooms);
