import { User } from "discord.js";
import cache from "../cache/Cache";

export default async function getCache(user: User) {
  const data = await cache.get("cal:" + user.id);
  return data;
}
