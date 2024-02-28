"use client";

import { DateRangePicker } from "@/components/DateRangePicker";
import { DayTable } from "@/components/DayTable";
import { PriceInput } from "@/components/PriceInput";
import { decodeParams } from "@/lib/urlSharing";
import { useDataStore } from "@/store/store";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { type DateRange } from "react-day-picker";

export default function HomePage() {
  const dateRange = useDataStore((state) => state.dateRange);
  const searchParams = useSearchParams();
  const setState = useDataStore((state) => state.setState);

  const data = decodeParams(searchParams);

  const [parsed, setParsed] = useState(false);
  const router = useRouter();

  const [initialRange, setInitialRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  useEffect(() => {
    if (data) {
      const {
        start,
        end,
        totalPrice,
        calcType,
        paymentType,
        tenants,
        selectedDates,
      } = data;
      setState({
        dateRange: {
          from: start,
          to: end,
        },
        totalPrice,
        calcType,
        paymentType,
        tenants,
        selectedDates,
      });
      setInitialRange({
        from: start,
        to: end,
      });
    }
    setParsed(true);
    router.replace("/");
  }, []);

  return (
    parsed && (
      <main className="mx-auto w-full max-w-xl px-4 pb-16 pt-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <DateRangePicker initial={initialRange} />
          <PriceInput />
        </div>

        <div className="h-6"></div>
        {dateRange && <DayTable />}
      </main>
    )
  );
}
