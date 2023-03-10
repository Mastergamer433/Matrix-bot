import {
  MatrixClient,
  SimpleFsStorageProvider,
  AutojoinRoomsMixin,
} from "matrix-bot-sdk";
import CommandHandler from "./commands/handler";
import CommandRegister from "./register-commands";

CommandRegister();
const homeserverUrl = "https://matrix.kimane.se"; // make sure to update this with your url
const accessToken = "syt_dGVzdC1ib3Q_QXImEWsGtDaDofwcLkVT_0adqYN";
const storage = new SimpleFsStorageProvider("bot.json");
const client = new MatrixClient(homeserverUrl, accessToken, storage);
const { commands } = CommandRegister;

const main = () => {
  AutojoinRoomsMixin.setupOnClient(client);

  client.on("room.message", handleMessage);
};

async function handleMessage(roomId: string, event: any) {
  // Don't handle unhelpful events (ones that aren't text messages, are redacted, or sent by us)
  if (event["content"]?.["msgtype"] !== "m.text") return;
  if (event["sender"] === (await client.getUserId())) return;

  const body = event["content"]["body"];

  console.log(`${roomId}: ${event["sender"]} says ${body}`);

  if (body.startsWith("!")) {
    CommandHandler(client, commands, roomId, event);
  } else {
    return;
  }
}
// Now that everything is set up, start the bot. This will start the sync loop and run until killed.
client.start().then(() => console.log("Bot started!"));
