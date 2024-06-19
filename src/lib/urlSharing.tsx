import { eachDayOfInterval } from "date-fns";
import { fromNString, n } from "./utils";
import { type PaymentType, type CalculationType } from "@/types/types";
import { type ReadonlyURLSearchParams } from "next/navigation";

const PARAM_START = "s";
const PARAM_END = "e";
const PARAM_TOTAL_PRICE = "p";
const PARAM_CALC_TYPE = "cm"; //calculation method
const CALC_TYPE_ENCODE: { [K in CalculationType]: string } = {
  perCalendarNight: "cn",
  perPersonNight: "pn",
};
const CALC_TYPE_DECODE: { [K: string]: CalculationType } = {
  cn: "perCalendarNight",
  pn: "perPersonNight",
};
const PARAM_PAYMENT_TYPE = "pm";
const PAYMENT_TYPE_ENCODE: { [K in PaymentType]: string } = {
  perNight: "n",
  perDay: "d",
};
const PAYMENT_TYPE_DECODE: { [K: string]: PaymentType } = {
  n: "perNight",
  d: "perDay",
};
const PARAM_TENANTS = "t";
const PARAM_SELECTED_DATES = "b"; //binary matrix

interface IParams {
  start: Date;
  end: Date;
  totalPrice: number;
  calcType: CalculationType;
  paymentType: PaymentType;
  tenants: string[];
  selectedDates: number[][];
}

export const encodeParams = ({
  start,
  end,
  totalPrice,
  calcType,
  paymentType,
  tenants,
  selectedDates,
}: IParams) => {
  const q =
    `?${PARAM_START}=${n(start)}` +
    `&${PARAM_END}=${n(end)}` +
    `&${PARAM_TOTAL_PRICE}=${totalPrice}` +
    `&${PARAM_CALC_TYPE}=${CALC_TYPE_ENCODE[calcType]}` +
    `&${PARAM_PAYMENT_TYPE}=${PAYMENT_TYPE_ENCODE[paymentType]}` +
    `&${PARAM_TENANTS}=${tenants.join(",")}` +
    `&${PARAM_SELECTED_DATES}=${getBinaryString(start, end, selectedDates)}`;
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

export const decodeParams = (params: ReadonlyURLSearchParams) => {
  const start = params.get(PARAM_START);
  const end = params.get(PARAM_END);
  const totalPrice = params.get(PARAM_TOTAL_PRICE);
  const calcType = CALC_TYPE_DECODE[params.get(PARAM_CALC_TYPE)!];
  const paymentType = PAYMENT_TYPE_DECODE[params.get(PARAM_PAYMENT_TYPE)!];
  const tenants = params.get(PARAM_TENANTS);
  const selectedDates = params.get(PARAM_SELECTED_DATES);

  if (
    !start ||
    !end ||
    !totalPrice ||
    !calcType ||
    !paymentType ||
    !tenants ||
    !selectedDates
  ) {
    return null;
  }

  try {
    const parsedStartDate = fromNString(start);
    const parsedEndDate = fromNString(end);
    const parsedTotalPrice = Number(totalPrice);
    const parsedCalcType = calcType as CalculationType;
    const parsedPaymentType = paymentType as PaymentType;
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
      start: parsedStartDate,
      end: parsedEndDate,
      totalPrice: parsedTotalPrice,
      calcType: parsedCalcType,
      paymentType: parsedPaymentType,
      tenants: parsedTenants,
      selectedDates: parsedSelectedDates,
    };
  } catch (e) {
    return null;
  }
};
