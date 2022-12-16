import {
  LogService,
  MatrixClient,
  MessageEvent,
  RichReply,
  UserID,
} from "matrix-bot-sdk";
import fs from "fs";
import * as htmlEscape from "escape-html";

// The prefix required to trigger the bot. The bot will also respond
// to being pinged directly.
export const COMMAND_PREFIX = "!";

// This is where all of our commands will be handled
export default function (client: any, commands: any, roomId: string, ev: any) {
  const event = new MessageEvent(ev);
  if (event.isRedacted) return; // Ignore redacted events that come through
  if (event.sender === this.userId) return; // Ignore ourselves
  if (event.messageType !== "m.text") return; // Ignore non-text messages

  // Ensure that the event is a command before going on. We allow people to ping
  // the bot as well as using our COMMAND_PREFIX.
  if (!event.textBody.startsWith(COMMAND_PREFIX)) return; // Not a command (as far as we're concerned)

  const args = event.textBody
    .substring(COMMAND_PREFIX.length)
    .trim()
    .split(" ");
  console.log(args);

  // Try and figure out what command the user ran, defaulting to help
  try {
    return commands[args[0]].run(client, roomId, event, args);
  } catch (e) {
    // Log the error
    LogService.error("CommandHandler", e);

    // Tell the user there was a problem
    const message = "There was an error processing your command";
    return this.replyNotice(roomId, ev, message);
  }
}
