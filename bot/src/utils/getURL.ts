import { User } from "discord.js";
import prisma from "../database/Database";

export default async function getURL(user: User) {
  return await prisma.main
    .findFirst({
      where: {
        user: user.id,
      },
    })
    .then((data) => data?.url);
}
