import { eachDayOfInterval } from "date-fns";
import { fromNString, n } from "./utils";
import { PaymentType, type CalculationType } from "@/types/types";

const PARAM_START = "s";
const PARAM_END = "e";
const PARAM_TOTAL_PRICE = "p";
const PARAM_CALC_TYPE = "cm";
const PARAM_PAYMENT_TYPE = "pm";
const PARAM_TENANTS = "t";
const PARAM_SELECTED_DATES = "b";

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
    `&${PARAM_CALC_TYPE}=${calcType}` +
    `&${PARAM_PAYMENT_TYPE}=${paymentType}` +
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

export const decodeParams = (query: string) => {
  const params = new URLSearchParams(query);
  const start = params.get(PARAM_START);
  const end = params.get(PARAM_END);
  const totalPrice = params.get(PARAM_TOTAL_PRICE);
  const calcType = params.get(PARAM_CALC_TYPE);
  const paymentType = params.get(PARAM_PAYMENT_TYPE);
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
      parsedStartDate,
      parsedEndDate,
      parsedTotalPrice,
      parsedCalcType,
      parsedPaymentType,
      parsedTenants,
      parsedSelectedDates,
    };
  } catch (e) {
    return null;
  }
};
