import fs from "fs";

const commandArr: any = [];
const commandList: any = new Map();

export default function () {
  const commandFiles = fs
    .readdirSync("./commands/")
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commandArr.push(command.data.toJSON());
    commandList.set(command.data.name, command);
  }
}

export const commands = commandList;
