import Command from "../../struct/Command";
import { Message, MessageEmbed } from "discord.js";
import User from "../../../models/user";
import axios from "axios";

abstract class Add extends Command {
  constructor() {
    super({
      name: "add",
      aliases: ["a"],
      description: "Add your calendar for viewing!",
      category: "Configuration",
    });
  }

  async exec(message: Message, args: string[]) {
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

    if (!args[0])
      return message.channel.send("<@" + message.author.id + ">").then((m) => {
        m.delete();
        message.channel.send(helpEmbed1);
        message.channel.send(helpEmbed2);
      });

    return message.channel
      .send("<a:loading:847463122423513169> Loading...")
      .then(async (m) => {
        return await axios
          .get(args[0])
          .then(async () => {
            const data = await User.findOne({
              id: message.author.id,
            });

            if (data) {
              data.update({
                calendar: args[0],
              });
              data.save();

              setTimeout(() => {
                message.delete();
                m.delete();
              }, 3000);

              return m.edit(
                "<:tick:847460147789955092> Successfully updated your calendar!"
              );
            } else {
              const newData = new User({
                id: message.author.id,
                calendar: args[0],
              });

              await newData.save();

              setTimeout(() => {
                message.delete();
                m.delete();
              }, 3000);

              return m.edit(
                "<:tick:847460147789955092> Successfully added your calendar!"
              );
            }
          })
          .catch(() => {
            return m.edit(
              "<:cross:847460147806994452> The calendar URL is invalid, is it publicly available?"
            );
          });
      });
  }
}

export default Add;
