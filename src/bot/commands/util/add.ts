import Command from "../../struct/Command";
import { Message } from "discord.js";
import User from "../../../models/user";
import axios from "axios";

abstract class Add extends Command {
  constructor() {
    super({
      name: "add",
      aliases: ["a"],
      description: "Add your calendar for viewing!",
    });
  }

  async exec(message: Message, args: string[]) {
    if (!args[0])
      return message.channel.send(
        "<:cross:847460147806994452> Please provide calendar URL."
      );
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
