import { countryData } from "./Constants";

export const getCurrencyByCountry = (country: string) => {
  const index = countryData.findIndex(
    (element) => element.name.common === country
  );
  let value = { ...countryData[index].currencies };
  let filteredValue = Object.values(value)[0];
  return `${filteredValue.name}_${filteredValue.symbol}`;
};

export const sortArrayAscending = (array: any) => {
  return array.sort((a: any, b: any) => {
    const nameA = a.name.common.toUpperCase(); // Convert names to uppercase for case-insensitive sorting
    const nameB = b.name.common.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0; // Names are equal
  });
};
