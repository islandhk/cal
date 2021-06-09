import { NextApiRequest, NextApiResponse } from "next";
import connect from "../../../middleware/db/connect";
import User from "../../../models/user";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method == "POST") {
    const { id, calendar, password } = req.body;

    if (password !== process.env.PASSWORD)
      return res.status(500).send("unauthorized");

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
      res.status(500).send(e.message);
    }
  }
}

export default connect(handler);
