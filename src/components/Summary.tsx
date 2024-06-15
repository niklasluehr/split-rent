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
  const [showBreakdown, setShowBreakdown] = useState(false);

  const { binaryMatrix, numPersonNights } = useCalculationData();
  const binaryMatrixT = binaryMatrix[0]!.map((_, colIndex) =>
    binaryMatrix.map((row) => row[colIndex]!),
  );
  const countVector = binaryMatrix.map((row) =>
    row.reduce((acc, curr) => acc + +curr, 0),
  );

  const getPricesSplitPerCalendarNight = () => {
    const nightPrice = totalPrice / countVector.length;

    const prices = Array(selectedDates.length).fill(0) as number[];
    binaryMatrix.forEach((row, dateIndex) => {
      if (!row.includes(true)) {
        prices.forEach((_, personIndex) => {
          prices[personIndex] += nightPrice / tenants.length;
        });
      } else {
        row.forEach((isSelected, personIndex) => {
          if (isSelected) {
            prices[personIndex] += nightPrice / countVector[dateIndex]!;
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
    const nightPrice = totalPrice / numPersonNights;
    const prices = binaryMatrixT.map(
      (row) => row.reduce((acc, curr) => acc + +curr, 0) * nightPrice,
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

  const getPersonNightsArray = () => {
    return binaryMatrixT.map((row) =>
      row.reduce((acc, curr) => acc + +curr, 0),
    );
  };

  const getCalendarNightsMatrix = () => {
    const calendarNightsMatrix = Array(tenants.length) as number[][];
    tenants.forEach((_, personIndex) => {
      const tenantArray = Array(tenants.length).fill(0) as number[];
      countVector.forEach((count, dateIndex) => {
        if (binaryMatrix[dateIndex]![personIndex]) {
          tenantArray[count - 1]++;
        }
      });
      calendarNightsMatrix[personIndex] = tenantArray;
    });
    return calendarNightsMatrix;
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
                {showBreakdown &&
                  (calcType === "perPersonNight" ? (
                    <BreakdownPerPersonNight
                      personNights={getPersonNightsArray()[personIndex]!}
                    />
                  ) : (
                    <BreakDownPerCalendarNight
                      arrayToName={getCalendarNightsMatrix()[personIndex]!}
                    />
                  ))}
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

interface BreakdownPerCalendarNightProps {
  arrayToName: number[];
}

const BreakDownPerCalendarNight = ({
  arrayToName,
}: BreakdownPerCalendarNightProps) => {
  const totalPrice = useDataStore((state) => state.totalPrice);
  const { numCalendarNights } = useCalculationData();
  const pricePerNight = totalPrice / numCalendarNights;
  const { xDaysOrNights } = useDayOrNight();

  const withXPersons = (numCoTenants: number) => {
    if (numCoTenants === 0) {
      return "alone";
    }
    return `w/ ${numCoTenants + 1} person${numCoTenants === 0 ? "" : "s"}`;
  };

  const pricePerNightWithCoTenants = (numCoTenants: number) =>
    (pricePerNight / (numCoTenants + 1)).toFixed(2);

  return (
    <>
      <td className="pl-2 pr-1 text-left text-sm leading-snug sm:pl-12">
        {arrayToName.map(
          (numNights, numCoTenants) =>
            numNights > 0 && (
              <div>
                {`${xDaysOrNights(numNights)} ${withXPersons(numCoTenants)}`}
              </div>
            ),
        )}
      </td>
      <td className="pl-1 pr-2 text-right text-sm leading-snug sm:pr-12">
        {arrayToName.map(
          (numNights, numCoTenants) =>
            numNights > 0 && (
              <div>
                {`${numNights}*${pricePerNightWithCoTenants(numCoTenants)}€`}
              </div>
            ),
        )}
      </td>
    </>
  );
};
