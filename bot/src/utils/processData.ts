import { User } from "discord.js";
import { FullCalendar } from "ical";
import { EventArray } from "../bot/types/Events";
import { Platform } from "../bot/types/Utils";
import getCalendarFormat from "./getCalendarFormat";

export default async function processData(data: FullCalendar, user: User) {
  let date = new Date();
  let result: EventArray = [];

  const calendarFormat = await getCalendarFormat(user);

  if (calendarFormat === Platform.Gateway) {
    for (let event in data) {
      const info = data[event];

      if (info.start?.toDateString() == date.toDateString()) {
        result.push({
          name: info.description!,
          when: info.start!.toLocaleString(),
          location: info.location! + ",",
        });
      }
    }
  } else if (calendarFormat === Platform.GCal) {
    for (let event in data) {
      const info = data[event];

      if (info.start?.toDateString() == date.toDateString()) {
        result.push({
          name: info.summary!,
          when: info.start!.toLocaleString(),
          location:
            info.location == undefined || info.location == ""
              ? ""
              : info.location! + ",",
        });
      }
    }
  }
  return result;
}
