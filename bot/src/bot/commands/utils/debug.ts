import Command from "../../struct/Command";
import { Message, MessageEmbed } from "discord.js";
import User from "../../../models/user";

abstract class Help extends Command {
  constructor() {
    super({
      name: "debug",
      aliases: ["read"],
      description: "Display a list of all commands",
      category: "Information",
      ownerOnly: true,
    });
  }

  async exec(message: Message, args: string[]) {
    const user =
      message.mentions.users.first() ||
      this.client.users.cache.get(args[0]) ||
      message.author;

    if (!user) {
      return message.channel.send(
        "<:cross:847460147806994452> Invalid user, please mention or provide user ID."
      );
    } else {
      const data = await User.findOne({
        id: user.id,
      });

      const embed1 = new MessageEmbed()
        .setTitle("Data for " + user.username)
        .setColor("RANDOM")
        .addField("ID", user.id)
        .addField("Cal", data!.calendar)
        .addField("In Database", data ? true : false);

      return message.channel.send(embed1);
    }
  }
}

export default Help;
