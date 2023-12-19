"use client";

import { DateRangePicker } from "@/components/DateRangePicker";
import { DayTable } from "@/components/DayTable";
import { PriceInput } from "@/components/PriceInput";
import { useDataStore } from "@/store/store";

export default function HomePage() {
  const dateRange = useDataStore((state) => state.dateRange);

  return (
    <main className="mx-auto w-full max-w-xl px-4 pb-16 pt-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <DateRangePicker />
        <PriceInput />
      </div>

      <div className="h-6"></div>
      {dateRange && <DayTable />}
    </main>
  );
}
