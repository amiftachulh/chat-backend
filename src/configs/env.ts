import "dotenv/config";
import * as v from "valibot";

const EnvVariables = v.object({
  PORT: v.coerce(v.number(), Number),
  MONGODB_URI: v.string(),
  ALLOWED_ORIGINS: v.transform(v.string(), (value) => value.split(",")),
  JWT_SECRET: v.string()
});

let envOutput;

try {
  envOutput = v.parse(EnvVariables, process.env);
} catch (error) {
  if (error instanceof v.ValiError) console.error(v.flatten(error).nested);
  process.exit(1);
}

export const {
  PORT,
  MONGODB_URI,
  ALLOWED_ORIGINS,
  JWT_SECRET
} = envOutput;
