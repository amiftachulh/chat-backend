import * as v from "valibot";

export const ChatRoomSchema = v.object({
  invitee: v.string(),
  group: v.boolean()
});

export const MessageSchema = v.object({
  message: v.string()
});

export type ChatRoomSchema = v.Output<typeof ChatRoomSchema>;
