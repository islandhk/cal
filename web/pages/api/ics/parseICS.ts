import { NextApiRequest, NextApiResponse } from "next";
import { parseICS } from "ical";

async function parse(req: NextApiRequest, res: NextApiResponse) {
  if (req.method == "POST") {
    const { data } = req.body;

    return res.json(parseICS(data));
  }
}

export default parse;
