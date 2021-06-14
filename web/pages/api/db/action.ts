import { NextApiRequest, NextApiResponse } from "next";
import connect from "../../../middleware/db/connect";
import Usr from "../../../models/user";
import mongoose from "mongoose";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method == "POST") {
    let User = Usr;
    if (mongoose.models && mongoose.models.User) User = mongoose.models.users;

    const { action } = req.body;

    if (action == "SAVE") {
      const { id, calendar } = req.body;

      if (!id || !calendar) return res.status(500).send("data_incomplete");

      const data = await User.findOne({
        id,
      });

      if (data) data.delete();

      try {
        const newUser = new User({
          id,
          calendar,
        });

        const save = await newUser.save();
        return res.status(200).send(save);
      } catch (e) {
        return res.status(500).send(e.message);
      }
    } else if (action == "DELETE") {
      const { id } = req.body;

      try {
        await User.findOneAndDelete({
          id,
        });

        return res.status(200).send("OK");
      } catch (e) {
        return res.status(500).send(e.message);
      }
    } else {
      return res.status(500).send("INVALID_METHOD");
    }
  }
}

export default connect(handler);
