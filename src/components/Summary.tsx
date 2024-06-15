"use client";

import { sampleTenants } from "./DayTable";
import { useDataStore } from "@/store/store";
import { ShareDialog } from "./ShareDialog";
import { useCalculationData } from "@/hooks/useCalculationData";
import { useState } from "react";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";
import { useDayOrNight } from "@/hooks/useDayOrNight";

export const Summary = () => {
  const totalPrice = useDataStore((state) => state.totalPrice);
  const tenants = useDataStore((state) => state.tenants);
  const selectedDates = useDataStore((state) => state.selectedDates);
  const calcType = useDataStore((state) => state.calcType);

  const { xDaysOrNightsWithType } = useDayOrNight();

  const { binaryMatrix, numPersonNights } = useCalculationData();
  const binaryMatrixT = binaryMatrix[0]!.map((_, colIndex) =>
    binaryMatrix.map((row) => row[colIndex]!),
  );
  const personNightsArray = binaryMatrixT.map((row) =>
    row.reduce((acc, curr) => acc + +curr, 0),
  );

  const [showBreakdown, setShowBreakdown] = useState(false);

  const getPricesSplitPerCalendarNight = () => {
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

  const getPricesSplitPerPersonNights = () => {
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
    if (calcType === "perCalendarNight") {
      return getPricesSplitPerCalendarNight();
    } else {
      return getPricesSplitPerPersonNights();
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
        <table
          className={cn("whitespace-nowrap", {
            "w-full sm:w-fit": showBreakdown,
          })}
        >
          <tbody className="">
            {tenants.map((name, personIndex) => (
              <tr
                key={personIndex}
                className={cn("border-b-2 even:bg-muted", {
                  "border-b-foreground": personIndex === tenants.length - 1,
                })}
              >
                <td className="w-1/2">
                  {name.length > 0 ? name : sampleTenants[personIndex]}
                </td>
                {showBreakdown && calcType === "perPersonNight" && (
                  <BreakdownPerPersonNight
                    personNights={personNightsArray[personIndex]!}
                  />
                )}
                <td
                  className={cn("w-1/2 pl-4 text-right", {
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
                <>
                  <td colSpan={2} className="pl-8 text-left sm:pl-16">
                    {calcType === "perPersonNight" &&
                      xDaysOrNightsWithType(numPersonNights)}
                  </td>
                </>
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
    </>
  );
};

interface BreakdownPerPersonNightProps {
  personNights: number;
}

const BreakdownPerPersonNight = ({
  personNights,
}: BreakdownPerPersonNightProps) => {
  const totalPrice = useDataStore((state) => state.totalPrice);
  const { numPersonNights } = useCalculationData();
  const pricePerNight = totalPrice / numPersonNights;
  const { xDaysOrNights } = useDayOrNight();

  return (
    <>
      <td className="pl-8 text-left sm:pl-16">{xDaysOrNights(personNights)}</td>
      <td className="pr-8 text-right sm:pr-16">
        {personNights === 0 ? "" : `* ${pricePerNight.toFixed(2)}€`}
      </td>
    </>
  );
};
