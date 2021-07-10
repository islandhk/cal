import Redis from "ioredis";

const cache = new Redis();

cache.once("ready", () => console.log("[Database/Cache] Redis started."));

export default cache;
