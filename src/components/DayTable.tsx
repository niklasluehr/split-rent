"use client";
import { cn, n } from "@/lib/utils";
import { addDays, eachDayOfInterval } from "date-fns";
import format from "date-fns/format";
import { Check, PlusCircle, Trash2, X } from "lucide-react";
import { useRef, useState } from "react";
import { Separator } from "./ui/separator";
import { Summary } from "./Summary";
import {
  type CalculationType,
  CalculationTypeRadioGroup,
} from "./CalculationTypeRadioGroup";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

export const sampleTenants = [
  "Alice",
  "Bob",
  "Charlie",
  "David",
  "Eve",
  "Frank",
  "Grace",
  "Heidi",
  "Ivan",
  "Judy",
  "Mallory",
  "Oscar",
  "Peggy",
  "Sybil",
  "Trent",
  "Victor",
  "Walter",
];

interface DayTableProps {
  startDate: Date;
  addTenant: () => void;
  removeTenant: (index: number) => void;
  changeTenantName: (index: number, name: string) => void;
  endDate: Date;
  tenants: string[];
  totalPrice: number;
}

export const DayTable = ({
  tenants,
  addTenant,
  removeTenant,
  changeTenantName,
  startDate,
  endDate,
  totalPrice,
}: DayTableProps) => {
  const numPeople = tenants.length;
  const [selectedDates, setSelectedDates] = useState<number[][]>(
    Array(numPeople).fill([]),
  );

  const [selectionStart, setSelectionStart] = useState<(Date | null)[]>(
    Array(numPeople).fill(null),
  );

  const [calcType, setCalcType] = useState<CalculationType>("perNight");
  const dates = eachDayOfInterval({ start: startDate, end: endDate });

  const lastInputRef = useRef<HTMLInputElement>(null);

  const handleClick = (personIndex: number, date: Date) => {
    if (selectionStart[personIndex] === null) {
      setSelectionStart((prev) =>
        prev.map((_, i) => (i === personIndex ? date : null)),
      );
    } else {
      const a = selectionStart[personIndex]!;
      const b = date;
      const [start, end] = a < b ? [a, b] : [b, a];
      const datesToToggle = eachDayOfInterval({ start, end });
      setSelectedDates;
      datesToToggle.forEach((date) => toggleCellSelection(personIndex, date));
      setSelectionStart((prev) => prev.map(() => null));
    }
  };

  const handleAddClick = () => {
    addTenant();
    setSelectedDates((prev) => [...prev, []]);
    setSelectionStart((prev) => [...prev, null]);
    setTimeout(() => lastInputRef.current?.focus(), 100);
  };

  const handleDeleteClick = (personIndex: number) => () => {
    removeTenant(personIndex);
    setSelectedDates((prev) => prev.filter((_, i) => i !== personIndex));
    setSelectionStart((prev) => prev.filter((_, i) => i !== personIndex));
  };

  const toggleCellSelection = (personIndex: number, date: Date) => {
    const dateString = n(date);
    if (!selectedDates[personIndex]!.includes(dateString)) {
      setSelectedDates((prev) => {
        const newSelectedDates = [...prev];
        newSelectedDates[personIndex] = [
          ...prev[personIndex]!,
          dateString,
        ].sort();
        return newSelectedDates;
      });
    } else {
      setSelectedDates((prev) => {
        const newSelectedDates = [...prev];
        newSelectedDates[personIndex] = prev[personIndex]!.filter(
          (d) => d !== dateString,
        );
        return newSelectedDates;
      });
    }
  };

  const selectAll = (personIndex: number) => {
    setSelectedDates((prev) => {
      const newSelectedDates = [...prev];
      newSelectedDates[personIndex] = dates.map((date) => n(date));
      return newSelectedDates;
    });
  };

  const deselectAll = (personIndex: number) => {
    setSelectedDates((prev) => {
      const newSelectedDates = [...prev];
      newSelectedDates[personIndex] = [];
      return newSelectedDates;
    });
  };

  const isSelected = (personIndex: number, date: Date) => {
    const dateString = n(date);
    return selectedDates[personIndex]?.includes(dateString);
  };

  const isSelectionStart = (personIndex: number, date: Date) => {
    return selectionStart[personIndex]?.getTime() === date.getTime();
  };

  const isRangeStart = (personIndex: number, date: Date) => {
    const dateString = n(date);
    const nextDay = addDays(date, 1);
    return (
      selectedDates[personIndex]!.includes(dateString) &&
      !selectedDates[personIndex]!.includes(n(nextDay))
    );
  };

  const isRangeEnd = (personIndex: number, date: Date) => {
    const dateString = n(date);
    const prevDay = addDays(date, -1);
    return (
      selectedDates[personIndex]!.includes(dateString) &&
      !selectedDates[personIndex]!.includes(n(prevDay))
    );
  };

  const getText = (personIndex: number, date: Date) => {
    if (
      isRangeEnd(personIndex, date) ||
      isRangeStart(personIndex, date) ||
      isSelectionStart(personIndex, date)
    ) {
      return date.getDate() + ".";
    } else {
      return "";
    }
  };

  return (
    <>
      <ScrollArea className="whitespace-nowrap pb-2">
        <table className="border-separate pr-1">
          <tbody>
            <tr>
              <td></td>
              {tenants.map((_, personIndex) => (
                <th className="w-14 px-0.5 font-normal" key={personIndex}>
                  <div className="flex flex-col items-center justify-center">
                    <button
                      disabled={personIndex < 2}
                      className="text-destructive disabled:text-gray-400"
                      tabIndex={-1}
                      onClick={handleDeleteClick(personIndex)}
                    >
                      <Trash2 size={20} />
                    </button>
                    <Separator className="mb-1 mt-2" />
                    <button
                      tabIndex={-1}
                      onClick={() => selectAll(personIndex)}
                    >
                      <Check size={26} className="text-green-900" />
                    </button>
                    <button
                      tabIndex={-1}
                      onClick={() => deselectAll(personIndex)}
                    >
                      <X size={26} className="text-destructive" />
                    </button>
                    <input
                      ref={
                        personIndex === tenants.length - 1 ? lastInputRef : null
                      }
                      className="w-full bg-background text-center"
                      placeholder={sampleTenants[personIndex]}
                      value={tenants[personIndex]}
                      onChange={(e) =>
                        changeTenantName(personIndex, e.target.value)
                      }
                      onFocus={(e) => e.target.select()}
                    />
                  </div>
                </th>
              ))}
              <th className="pl-2">
                <button onClick={handleAddClick}>
                  <PlusCircle size={20} className="text-primary" />
                </button>
              </th>
            </tr>
            {dates.map((date) => (
              <tr key={n(date)} className="even:bg-muted">
                <th className="min-w-[3.5rem] pr-2 text-sm font-normal">
                  {format(date, "LLL dd")}
                </th>
                {tenants.map((_, personIndex) => (
                  <td
                    onClick={() => handleClick(personIndex, date)}
                    className={cn(
                      "min-w-[2.5rem] cursor-pointer border-2 text-center text-sm leading-none text-muted-foreground",
                      {
                        "bg-primary": isSelected(personIndex, date),
                        "border-dashed border-foreground ": isSelectionStart(
                          personIndex,
                          date,
                        ),
                      },
                    )}
                    key={`${n(date)}-${personIndex}`}
                  >
                    {getText(personIndex, date)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="h-6" />

      {selectedDates.some((dates) => dates.length > 0) && (
        <>
          <CalculationTypeRadioGroup
            calcType={calcType}
            setCalcType={setCalcType}
          />

          <div className="h-4" />

          <Summary
            tenants={tenants}
            selectedDates={selectedDates}
            totalPrice={totalPrice}
            dates={dates}
            calcType={calcType}
          />
        </>
      )}
    </>
  );
};
