import { Hono } from "hono";
import { authenticate } from "../middlewares";
import { User } from "../models/user.model";

export const users = new Hono()
  .use(authenticate)
  .get("/", async (c) => {
    const q = c.req.query("q");
    const users = await User
      .find({
        $and: [
          { name: { $regex: q, $options: "i" } },
          { _id: { $ne: c.get("user")._id } }
        ]
      })
      .select("_id name displayName email")
      .sort({ name: 1 })
      .limit(5)
      .lean();
    return c.json(users);
  })
  .get("/me", async (c) => {
    const me = await User.findOne({ _id: c.get("user")._id }).select("-__v -password").lean();
    return c.json(me);
  });
