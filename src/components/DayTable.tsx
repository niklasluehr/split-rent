"use client";
import { cn, n } from "@/lib/utils";
import { addDays, eachDayOfInterval } from "date-fns";
import format from "date-fns/format";
import {
  Check,
  CornerLeftDown,
  CornerLeftUp,
  PlusCircle,
  Trash2,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { Separator } from "./ui/separator";
import { Summary } from "./Summary";
import { CalculationTypeRadioGroup } from "./CalculationTypeRadioGroup";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { useDataStore } from "@/store/store";
import { PaymentTypeRadioGroup } from "./PaymentTypeRadioGroup";

export const sampleTenants = [
  "Alice",
  "Bob",
  "Claire",
  "David",
  "Eve",
  "Frank",
  "Grace",
  "Hans",
  "Ida",
  "Joe",
  "Kate",
  "Luke",
  "Mary",
  "Nick",
  "Olivia",
  "Paul",
  "Rose",
];

export const DayTable = () => {
  const tenants = useDataStore((state) => state.tenants);
  const addTenant = useDataStore((state) => state.addTenant);
  const removeTenant = useDataStore((state) => state.removeTenant);
  const changeTenantName = useDataStore((state) => state.changeTenantName);
  const dates = useDataStore((state) => state.getDates());
  const selectedDates = useDataStore((state) => state.selectedDates);
  const toggleCellSelection = useDataStore(
    (state) => state.toggleCellSelection,
  );
  const selectAll = useDataStore((state) => state.selectAll);
  const deselectAll = useDataStore((state) => state.deselectAll);

  const numPeople = tenants.length;

  const [selectionStart, setSelectionStart] = useState<(Date | null)[]>(
    Array(numPeople).fill(null),
  );

  const [showTutorial, setShowTutorial] = useState(true);

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
      datesToToggle.forEach((date) => toggleCellSelection(personIndex, date));
      clearSelectionStart();
      setShowTutorial(false);
    }
  };

  const clearSelectionStart = () => {
    setSelectionStart((prev) => prev.map(() => null));
  };

  const handleAddClick = () => {
    addTenant();
    setSelectionStart((prev) => [...prev, null]);
    setTimeout(() => lastInputRef.current?.focus(), 100);
  };

  const handleDeleteClick = (personIndex: number) => () => {
    removeTenant(personIndex);
    setSelectionStart((prev) => prev.filter((_, i) => i !== personIndex));
  };

  const isSelected = (personIndex: number, date: Date) => {
    const dateString = n(date);
    return selectedDates[personIndex]?.includes(dateString);
  };

  const isSelectionStart = (personIndex: number, date: Date) => {
    return selectionStart[personIndex]?.getTime() === date.getTime();
  };

  const isTableClear = () => {
    return selectedDates.every((dates) => dates.length === 0);
  };

  const getSelectionStartIndex = () => {
    return selectionStart.findIndex((date) => date !== null);
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
            {dates.map((date, dateIndex) => (
              <tr key={n(date)} className="even:bg-muted">
                <th className="min-w-[3.25rem] text-left text-sm font-normal">
                  {format(date, "LLL dd")}
                </th>
                {tenants.map((_, personIndex) => (
                  <td
                    onClick={() => handleClick(personIndex, date)}
                    className={cn(
                      "relative min-w-[2.5rem] cursor-pointer border-2 text-center text-sm leading-none text-muted-foreground",
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
                    {isTableClear() && showTutorial && (
                      <>
                        {getSelectionStartIndex() == -1 &&
                          personIndex === 0 &&
                          dateIndex === 0 && (
                            <TutorialHint text="click once to select start date" />
                          )}
                        {getSelectionStartIndex() == personIndex &&
                          dateIndex == Math.min(7, dates.length - 1) && (
                            <TutorialHint
                              text="click again to select end date"
                              arrowDown
                            />
                          )}
                      </>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="h-6" />

      {!isTableClear() && (
        <>
          <PaymentTypeRadioGroup />
          <div className="h-4" />
          <CalculationTypeRadioGroup />

          <div className="h-4" />

          <Summary />
        </>
      )}
    </>
  );
};

interface TutorialHintProps {
  text: string;
  arrowDown?: boolean;
}

const TutorialHint = ({ text, arrowDown }: TutorialHintProps) => (
  <div
    className={cn("absolute left-4 top-1 z-10 flex", {
      "-top-5": arrowDown,
    })}
  >
    {arrowDown ? (
      <CornerLeftDown size={30} className="text-primary-foreground" />
    ) : (
      <CornerLeftUp size={30} className="text-primary-foreground" />
    )}
    <span
      className={cn(
        "virgil absolute left-[1.625rem] top-2 rounded-2xl border-2 border-primary-foreground bg-primary px-3 py-2 text-primary-foreground",
        {
          "-top-3": arrowDown,
        },
      )}
    >
      {text}
    </span>
  </div>
);
