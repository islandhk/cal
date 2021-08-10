import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { getSession } from "next-auth/client";

async function Get(req: NextApiRequest, res: NextApiResponse) {
  if (req.method == "GET") {
    const session = await getSession({ req });

    const user = await prisma.main.findFirst({
      where: {
        user: session.id,
      },
    });

    if (!user)
      return res.status(400).json({
        error: "User not found in database.",
        code: 400,
      });

    return res.status(200).json({
      url: user.url,
    });
  }
}

export default Get;
