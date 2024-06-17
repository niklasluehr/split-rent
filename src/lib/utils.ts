import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import format from "date-fns/format";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const n = (date: Date) => Number(format(date, "yyyyMMdd"));

export const fromNString = (s: string) => {
  return new Date(
    Number(s.slice(0, 4)),
    Number(s.slice(4, 6)) - 1,
    Number(s.slice(6, 8)),
  );
};

export function toLocaleFixed(num: number) {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
