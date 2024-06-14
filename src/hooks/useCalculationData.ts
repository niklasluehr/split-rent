import { n } from "@/lib/utils";
import { useDataStore } from "@/store/store";
import { PaymentType } from "@/types/types";
import { addDays } from "date-fns";

export const useCalculationData = () => {
  const tenants = useDataStore((state) => state.tenants);
  const selectedDates = useDataStore((state) => state.selectedDates);
  const dates = useDataStore((state) => state.getDates());
  const paymentType = useDataStore((state) => state.paymentType);

  const binaryMatrix = getBinaryMatrix(
    paymentType,
    dates,
    tenants,
    selectedDates,
  );
  const numPersonNights = binaryMatrix
    .flat()
    .reduce((acc, curr) => acc + +curr, 0);
  const numNights = binaryMatrix.length;

  return { binaryMatrix, numPersonNights, numNights };
};

const getBinaryMatrix = (
  paymentType: PaymentType,
  dates: Date[],
  tenants: string[],
  selectedDates: number[][],
) => {
  if (paymentType === "perDay") {
    return dates.map((date) =>
      Array(tenants.length)
        .fill(false)
        .map((_, personIndex) => selectedDates[personIndex]!.includes(n(date))),
    );
  } else {
    return dates.slice(0, -1).map((date) =>
      Array(tenants.length)
        .fill(false)
        .map(
          (_, personIndex) =>
            selectedDates[personIndex]!.includes(n(date)) &&
            selectedDates[personIndex]!.includes(n(addDays(date, 1))),
        ),
    );
  }
};
