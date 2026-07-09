import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Phnom_Penh");

export const formatDob = (date: string | Date) => {
    return dayjs(date).format("DD-MM-YYYY");
}

export const formatCreatedDateTime = (date: string | Date) => {
    return dayjs(date).format("DD-MM-YYYY HH:mm");
}
