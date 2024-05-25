import { Hono } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { sign } from "hono/jwt";
import { JWT_SECRET } from "../configs/env";
import { authenticate, validate } from "../middlewares";
import { RevokedToken } from "../models/revoked-token.model";
import { User } from "../models/user.model";
import { LoginSchema, RegisterSchema } from "../schemas/auth.schema";
import { sendMsg } from "../utils";
import bcrypt from "bcrypt";

export const auth = new Hono()
  .post("/register", validate("json", RegisterSchema), async (c) => {
    const { name, displayName, email, password } = c.req.valid("json");

    const duplicate = await User
      .findOne({ $or: [{ name }, { email }] })
      .select("-__v")
      .lean();
    if (duplicate) return c.json(sendMsg("Username or email already taken."), 409);

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, displayName, email, password: hashedPassword });
    return c.json(sendMsg("Register success."), 201);
  })
  .post("/login", validate("json", LoginSchema), async (c) => {
    const { emailOrUsername: name, password } = c.req.valid("json");

    const user = await User.findOne({ name }).select("-__v").lean();
    if (!user) return c.json(sendMsg("Incorrect username or password."), 401);

    const match = await bcrypt.compare(password, user.password);
    if (!match) return c.json(sendMsg("Incorrect username or password."), 401);

    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
    const payload = {
      _id: user._id,
      name: user.name,
      email: user.email,
      exp
    };
    const token = await sign(payload, JWT_SECRET);

    setCookie(c, "token", token, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "None",
      expires: new Date(exp * 1000),
    });

    const { password: _, ...userInfo } = user;
    return c.json(userInfo);
  })
  .post("/logout", authenticate, async (c) => {
    const token = getCookie(c, "token");
    const exp = c.get("user").exp * 1000;
    await RevokedToken.create({ token, expiresAt: new Date(exp).toISOString() });
    deleteCookie(c, "token");
    return c.json(sendMsg("Logout success."));
  });

