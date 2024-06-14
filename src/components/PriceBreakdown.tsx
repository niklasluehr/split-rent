"use client";
import { useCalculationData } from "@/hooks/useCalculationData";
import { useDataStore } from "@/store/store";
import { ChevronDown, ChevronRight } from "lucide-react";
import Collapsible from "react-collapsible";
import { sampleTenants } from "./DayTable";

export const PriceBreakdown = () => {
  const calcType = useDataStore((state) => state.calcType);

  return (
    <>
      <Collapsible
        transitionTime={200}
        className="overflow-hidden transition-all duration-200 ease-in-out"
        trigger={
          <div className="flex items-center text-sm">
            <ChevronRight size={16} />
            <span className="hover:underline">Show price breakdown</span>
          </div>
        }
        triggerWhenOpen={
          <div className="flex items-center text-sm">
            <ChevronDown size={16} />
            <span className="hover:underline">Hide price breakdown</span>
          </div>
        }
      >
        {calcType === "perNight" ? (
          <BreakdownPerNight />
        ) : (
          <BreakdownNumNights />
        )}
      </Collapsible>
    </>
  );
};

const BreakdownPerNight = () => {
  return <></>;
};

const BreakdownNumNights = () => {
  const totalPrice = useDataStore((state) => state.totalPrice);
  const tenants = useDataStore((state) => state.tenants);
  const { binaryMatrix, numPersonNights } = useCalculationData();
  const pricePerNight = totalPrice / numPersonNights;
  const binaryMatrixT = binaryMatrix[0]!.map((_, colIndex) =>
    binaryMatrix.map((row) => row[colIndex]!),
  );
  const personNightsArray = binaryMatrixT.map((row) =>
    row.reduce((acc, curr) => acc + +curr, 0),
  );
  const paymentType = useDataStore((state) => state.paymentType);
  const dayOrNight = paymentType === "perNight" ? "night" : "day";

  return (
    <>
      <div className="">
        <p>{`Price per person-${dayOrNight}:`}</p>
        <p>{`${totalPrice}€ / ${numPersonNights} person-${dayOrNight}s = ${pricePerNight.toFixed(
          2,
        )}€`}</p>
      </div>
      <table className="w-full sm:w-fit">
        <tbody className="">
          {tenants.map((name, personIndex) => (
            <tr key={personIndex} className="border-b-2 even:bg-muted">
              <td className="">
                {name.length > 0 ? name : sampleTenants[personIndex]}
              </td>
              <td className="pl-4 text-right">
                {personNightsArray[personIndex] === 0
                  ? `0 ${dayOrNight}s`
                  : `${
                      personNightsArray[personIndex]
                    } ${dayOrNight}s * ${pricePerNight.toFixed(2)}€`}
              </td>
              <td className="pl-4 text-right font-bold">
                {(personNightsArray[personIndex]! * pricePerNight).toFixed(2)} €
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
