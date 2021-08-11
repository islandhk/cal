import Command from "../../struct/Command";
import { CommandInteraction, MessageEmbed } from "discord.js";
import prisma from "../../../database/export/Database";
import axios from "axios";
import parse from "../../../utils/parse";
import cache from "../../../cache/Cache";
import getCache from "../../../utils/getCache";

const helpEmbed1 = new MessageEmbed()
  .setTitle("Okay, it looks like you're confused.")
  .setDescription("*Don't worry, we'll take you through it...*")
  .addField(
    "Firstly, get on Gateway.",
    "[Here you go!](https://tg.esf.edu.hk/)"
  )
  .addField(
    'Next, click on "Sync to Google Calendar".',
    "*It's above the calendar on the right hand side. Here's a picture...*"
  )
  .setImage("https://mcs.is-inside.me/RLgYt2U2.png");

const helpEmbed2 = new MessageEmbed()
  .addField('Now, hit the "Copy" button.', "*Altenatively, copy the URL.*")
  .addField(
    "Get on Discord...",
    "*...and run `-a <your_url_without_<>s_here>` to get started!*"
  )
  .addField("Congrats!", "You're done!");

abstract class Add extends Command {
  constructor() {
    super({
      name: "add",
      aliases: ["a"],
      description: "Add your calendar for viewing!",
      category: "Configuration",
      ephermal: true,
      args: [
        {
          name: "url",
          description: "Your calendar URL from The Gateway.",
          type: "STRING",
          required: true,
        },
      ],
    });
  }

  async exec(message: CommandInteraction, args: string[]) {
    if (
      !args[0]
        .toLowerCase()
        .includes("tg.esf.edu.hk/public/icalendar/callink.php")
    ) {
      message.reply(
        "<:cross:847460147806994452> That's not a Gateway URL. For more information, please review the information below:"
      );
      message.followUp({ embeds: [helpEmbed1] });
      return message.followUp({ embeds: [helpEmbed2] });
    }

    message.deferReply();
    await axios
      .get(args[0])
      .then(async (res) => {
        if (Object.entries(parse(res.data)).length == 0)
          return message.editReply(
            "<:cross:847460147806994452> We can't process that URL - is it a calendar URL from The Gateway?"
          );

        try {
          if (getCache(message.user)) await cache.del("cal:" + message.user.id);

          const data = await prisma.main.findFirst({
            where: {
              user: message.user.id,
            },
          });

          message.editReply(
            "<a:loading:847463122423513169> Loading... (updating database)"
          );

          if (data) {
            await prisma.main.update({
              where: {
                user: message.user.id,
              },
              data: {
                url: args[0],
              },
            });

            return message.editReply(
              "<:tick:847460147789955092> Successfully updated your calendar!"
            );
          } else {
            await prisma.main.create({
              data: {
                user: message.user.id,
                url: args[0],
              },
            });

            return message.editReply(
              "<:tick:847460147789955092> Successfully added your calendar!"
            );
          }
        } catch (e) {
          return message.editReply(
            "<:cross:847460147806994452> There was an error while adding your calendar to the database. Please let "
          );
        }
      })
      .catch(() => {
        return message.editReply(
          "<:cross:847460147806994452> There was an error processing the URL, did you add https:// in front of it?"
        );
      });
  }
}

export default Add;
