import { ApplicationCommandData } from "discord.js";
import Bot from "../../client/Client";

const registerSlashCommands: Function = (client: Bot) => {
  const commands = client.commands;
  commands.forEach(async (command) => {
    const data: ApplicationCommandData = {
      name: command.name,
      description: command.description,
    };

    if (command.args) {
      for (let arg of command.args!) {
        if (!data.options) data.options = [arg];
        else data.options.push(arg);
      }
    }

    await client.guilds.cache.get("856508979265404960")?.commands.create(data);
  });
};

export default registerSlashCommands;
