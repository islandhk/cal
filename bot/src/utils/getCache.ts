import { User } from "discord.js";
import cache from "../cache/Cache";

export default async function getCache(user: User): Promise<string | null> {
  const data = await cache.get("cal:" + user.id);
  return data;
}
