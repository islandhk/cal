import Command from "../../struct/Command";
import { CommandInteraction } from "discord.js";
import { parseICS } from "ical";
import { MessageEmbed } from "discord.js";
import getURL from "../../../utils/getURL";
import getData from "../../../utils/getData";
import cacheData from "../../../utils/cacheData";
import inCache from "../../../utils/inCache";
import processData from "../../../utils/processData";

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
    let date = new Date();

    const result = await processData(data, message.user);

    let embed = new MessageEmbed()
      .setTitle("Timetable for " + date.toDateString())
      .setColor("RANDOM")
      .setTimestamp()
      .setFooter("Timetable for " + message.user.tag + " • Don't be late!");

    if (!result[0]) {
      return message.editReply(
        "<:cross:847460147806994452> There are no events today."
      );
    }

    result.map((x) => {
      if (!x.name.includes("Subject"))
        embed.addField(x.name, x.location + " on " + x.when);
      else embed.addField(x.name.substring(9), x.location + " on " + x.when);
    });

    return message.editReply({ embeds: [embed] });
  }
}

export default Timetable;
