import Command from "../../struct/Command";
import { Message } from "discord.js";
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
    });
  }

  async exec(message: Message, args: string[]) {
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

        let result: Event | undefined;

        let date = new Date();

        if (args[0]) {
          for (let element in args) {
            let first = args[element][0];
            first = first.toUpperCase();

            args[element] = first + args[element].slice(1);
          }

          const lesson = args.join(" ");

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
            m.delete();
            return message.channel.send(
              "<:cross:847460147806994452> There is no lesson by that name."
            );
          } else {
            embed.setDescription(
              check.start!.toLocaleString() + " at " + check.location! + "."
            );
          }

          m.delete();
          message.channel
            .send("<@" + message.author.id + ">")
            .then((msg) => msg.delete());

          return message.channel.send(embed);
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
          m.delete();
          message.channel
            .send("<@" + message.author.id + ">")
            .then((msg) => msg.delete());

          return message.channel.send(
            "<:cross:847460147806994452> There are no more lessons. (Hooray, I guess?)"
          );
        }

        const embed = new MessageEmbed()
          .setColor("RANDOM")
          .addField(
            "Your next lesson is...",
            result!.name +
              " on " +
              result!.when +
              " at " +
              result!.location +
              "."
          )
          .setTimestamp()
          .setFooter("Don't be late!");

        m.delete();

        message.channel
          .send("<@" + message.author.id + ">")
          .then((msg) => msg.delete());

        return message.channel.send(embed);
      });
  }
}

export default Next;
