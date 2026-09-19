import { RandomNumberCreation } from "./RandomNumberCreation.utils";

export const AccountNumberCreation = async (input: any) => {
  const result = await RandomNumberCreation(input);
  console.log(result);
  console.log(typeof result);
  let i,
    total = 0;
  for (i = 0; i < 15; i++) {
    total += Number(String(result)[i]);
  }

  const UnitDigit = total % 10;

  const checkdigit = UnitDigit === 0 ? 0 : 10 - UnitDigit;

  const finalAns = String(result) + checkdigit;
  return finalAns;
};
