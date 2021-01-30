const capitalize = (str: string) => `${str[0].toUpperCase()}${str.slice(1)}`;

const monthNames = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const monthNameToNumber = (monthName: string) => {
  const index = monthNames.indexOf(capitalize(monthName));

  if (index === -1) {
    throw new Error(`${monthName} is not a valid month`);
  }

  return index;
};

export const monthNumberToName = (monthNumber: number) => {
  if (monthNumber < 1 || monthNumber > 12) {
    throw new Error(`${monthNumber} is not a valid month`);
  }
  return monthNames[monthNumber];
};
