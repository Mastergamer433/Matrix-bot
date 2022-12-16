import {
  MatrixClient,
  SimpleFsStorageProvider,
  AutojoinRoomsMixin,
} from "matrix-bot-sdk";

const homeserverUrl = "https://matrix.kimane.se"; // make sure to update this with your url
const accessToken = "syt_dGVzdC1ib3Q_grWWFOIiEFWPHJwRbDxu_3R0jPY";

const storage = new SimpleFsStorageProvider("bot.json");
const client = new MatrixClient(homeserverUrl, accessToken, storage);

AutojoinRoomsMixin.setupOnClient(client);


client.on("room.message", handleCommand);

async function handleCommand(roomId: string, event: any) {
  // Don't handle unhelpful events (ones that aren't text messages, are redacted, or sent by us)
  if (event['content']?.['msgtype'] !== 'm.text') return;
  if (event['sender'] === await client.getUserId()) return;
  
  // Check to ensure that the `!echo` command is being run
  const body = event['content']['body'];
  
  console.log(`${roomId}: ${event['sender']} says ${body}`);
  
  if (body.startsWith("!echo")) {
    const replyText = body.substring("!echo".length).trim();
    await client.sendMessage(roomId, {
      "msgtype": "m.notice",
      "body": replyText,
    });
  }
  
}

// Now that everything is set up, start the bot. This will start the sync loop and run until killed.
client.start().then(() => console.log("Bot started!"));
