import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    displayName: String,
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    collection: "users",
    timestamps: true
  }
);

userSchema.index(
  { name: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);
userSchema.index({ email: 1 }, { unique: true });

export const User = mongoose.model("User", userSchema);
