import { n } from "@/lib/utils";
import { sampleTenants } from "./DayTable";
import { type CalculationType } from "./CalculationTypeRadioGroup";

interface SummaryProps {
  tenants: string[];
  selectedDates: number[][];
  totalPrice: number;
  dates: Date[];
  calcType: CalculationType;
}

export const Summary = ({
  tenants,
  selectedDates,
  totalPrice,
  dates,
  calcType,
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
    let numDays = 0;
    dates.forEach((date) => {
      selectedDates.forEach((personDates) => {
        numDays += +personDates.includes(n(date));
      });
    });
    if (numDays === 0) {
      return Array(tenants.length).fill(
        totalPrice / tenants.length,
      ) as number[];
    }

    const dayPrice = totalPrice / numDays;
    const prices = Array(selectedDates.length).fill(0) as number[];
    dates.forEach((date) => {
      selectedDates.forEach((personDates, personIndex) => {
        if (personDates.includes(n(date))) {
          prices[personIndex] += dayPrice;
        }
      });
    });

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
            <tr
              key={personIndex}
              className="border-b-2 last:border-b-0 even:bg-muted"
            >
              <td className="">
                {name.length > 0 ? name : sampleTenants[personIndex]}
              </td>
              <td className="w-32 text-right">
                {getPrices()[personIndex]!.toFixed(2)} €
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
