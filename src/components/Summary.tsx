"use client";

import { sampleTenants } from "./DayTable";
import { useDataStore } from "@/store/store";
import { ShareDialog } from "./ShareDialog";
import { PriceBreakdown } from "./PriceBreakdown";
import { useCalculationData } from "@/hooks/useCalculationData";
import { useState } from "react";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";

export const Summary = () => {
  const totalPrice = useDataStore((state) => state.totalPrice);
  const tenants = useDataStore((state) => state.tenants);
  const selectedDates = useDataStore((state) => state.selectedDates);
  const calcType = useDataStore((state) => state.calcType);

  const { binaryMatrix, numPersonNights } = useCalculationData();
  const binaryMatrixT = binaryMatrix[0]!.map((_, colIndex) =>
    binaryMatrix.map((row) => row[colIndex]!),
  );
  const paymentType = useDataStore((state) => state.paymentType);
  const dayOrNight = paymentType === "perNight" ? "night" : "day";

  const [showBreakdown, setShowBreakdown] = useState(false);

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
      <div className="mb-4">
        <div className="mb-4 flex items-center gap-2">
          <Switch
            id="show-breakdown"
            checked={showBreakdown}
            onCheckedChange={() => setShowBreakdown((prev) => !prev)}
          />
          <Label className="hover:cursor-pointer" htmlFor="show-breakdown">
            Show price breakdown
          </Label>
        </div>
        <table>
          <tbody className="">
            {tenants.map((name, personIndex) => (
              <tr
                key={personIndex}
                className={cn("border-b-2 even:bg-muted", {
                  "border-b-foreground": personIndex === tenants.length - 1,
                })}
              >
                <td className="">
                  {name.length > 0 ? name : sampleTenants[personIndex]}
                </td>
                {showBreakdown && calcType === "numNights" && (
                  <BreakdownPerPersonNight personIndex={personIndex} />
                )}
                <td
                  className={cn("pl-16 text-right", {
                    "pl-0 font-bold": showBreakdown,
                  })}
                >
                  {getPrices()[personIndex]!.toFixed(2)} €
                </td>
              </tr>
            ))}
            <tr className="text-[0.9375rem] font-bold">
              <td>Total</td>
              {showBreakdown && (
                <td className="px-8 text-left sm:px-16">
                  {calcType === "numNights" &&
                    `${numPersonNights} person-${dayOrNight}s`}
                </td>
              )}
              <td className="text-right">
                {getPrices()
                  .reduce((acc, curr) => acc + curr, 0)
                  .toFixed(2)}{" "}
                €
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <ShareDialog />
      {/* <PriceBreakdown /> */}
    </>
  );
};

interface BreakdownPerPersonNightProps {
  personIndex: number;
}

const BreakdownPerPersonNight = ({
  personIndex,
}: BreakdownPerPersonNightProps) => {
  const totalPrice = useDataStore((state) => state.totalPrice);
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
    <td className="px-8 text-left sm:px-16">
      {personNightsArray[personIndex] === 0
        ? `0 ${dayOrNight}s`
        : `${
            personNightsArray[personIndex]
          } ${dayOrNight}s * ${pricePerNight.toFixed(2)}€`}
    </td>
  );
};
