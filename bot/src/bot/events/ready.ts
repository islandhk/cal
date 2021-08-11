import Event from "../struct/Event";
import { SlashCommandRegistry } from "../struct/registries/export/RegistryIndex";

abstract class ReadyEvent extends Event {
  constructor() {
    super({
      name: "ready",
      once: true,
    });
  }

  async exec() {
    console.log("[Bot] Ready.");
    this.client.user?.setActivity("your calendar", { type: "WATCHING" });
    SlashCommandRegistry(this.client);
  }
}

export default ReadyEvent;
