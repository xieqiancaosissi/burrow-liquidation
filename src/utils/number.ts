import Big from "big.js";
export function format_usd(n: string | number) {
  const number = Big(n || "0");
  if (number.abs().lt(0.0001)) {
    return number.lt(0) ? "<-$0.0001" : "<$0.0001";
  }

  if (number.lt(0)) {
    return "-$" + number.abs().toFixed(4);
  }

  return "$" + number.toFixed(4);
}

export const toReadableNumber = (
  decimals: number,
  number: string = "0"
): string => {
  if (!decimals) return number;

  const wholeStr = number.substring(0, number.length - decimals) || "0";
  const fractionStr = number
    .substring(number.length - decimals)
    .padStart(decimals, "0")
    .substring(0, decimals);

  return `${wholeStr}.${fractionStr}`.replace(/\.?0+$/, "");
};

export const toNonDivisibleNumber = (
  decimals: number,
  number: string
): string => {
  if (decimals === null || decimals === undefined) return number;
  const [wholePart, fracPart = ""] = number.split(".");

  return `${wholePart}${fracPart.padEnd(decimals, "0").slice(0, decimals)}`
    .replace(/^0+/, "")
    .padStart(1, "0");
};
