import { Platform } from "../bot/types/Utils";

export default function determineService(url: string): Platform | null {
  if (url.toLowerCase().includes("tg.esf.edu.hk/public/icalendar/callink.php"))
    return Platform.Gateway;
  else if (url.toLowerCase().includes("calendar.google.com/calendar/ical/"))
    return Platform.GCal;
  else if (url.toLowerCase().includes("calendar.socscms.com"))
    return Platform.GCal;
  else return null;
}
