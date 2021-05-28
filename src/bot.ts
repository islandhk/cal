import Client from "./bot/client/Client";
import settings from "./bot/settings";
import { connect } from "mongoose";

const client: Client = new Client();
client.start();

connect(settings.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("[Database] Connected to MongoDB."));
