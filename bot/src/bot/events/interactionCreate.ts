import settings from "../settings";
import { Collection, Guild, Interaction, User } from "discord.js";
import Event from "../struct/Event";

abstract class interactionCreate extends Event {
  constructor() {
    super({
      name: "interactionCreate",
    });
  }

  async exec(interaction: Interaction) {
    if (!interaction.isCommand()) return;

    const command = this.client.commands.get(interaction.commandName);
    const user = interaction.user;

    if (command) {
      if (command.ownerOnly && !settings.BOT_OWNER_ID.includes(user.id))
        return interaction.reply(
          "You are not the owner of this bot, and you cannot run this command."
        );
      else if (command.guildOnly && !(interaction.guild instanceof Guild))
        return interaction.reply("This command can only be used in a guild.");
      else if (command.cooldown) {
        if (!this.client.cooldowns.has(command.name)) {
          this.client.cooldowns.set(command.name, new Collection());
        }
        const now = Date.now();
        const timestamps = this.client.cooldowns.get(command.name);
        const cooldownAmount = command.cooldown * 1000;
        if (timestamps?.has(user.id)) {
          const cooldown = timestamps.get(user.id);
          if (cooldown) {
            const expirationTime = cooldown + cooldownAmount;
            if (now < expirationTime) {
              const timeLeft = (expirationTime - now) / 1000;
              return interaction.reply(
                `Wait ${timeLeft.toFixed(
                  1
                )} more second(s) before reusing the \`${
                  command.name
                }\` command.`
              );
            }
          }
        }
        timestamps?.set(user.id, now);
        setTimeout(() => timestamps?.delete(user.id), cooldownAmount);
      }

      const args: Array<string | User> = [];

      if (command.args && command.args[0]) {
        for (let arg of command.args) {
          if (arg.type == "STRING")
            args.push(interaction.options.getString(arg.name)!);
          else if (arg.type == "USER")
            args.push(interaction.options.getUser(arg.name)!);
        }
      }

      try {
        return command.exec(interaction, args);
      } catch (error) {
        console.log(error);
        interaction.reply("There was an error running this command.");
      }
    }
  }
}

export default interactionCreate;
