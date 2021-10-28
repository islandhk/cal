import Command from "../../struct/Command";
import { CommandInteraction } from "discord.js";
import { CalendarComponent, parseICS } from "ical";
import { MessageEmbed } from "discord.js";
import { Event } from "../../types/Events";
import getURL from "../../../utils/getURL";
import getData from "../../../utils/getData";
import inCache from "../../../utils/inCache";
import cacheData from "../../../utils/cacheData";
import getCalendarFormat from "../../../utils/getCalendarFormat";
import { Platform } from "../../types/Utils";

abstract class Next extends Command {
  constructor() {
    super({
      name: "next",
      aliases: ["n"],
      description: "View what the next lesson is.",
      category: "Calendar",
      args: [
        {
          name: "event",
          description: "The name of the event you are querying.",
          type: "STRING",
          required: false,
        },
      ],
    });
  }

  async exec(message: CommandInteraction, args: string[]) {
    await message.deferReply({ ephemeral: true });
    const userInCache = await inCache(message.user);

    let calendar: string | undefined | null = undefined;
    let ics: string | null | undefined = undefined;
    const calendarFormat = await getCalendarFormat(message.user);

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

    // If argument is detected, search for that event
    if (args[0]) {
      let event = "";

      if (calendarFormat == Platform.Gateway) {
        for (let word in args[0].split(" ")) {
          let first = args[word][0];
          first = first.toUpperCase();

          event = event + first + args[word].slice(1) + " ";
        }

        let embed = new MessageEmbed()
          .setTitle("The next " + event + " lesson is on...")
          .setColor("RANDOM");

        let check: CalendarComponent | undefined;

        for (let event in data) {
          let info = data[event];

          if (info.start! >= date) {
            if (info.description?.includes(event)) {
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
      } else if (calendarFormat == Platform.GCal) {
        event = args[0].toLowerCase();
        let embed = new MessageEmbed()
          .setTitle(event + " is on...")
          .setColor("RANDOM");

        let check: CalendarComponent | undefined;

        for (let entry in data) {
          let info = data[entry];

          if (info.start! >= date) {
            //  console.log(event);
            console.log(info.summary);
            // console.log(info.summary?.toLowerCase().includes(event));
            if (info.summary?.toLowerCase().includes(event)) {
              check = info;
              break;
            }
          }
        }

        if (!check) {
          return message.editReply(
            "<:cross:847460147806994452> There is no event by that name."
          );
        } else {
          const location =
            check.location! == undefined || check.location! == ""
              ? ""
              : "at " + check.location!;

          embed.setDescription(check.start!.toLocaleString() + location! + ".");
        }

        return message.editReply({ embeds: [embed] });
      }
    }
    // No argument, look for the next event.
    for (let event in data) {
      let info = data[event];
      if (info.start! >= date) {
        result = {
          name:
            calendarFormat == Platform.Gateway
              ? info.description!.substring(9)
              : info.summary!,
          when: info.start!.toLocaleString(),
          location:
            info.location! == undefined || info.location! == ""
              ? ""
              : "at " + info.location!,
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
        "Your next event is...",
        result!.name + " on " + result!.when + result.location
      )
      .setTimestamp()
      .setFooter("Don't be late!");

    return message.editReply({ embeds: [embed] });
  }
}

export default Next;
