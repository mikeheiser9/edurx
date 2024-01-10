import { DateTimeFormatOptions } from "next-intl";
import { ErrorMessage } from "./constant";

export const convertUTCtoGMT = (utcTimestamp: string) => {
  const date = new Date(utcTimestamp);

  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "GMT",
    hour12: false,
  };

  const formattedDate = date.toLocaleDateString(
    "en-US",
    options as DateTimeFormatOptions
  );
  return formattedDate.replace(
    /(\d+)\/(\d+)\/(\d+), (\d+):(\d+):(\d+)/,
    "$1/$2/$3 @ $4:$5 GMT"
  );
};

export const getFieldnameAndErrorMessageBasedOnErrorString = (str: string) => {
  if (str) {
    if (str.trim().includes("-")) {
      let getStr: string[] = str.split("-");
      return { key: getStr[0], message: ErrorMessage[getStr[1]] };
    } else if (Object.keys(ErrorMessage).includes(str)) {
      return { key: "global", message: ErrorMessage[str] };
    }
    return { key: "global", message: str };
  }
};

export const capitalize = (str: string) => {
  if (typeof str !== "string" || str.length === 0) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};
