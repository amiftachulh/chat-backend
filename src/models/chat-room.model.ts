import mongoose from "mongoose";

const chatRoomSchema = new mongoose.Schema(
  {
    participants: {
      type: [String],
      required: true,
      ref: "User"
    },
    group: Boolean
  },
  {
    collection: "chatRooms",
    timestamps: true
  }
);

export const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);
