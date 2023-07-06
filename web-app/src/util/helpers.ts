const getInputDateFormat = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

const getStaticImageUrl = (uri: string): string => {
  return `${process.env.NEXT_PUBLIC_SERVER_URL}/uploads/${uri}`;
};

export { getInputDateFormat, getStaticImageUrl };
