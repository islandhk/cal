import Redis from "ioredis";
import settings from "../bot/settings";

const cache = settings.REDIS_PASSWORD
  ? new Redis({
      password: settings.REDIS_PASSWORD,
    })
  : new Redis();

cache.once("ready", () => console.log("[Database/Cache] Redis started."));

export default cache;
