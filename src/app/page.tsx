"use client";

import { DateRangePicker } from "@/components/DateRangePicker";
import { DayTable } from "@/components/DayTable";
import { PriceInput } from "@/components/PriceInput";
import { useState } from "react";
import { DateRange } from "react-day-picker";

export default function HomePage() {
  const [names, setNames] = useState<string[]>(["John", "Tim", "Max"]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  return (
    <main className="px-4 pt-4">
      <div className="flex flex-col gap-3">
        <DateRangePicker updateDate={setDateRange} />
        <PriceInput updatePrice={setTotalPrice} />
      </div>

      <div className="h-10"></div>
      {dateRange && (
        <DayTable
          names={names}
          startDate={dateRange?.from || new Date()}
          endDate={dateRange?.to || new Date()}
        />
      )}
    </main>
  );
}
