import { ApplicationCommandData } from "discord.js";
import Bot from "../../client/Client";

const registerSlashCommands: Function = async (client: Bot) => {
  if (process.env.NODE_ENV == "dev") {
    const guild = await client.guilds.fetch("856508979265404960");

    // reset guild commands
    await guild.commands.set([]);

    const commands = client.commands;
    commands.forEach(async (command) => {
      const data: ApplicationCommandData = {
        name: "test_" + command.name,
        description: command.description,
      };

      if (command.args) {
        for (let arg of command.args!) {
          if (!data.options) data.options = [arg];
          else data.options.push(arg);
        }
      }

      await guild.commands.create(data);
    });
  } else {
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

      await client.application?.commands.create(data);
    });
  }
  console.log("[Bot] Registered commands.");
};

export default registerSlashCommands;
