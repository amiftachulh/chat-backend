import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: true,
      ref: "User"
    },
    chatRoom: {
      type: String,
      required: true,
      ref: "ChatRoom"
    },
    message: {
      type: String,
      required: true
    },
    createdAt: Date
  },
  {
    collection: "messages"
  }
);

export const Message = mongoose.model("Message", messageSchema);
