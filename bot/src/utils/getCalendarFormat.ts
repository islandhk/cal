import { User } from "discord.js";
import { Platform } from "../bot/types/Utils";
import cache from "../cache/Cache";
import prisma from "../database/Database";

export default async function getCalendarFormat(
  user: User
): Promise<Platform | undefined> {
  const cacheData = await cache.get("cal:format:" + user.id);
  if (cacheData == "GCal") return Platform.GCal;
  else if (cacheData == "Gateway") return Platform.Gateway;
  else {
    const data = await prisma.main.findFirst({
      where: {
        user: user.id,
      },
      select: {
        service: true,
      },
    });

    if (data) {
      if (data.service == "GCAL") {
        cache.set("cal:format:" + user.id, "GCal");
        return Platform.GCal;
      } else if (data.service == "GATEWAY") {
        cache.set("cal:format:" + user.id, "Gateway");
        return Platform.Gateway;
      }
    } else return undefined;
  }
}
