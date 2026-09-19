import { randomInt } from "node:crypto";

export const RandomNumberCreation = async (input: any) => {
  // const min = 10 ** (input - 1);
  // const max = 10 ** input;

  let i;
  let result = "";
  for (i = 0; i < input; i++) {
    result += randomInt(0, 10).toString();
  }
  // return randomInt(min, max);
  return result;
};
