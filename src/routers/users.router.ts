import { Hono } from "hono";
import { authenticate } from "../middlewares";
import { User } from "../models/user.model";

export const users = new Hono()
  .use(authenticate)
  .get("/", async (c) => {
    const name = c.req.query("name");
    const users = await User
      .find({ name })
      .select("_id name email")
      .sort({ name: 1 })
      .limit(5)
      .lean();
    return c.json(users);
  })
  .get("/me", async (c) => {
    const me = await User.findOne({ _id: c.get("user")._id }).select("-__v -password").lean();
    return c.json(me);
  });
