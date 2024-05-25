import { Hono } from "hono";
import { authenticate, validate } from "../middlewares";
import { ChatRoom } from "../models/chat-room.model";
import { Message } from "../models/message.model";
import { ChatRoomSchema, MessageSchema } from "../schemas/chat-rooms.schema";
import { sendMsg } from "../utils";

export const chatRooms = new Hono()
  .use(authenticate)
  .post("/", validate("json", ChatRoomSchema), async (c) => {
    const { invitee, group } = c.req.valid("json");
    if (group) return c.json(sendMsg("Group chat not implemented yet.", 501));

    const chatRoom = await ChatRoom.create({
      participants: [c.get("user")._id, invitee],
      group
    });

    return c.json(chatRoom, 201);
  })
  .post("/:id/messages", validate("json", MessageSchema), async (c) => {
    const { message } = c.req.valid("json");
    const chatRoom = await ChatRoom.findById(c.req.param("id")).lean();
    if (!chatRoom || !chatRoom.participants.includes(c.get("user")._id)) {
      return c.json(sendMsg("Unauthorized.", 401));
    }

    await Message.create({
      sender: c.get("user")._id,
      chatRoom: chatRoom._id,
      message,
      createdAt: new Date().toISOString()
    });

    return c.json(sendMsg("Message sent.", 201));
  })
  .get("/", async (c) => {
    const chatRooms = await ChatRoom
      .find({ participants: c.get("user")._id })
      .select("-__v")
      .lean();

    return c.json(chatRooms);
  })
  .get("/:id/messages", async (c) => {
    const chatRoom = await ChatRoom.findById(c.req.param("id")).lean();
    if (!chatRoom || !chatRoom.participants.includes(c.get("user")._id)) {
      return c.json(sendMsg("Unauthorized.", 401));
    }

    const messages = await Message
      .find({ chatRoom: chatRoom._id })
      .select("-__v")
      .sort({ createdAt: -1 })
      .lean();

    return c.json(messages);
  });
