import Event from "../struct/Event";

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
  }
}

export default ReadyEvent;
