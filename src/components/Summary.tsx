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

  const getPrices = () => {
    const binaryMatrix = dates.map((date) =>
      Array(tenants.length)
        .fill(false)
        .map((_, personIndex) => selectedDates[personIndex]!.includes(n(date))),
    );
    console.log(binaryMatrix);
    const prices = Array(selectedDates.length).fill(0);
    dates.forEach((date) => {});

    return prices;
  };

  return (
    <>
      <span>Daily Price: {dayPrice}</span>
      <span>Prices: {getPrices()}</span>
      <table>
        <tbody>
          {tenants.map((name, personIndex) => (
            <tr key={personIndex}>
              <td className="">
                {name.length > 0 ? name : sampleTenants[personIndex]}
              </td>
              <td className="w-24 text-right">{} €</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
