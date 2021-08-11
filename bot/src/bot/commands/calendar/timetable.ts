import Command from "../../struct/Command";
import { CommandInteraction } from "discord.js";
import { parseICS } from "ical";
import { MessageEmbed } from "discord.js";
import { EventArray } from "../../types/Events";
import getURL from "../../../utils/getURL";
import getData from "../../../utils/getData";
import cacheData from "../../../utils/cacheData";
import inCache from "../../../utils/inCache";

abstract class Timetable extends Command {
  constructor() {
    super({
      name: "timetable",
      aliases: ["tt"],
      description: "View your timetable for the day.",
      category: "Calendar",
    });
  }

  async exec(message: CommandInteraction) {
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

    let result: EventArray = [];

    let date = new Date();

    for (let event in data) {
      const info = data[event];

      if (info.start?.toDateString() == date.toDateString()) {
        result.push({
          name: info.description!,
          when: info.start!.toLocaleString(),
          location: info.location!,
        });
      }
    }

    let embed = new MessageEmbed()
      .setTitle("Timetable for " + date.toDateString())
      .setColor("RANDOM")
      .setTimestamp()
      .setFooter("Timetable for " + message.user.tag + " • Don't be late!");

    if (!result[0]) {
      return message.editReply(
        "<:cross:847460147806994452> There are no lessons today."
      );
    }

    result.map((x) => {
      if (!x.name.includes("Subject"))
        embed.addField(x.name, x.location + ", on " + x.when);
      else embed.addField(x.name.substring(9), x.location + ", on " + x.when);
    });

    return message.editReply({ embeds: [embed] });
  }
}

export default Timetable;
