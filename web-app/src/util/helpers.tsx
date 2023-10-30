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

const getFullName = (
  firstName: string = "",
  lastName: string = "",
  joinWith: string = " "
): string => {
  return `${firstName}${joinWith}${lastName}`;
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

const areArraysEqual = (array1: string[], array2: string[]) => {
  if (array1?.length !== array2?.length) {
    return false;
  }

  const sortedArray1 = [...array1].sort();
  const sortedArray2 = [...array2].sort();

  for (let i = 0; i < sortedArray1.length; i++) {
    if (sortedArray1[i] !== sortedArray2[i]) {
      return false;
    }
  }

  return true;
};

const removeSubstring = (
  inputString: string,
  substringToRemove: string
): string => {
  const regex = new RegExp(substringToRemove, "g");
  const resultString = inputString.replace(regex, "");

  return resultString;
};

export {
  getInputDateFormat,
  getStaticImageUrl,
  getFullName,
  boldOnSearch,
  areArraysEqual,
  removeSubstring,
};
