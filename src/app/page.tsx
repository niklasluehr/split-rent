"use client";

import { DateRangePicker } from "@/components/DateRangePicker";
import { DayTable } from "@/components/DayTable";
import { PriceInput } from "@/components/PriceInput";
import { useState } from "react";
import { type DateRange } from "react-day-picker";

export default function HomePage() {
  const [tenants, setTenants] = useState<string[]>(["", ""]);
  const [totalPrice, setTotalPrice] = useState<number>(1500);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const addTenant = () => {
    setTenants((prev) => [...prev, ""]);
  };

  const removeTenant = (index: number) => {
    setTenants((prev) => prev.filter((_, i) => i !== index));
  };

  const changeTenantName = (index: number, name: string) => {
    setTenants((prev) =>
      prev.map((tenant, i) => (i === index ? name : tenant)),
    );
  };

  return (
    <main className="w-full px-4 pb-16 pt-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <DateRangePicker updateDate={setDateRange} />
        <PriceInput updatePrice={setTotalPrice} />
      </div>

      <div className="h-6"></div>
      {dateRange && (
        <DayTable
          tenants={tenants}
          addTenant={addTenant}
          removeTenant={removeTenant}
          changeTenantName={changeTenantName}
          startDate={dateRange?.from ?? new Date()}
          endDate={dateRange?.to ?? new Date()}
          totalPrice={totalPrice}
        />
      )}
    </main>
  );
}
