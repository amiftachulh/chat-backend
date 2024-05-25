import * as v from "valibot";

export function validateSchema<T extends v.BaseSchema>(
  schema: T,
  value: any
) {
  const result = v.safeParse(schema, value);
  if (!result.success) {
    return null;
  }
  return result.output as v.Output<T>;
}

export function sendMsg(message: string, errors?: any) {
  return { message, errors };
}
