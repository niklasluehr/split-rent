import { n } from "@/lib/utils";
import { sampleTenants } from "./DayTable";

interface SummaryProps {
  tenants: string[];
  selectedDates: number[][];
  totalPrice: number;
  dates: Date[];
}

export const Summary = ({
  tenants,
  selectedDates,
  totalPrice,
  dates,
}: SummaryProps) => {
  const dayPrice = totalPrice / dates.length;

  const getPricesSplitPerNight = () => {
    const binaryMatrix = dates.map((date) =>
      Array(tenants.length)
        .fill(false)
        .map((_, personIndex) => selectedDates[personIndex]!.includes(n(date))),
    );
    const countVector = binaryMatrix.map((row) =>
      row.reduce((acc, curr) => acc + +curr, 0),
    );

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
    const numDays = selectedDates.reduce((acc, curr) => acc + curr.length, 0);
    if (numDays === 0) {
      return Array(tenants.length).fill(totalPrice / tenants.length);
    }
    const dayPrice = totalPrice / numDays;
    const prices = selectedDates.map((dates) => dates.length * dayPrice);
    console.log(prices);
    return prices;
  };

  return (
    <>
      {/* <span>Daily Price: {dayPrice.toFixed(2)} €</span> */}
      <table>
        <tbody>
          {tenants.map((name, personIndex) => (
            <tr key={personIndex}>
              <td className="">
                {name.length > 0 ? name : sampleTenants[personIndex]}
              </td>
              <td className="w-28 text-right">
                {getPricesSplitNumNights()[personIndex]!.toFixed(2)} €
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
