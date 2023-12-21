import { eachDayOfInterval } from "date-fns";
import { fromNString, n } from "./utils";
import { type CalculationType } from "@/types/types";

interface IParams {
  start: Date;
  end: Date;
  totalPrice: number;
  calcMethod: CalculationType;
  tenants: string[];
  selectedDates: number[][];
}

export const encodeParams = ({
  start,
  end,
  totalPrice,
  calcMethod,
  tenants,
  selectedDates,
}: IParams) => {
  const q =
    `?s=${n(start)}` +
    `&e=${n(end)}` +
    `&p=${totalPrice}` +
    `&m=${calcMethod}` +
    `&t=${tenants.join(",")}` +
    `&b=${getBinaryString(start, end, selectedDates)}`;
  return q;
};

const getBinaryString = (start: Date, end: Date, selectedDates: number[][]) => {
  const dates = eachDayOfInterval({ start, end });
  const binaryMatrix = Array(selectedDates.length) as number[][];

  selectedDates.forEach((tenantDates, tenantIndex) => {
    binaryMatrix[tenantIndex] = Array(dates.length) as number[];
    dates.forEach((date, dateIndex) => {
      binaryMatrix[tenantIndex]![dateIndex] = +tenantDates.includes(n(date));
    });
  });

  return binaryMatrix.map((row) => row.join("")).join(",");
};

export const decodeParams = (query: string) => {
  const params = new URLSearchParams(query);
  const start = params.get("s");
  const end = params.get("e");
  const totalPrice = params.get("p");
  const calcMethod = params.get("m");
  const tenants = params.get("t");
  const selectedDates = params.get("b");

  if (
    !start ||
    !end ||
    !totalPrice ||
    !calcMethod ||
    !tenants ||
    !selectedDates
  ) {
    return null;
  }

  try {
    const parsedStartDate = fromNString(start);
    const parsedEndDate = fromNString(end);
    const parsedTotalPrice = Number(totalPrice);
    const parsedCalcMethod = calcMethod as CalculationType;
    const parsedTenants = tenants.split(",");

    const dates = eachDayOfInterval({
      start: parsedStartDate,
      end: parsedEndDate,
    });
    const parsedSelectedDates = Array(parsedTenants.length) as number[][];
    parsedTenants.forEach((_, i) => {
      parsedSelectedDates[i] = [] as number[];
    });
    const cols = selectedDates.split(",");
    dates.forEach((date, dateIndex) => {
      cols.forEach((col, tenantIndex) => {
        if (col.charAt(dateIndex) === "1") {
          parsedSelectedDates[tenantIndex]!.push(n(date));
        }
      });
    });

    return {
      parsedStartDate,
      parsedEndDate,
      parsedTotalPrice,
      parsedCalcMethod,
      parsedTenants: parsedTenants,
      parsedSelectedDates,
    };
  } catch (e) {
    return null;
  }
};
