import Command from "../../struct/Command";
import { CommandInteraction } from "discord.js";
import { parseICS } from "ical";
import { MessageEmbed } from "discord.js";
import { EventArray } from "../../types/Events";
import getURL from "../../../utils/getURL";
import getData from "../../../utils/getData";
import cacheData from "../../../utils/cacheData";
import inCache from "../../../utils/inCache";

abstract class Tomorrow extends Command {
  constructor() {
    super({
      name: "tomorrow",
      aliases: ["t", "tomorrowtimetable"],
      description: "View your timetable for tomorrow.",
      category: "Calendar",
    });
  }

  async exec(message: CommandInteraction) {
    await message.deferReply({ ephemeral: true });
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
    date.setDate(date.getDate() + 1);

    for (let event in data) {
      const info = data[event];

      if (info.start?.toDateString() == date.toDateString()) {
        result.push({
          name: info.description!.substring(9),
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
        "<:cross:847460147806994452> There are no lessons tomorrow."
      );
    }

    result.map((x) => {
      embed.addField(x.name, x.location + ", on " + x.when);
    });

    return message.editReply({ embeds: [embed] });
  }
}

export default Tomorrow;
