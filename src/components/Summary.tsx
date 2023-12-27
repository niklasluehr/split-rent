import { n } from "@/lib/utils";
import { sampleTenants } from "./DayTable";
import { useDataStore } from "@/store/store";
import { addDays } from "date-fns";

export const Summary = () => {
  const totalPrice = useDataStore((state) => state.totalPrice);
  const tenants = useDataStore((state) => state.tenants);
  const selectedDates = useDataStore((state) => state.selectedDates);
  const calcType = useDataStore((state) => state.calcType);
  const dates = useDataStore((state) => state.getDates());
  const paymentType = useDataStore((state) => state.paymentType);

  const getBinaryMatrix = () => {
    if (paymentType === "perDay") {
      return dates.map((date) =>
        Array(tenants.length)
          .fill(false)
          .map((_, personIndex) =>
            selectedDates[personIndex]!.includes(n(date)),
          ),
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

  const getPricesSplitPerNight = () => {
    const binaryMatrix = getBinaryMatrix();
    const countVector = binaryMatrix.map((row) =>
      row.reduce((acc, curr) => acc + +curr, 0),
    );
    const dayPrice = totalPrice / countVector.length;

    const prices = Array(selectedDates.length).fill(0) as number[];
    binaryMatrix.forEach((row, dateIndex) => {
      if (!row.includes(true)) {
        prices.forEach((_, personIndex) => {
          prices[personIndex] += dayPrice / tenants.length;
        });
      } else {
        row.forEach((isSelected, personIndex) => {
          if (isSelected) {
            prices[personIndex] += dayPrice / countVector[dateIndex]!;
          }
        });
      }
    });

    return prices;
  };

  const getPricesSplitNumNights = () => {
    const binaryMatrix = getBinaryMatrix();
    const numDays = binaryMatrix.flat().reduce((acc, curr) => acc + +curr, 0);
    if (numDays === 0) {
      return Array(tenants.length).fill(
        totalPrice / tenants.length,
      ) as number[];
    }
    const dayPrice = totalPrice / numDays;
    const binaryMatrixT = binaryMatrix[0]!.map((_, colIndex) =>
      binaryMatrix.map((row) => row[colIndex]!),
    );
    const prices = binaryMatrixT.map(
      (row) => row.reduce((acc, curr) => acc + +curr, 0) * dayPrice,
    );
    return prices;
  };

  const getPrices = () => {
    if (calcType === "perNight") {
      return getPricesSplitPerNight();
    } else {
      return getPricesSplitNumNights();
    }
  };

  return (
    <>
      <table>
        <tbody className="">
          {tenants.map((name, personIndex) => (
            <tr key={personIndex} className="border-b-2 even:bg-muted">
              <td className="">
                {name.length > 0 ? name : sampleTenants[personIndex]}
              </td>
              <td className="w-32 text-right">
                {getPrices()[personIndex]!.toFixed(2)} €
              </td>
            </tr>
          ))}
          <tr className="text-[0.9375rem] font-bold">
            <td>Total</td>
            <td className="text-right">
              {getPrices()
                .reduce((acc, curr) => acc + curr, 0)
                .toFixed(2)}{" "}
              €
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
