import * as v from "valibot";

export const RegisterSchema = v.object(
  {
    name: v.string([
      v.minLength(3, "Username must be at least 3 characters."),
      v.maxLength(32, "Username must be at most 32 characters."),
      v.regex(
        /^[a-zA-Z0-9_.]+$/,
        "Username must contain only letters, numbers, underscores, and dot."
      )
    ]),
    displayName: v.nullable(
      v.string([
        v.toTrimmed(),
        v.minLength(1),
        v.maxLength(50, "Display name must be at most 32 characters.")
      ]),
    ),
    email: v.string([
      v.email("Invalid email address.")
    ]),
    password: v.string([
      v.minLength(8, "Password must be at least 8 characters."),
      v.maxLength(32, "Password must be at most 32 characters."),
      v.regex(
        /^[a-zA-Z0-9!@#$%^&*()\-=_+[\]{}\\|;:'",./<>? ]+$/,
        "Password must contain only letters, numbers, and special characters."
      )
    ]),
    confirmPassword: v.string()
  },
  [
    v.forward(
      v.custom(input => input.password === input.confirmPassword, "Passwords do not match."),
      ["confirmPassword"]
    )
  ]
);

export const LoginSchema = v.object({
  emailOrUsername: v.string(),
  password: v.string()
});

export const JwtPayloadSchema = v.object({
  _id: v.string(),
  name: v.string(),
  email: v.string(),
  exp: v.number()
});

export type RegisterSchema = v.Output<typeof RegisterSchema>;
export type LoginSchema = v.Output<typeof LoginSchema>;
export type JwtPayloadSchema = v.Output<typeof JwtPayloadSchema>;
