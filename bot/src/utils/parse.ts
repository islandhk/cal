import { parseICS } from "ical";

export default function parse(data: string) {
  return parseICS(data);
}
