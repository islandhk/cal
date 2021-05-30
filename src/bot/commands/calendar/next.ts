import Command from "../../struct/Command";
import { Message } from "discord.js";
import User from "../../../models/user";
import { parseICS } from "ical";
import axios from "axios";
import { MessageEmbed } from "discord.js";
import { Event } from "../../types/Event";

abstract class Next extends Command {
  constructor() {
    super({
      name: "next",
      aliases: ["n"],
      description: "View what the next lesson is.",
      category: "Calendar",
    });
  }

  async exec(message: Message) {
    return message.channel
      .send("<a:loading:847463122423513169> Loading...")
      .then(async (m) => {
        const calendar = await User.findOne({
          id: message.author.id,
        });

        if (!calendar)
          return message.channel.send(
            "<:cross:847460147806994452> Please add your calendar with `-add <url>`."
          );

        const ics: string = await axios
          .get(calendar.calendar)
          .then((stuff) => stuff.data);

        const data = parseICS(ics);

        let result: Event | undefined;

        let date = new Date();

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
