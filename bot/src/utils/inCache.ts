import { User } from "discord.js";
import cache from "../cache/Cache";

export default async function inCache(user: User) {
  const userInCache = await cache.get("cal:" + user.id);

  return userInCache;
}
