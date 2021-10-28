import Command from "../../struct/Command";
import { CommandInteraction } from "discord.js";
import prisma from "../../../database/Database";
import axios from "axios";
import parse from "../../../utils/parse";
import cache from "../../../cache/Cache";
import getCache from "../../../utils/getCache";
import determineService from "../../../utils/determineService";
import { Service } from "prisma/prisma-client";
import { Platform } from "../../types/Utils";

/*
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
*/

abstract class Add extends Command {
  constructor() {
    super({
      name: "add",
      aliases: ["a"],
      description: "Add your calendar for viewing!",
      category: "Configuration",
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
    const service = determineService(args[0]);
    let prismaService: Service;

    if (service == Platform.GCal) prismaService = "GCAL";
    else if (service == Platform.Gateway) prismaService = "GATEWAY";

    if (!service) {
      return message.reply({
        content:
          "<:cross:847460147806994452> That's not a valid URL. Please enter a Google Calendar or a Gateway URL.",
        ephemeral: true,
      });
    }

    await message.deferReply({
      ephemeral: true,
    });

    if (!args[0].startsWith("https://") && !args[0].includes("https://"))
      args[0] = "https://" + args[0];

    await axios
      .get(args[0])
      .then(async (res) => {
        if (Object.entries(parse(res.data)).length == 0)
          return message.editReply(
            "<:cross:847460147806994452> We can't process that URL - is that a valid URL and did you add `https://`?"
          );

        try {
          if (await getCache(message.user))
            await cache.del("cal:" + message.user.id);

          const data = await prisma.main.findFirst({
            where: {
              user: message.user.id,
            },
          });

          if (data) {
            await prisma.main.update({
              where: {
                user: message.user.id,
              },
              data: {
                url: args[0],
                service: prismaService,
              },
            });

            return message.editReply({
              content:
                "<:tick:847460147789955092> Successfully updated your calendar!",
            });
          } else {
            await prisma.main.create({
              data: {
                user: message.user.id,
                url: args[0],
                service: prismaService,
              },
            });

            return message.editReply(
              "<:tick:847460147789955092> Successfully added your calendar!"
            );
          }
        } catch (e) {
          console.log(e);
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
