import { DateTimeFormatOptions } from "next-intl";

export const convertUTCtoGMT = (utcTimestamp: string) => {
    const date = new Date(utcTimestamp);

    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'GMT',
        hour12: false,
    };

    const formattedDate = date.toLocaleDateString('en-US', options as DateTimeFormatOptions);
    return formattedDate.replace(/(\d+)\/(\d+)\/(\d+), (\d+):(\d+):(\d+)/, '$1/$2/$3 @ $4:$5 GMT');
}