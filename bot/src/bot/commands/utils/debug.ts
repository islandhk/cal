import Command from "../../struct/Command";
import { CommandInteraction, MessageEmbed, User } from "discord.js";
import prisma from "../../../database/Database";
import getCache from "../../../utils/getCache";

abstract class Debug extends Command {
  constructor() {
    super({
      name: "debug",
      aliases: ["read"],
      args: [
        {
          name: "user",
          description: "The user to get information from.",
          type: "USER",
          required: false,
        },
      ],
      description: "Read a user's information on Cal.",
      category: "Information",
      ownerOnly: true,
    });
  }

  async exec(message: CommandInteraction, args: Array<User>) {
    const user = args[0] || message.user;

    if (!user) {
      return message.reply({
        content:
          "<:cross:847460147806994452> Invalid user, please mention or provide user ID.",
        ephemeral: true,
      });
    } else {
      const data = await prisma.main.findFirst({
        where: {
          user: user.id,
        },
      });

      const redis = await getCache(user);

      const embed1 = new MessageEmbed()
        .setTitle("Data for " + user.username)
        .setColor("RANDOM")
        .addField("ID", user.id)
        .addField("In Database", `${data ? true : false}`)
        .addField("In Redis", `${redis ? true : false}`);

      if (data)
        embed1.addField("Cal", data.url).addField("Service", data.service);

      return message.reply({ embeds: [embed1], ephemeral: true });
    }
  }
}

export default Debug;
