import Command from "../../struct/Command";
import { CommandInteraction } from "discord.js";
import { CalendarComponent, parseICS } from "ical";
import { MessageEmbed } from "discord.js";
import { Event } from "../../types/Events";
import getURL from "../../../utils/getURL";
import getData from "../../../utils/getData";
import inCache from "../../../utils/inCache";
import cacheData from "../../../utils/cacheData";

abstract class Next extends Command {
  constructor() {
    super({
      name: "next",
      aliases: ["n"],
      description: "View what the next lesson is.",
      category: "Calendar",
      args: [
        {
          name: "lesson",
          description: "The name of the lesson you are querying.",
          type: "STRING",
          required: false,
        },
      ],
    });
  }

  async exec(message: CommandInteraction, args: string[]) {
    message.deferReply({ ephemeral: true });
    const userInCache = await inCache(message.user);

    let calendar: string | undefined | null = undefined;
    let ics: string | null | undefined = undefined;

    if (userInCache) {
      ics = userInCache;
    } else {
      calendar = await getURL(message.user);

      if (!calendar)
        return message.editReply(
          "<:cross:847460147806994452> Please add your calendar with `-add <url>`."
        );

      ics = await getData(calendar);
      if (ics) await cacheData(message.user, ics!);
    }

    const data = parseICS(ics!);

    let result: Event | undefined;

    let date = new Date();

    if (args[0]) {
      let lesson = "";

      for (let word in args[0].split(" ")) {
        let first = args[word][0];
        first = first.toUpperCase();

        lesson = lesson + first + args[word].slice(1) + " ";
      }

      let embed = new MessageEmbed()
        .setTitle("The next " + lesson + " lesson is on...")
        .setColor("RANDOM");

      let check: CalendarComponent | undefined;

      for (let event in data) {
        let info = data[event];

        if (info.start! >= date) {
          if (info.description?.includes(lesson)) {
            check = info;
            break;
          }
        }
      }

      if (!check) {
        return message.editReply(
          "<:cross:847460147806994452> There is no lesson by that name."
        );
      } else {
        embed.setDescription(
          check.start!.toLocaleString() + " at " + check.location! + "."
        );
      }

      return message.editReply({ embeds: [embed] });
    }

    for (let event in data) {
      let info = data[event];
      if (info.start! >= date) {
        result = {
          name: info.description!.substring(9),
          when: info.start!.toLocaleString(),
          location: info.location!,
        };
        break;
      }
    }

    if (!result) {
      return message.editReply(
        "<:cross:847460147806994452> There are no more lessons. (Hooray, I guess?)"
      );
    }

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .addField(
        "Your next lesson is...",
        result!.name + " on " + result!.when + " at " + result!.location + "."
      )
      .setTimestamp()
      .setFooter("Don't be late!");

    return message.editReply({ embeds: [embed] });
  }
}

export default Next;
