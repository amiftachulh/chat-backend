import { ValidationTargets } from "hono";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";
import { validator } from "hono/validator";
import { JWT_SECRET } from "../configs/env";
import { JwtPayloadSchema } from "../schemas/auth.schema";
import { Auth } from "../types";
import { sendMsg, validateSchema } from "../utils";
import * as v from "valibot";

export function validate<
  Target extends keyof ValidationTargets,
  T extends v.BaseSchema
>(target: Target, schema: T) {
  return validator(target, (value, c) => {
    const result = v.safeParse(schema, value);
    if (!result.success) {
      let t: string;
      switch (target) {
        case "json":
          t = "request body.";
          break;
        case "query":
          t = "query string.";
          break;
        case "param":
          t = "URL parameters.";
          break;
        default:
          t = "input.";
      }
      return c.json(
        sendMsg(`Invalid ${t}`, v.flatten(result.issues).nested),
        400
      );
    }
    return result.output as v.Output<T>;
  });
}

export const authenticate = createMiddleware<{ Variables: Auth }>(
  async (c, next) => {
    const token = getCookie(c, "token");
    if (!token) {
      return c.json(sendMsg("Invalid session."), 401);
    }

    let decoded;
    try {
      decoded = await verify(token, JWT_SECRET);
    } catch (error) {
      return c.json(sendMsg("Session expired."), 401);
    }

    const verified = validateSchema(JwtPayloadSchema, decoded);
    if (!verified) {
      return c.json(sendMsg("Invalid session."), 401);
    }

    c.set("user", verified);

    await next();
  }
);
