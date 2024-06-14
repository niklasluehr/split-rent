import { sampleTenants } from "./DayTable";
import { useDataStore } from "@/store/store";
import { ShareDialog } from "./ShareDialog";
import { PriceBreakdown } from "./PriceBreakdown";
import { useCalculationData } from "@/hooks/useCalculationData";

export const Summary = () => {
  const totalPrice = useDataStore((state) => state.totalPrice);
  const tenants = useDataStore((state) => state.tenants);
  const selectedDates = useDataStore((state) => state.selectedDates);
  const calcType = useDataStore((state) => state.calcType);
  const { binaryMatrix, numPersonNights } = useCalculationData();

  const getPricesSplitPerNight = () => {
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
    if (numPersonNights === 0) {
      return Array(tenants.length).fill(
        totalPrice / tenants.length,
      ) as number[];
    }
    const dayPrice = totalPrice / numPersonNights;
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
      <div className="mb-4 flex items-center gap-12">
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
        <ShareDialog />
      </div>
      <PriceBreakdown />
    </>
  );
};
