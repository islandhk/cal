import { User } from "discord.js";
import cache from "../cache/Cache";

export default async function cacheData(user: User, data: string) {
  return await cache.setex("cal:" + user.id, 1800, data);
}
