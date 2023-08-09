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

const getFullName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`;
};

const boldOnSearch = (text: string, search: string) => {
  if (!search) {
    return text;
  }
  const index = text.toLowerCase().indexOf(search.toLowerCase());
  if (index === -1) {
    return text;
  }
  const first = text.slice(0, index);
  const middle = text.slice(index, index + search.length);
  const last = text.slice(index + search.length);
  return (
    <>
      {first}
      <b>{middle}</b>
      {last}
    </>
  );
};

export { getInputDateFormat, getStaticImageUrl, getFullName, boldOnSearch };
