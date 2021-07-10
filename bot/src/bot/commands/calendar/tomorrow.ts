import Command from "../../struct/Command";
import { Message } from "discord.js";
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
      name: "tomorrow",
      aliases: ["t"],
      description: "View your timetable for the day after.",
      category: "Calendar",
    });
  }

  async exec(message: Message) {
    return message.channel
      .send("<a:loading:847463122423513169> Loading...")
      .then(async (m) => {
        const userInCache = await inCache(message.author);

        let calendar: string | undefined | null = undefined;
        let ics: string | null | undefined = undefined;

        if (userInCache) {
          ics = userInCache;
        } else {
          calendar = await getURL(message.author);

          if (!calendar)
            return m.edit(
              "<:cross:847460147806994452> Please add your calendar with `-add <url>`."
            );

          ics = await getData(calendar);
          if (ics) await cacheData(message.author, ics!);
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
          .setFooter(
            "Timetable for " + message.author.tag + " • Don't be late!"
          );

        if (!result[0]) {
          m.delete();

          message.channel
            .send("<@" + message.author.id + ">")
            .then((msg) => msg.delete());

          return message.channel.send(
            "<:cross:847460147806994452> There are no lessons tomorrow."
          );
        }

        result.map((x) => {
          embed.addField(x.name, x.location + ", on " + x.when);
        });

        message.channel
          .send("<@" + message.author.id + ">")
          .then((msg) => msg.delete());

        m.delete();

        return message.channel.send(embed);
      });
  }
}

export default Timetable;
