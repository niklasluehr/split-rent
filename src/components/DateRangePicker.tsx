"use client";

import { format } from "date-fns";
import { type DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Label } from "./ui/label";
import { useState } from "react";
import { useDataStore } from "@/store/store";

interface DateRangePickerProps {
  initial?: DateRange;
}

export const DateRangePicker = ({ initial }: DateRangePickerProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(initial);
  const updateStoreDateRange = useDataStore((state) => state.setDateRange);

  const handleSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from && range?.to) {
      setIsCalendarOpen(false);
      updateStoreDateRange(range);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-2">
      <Label>Rental Period</Label>
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !dateRange && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Pick dates</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            min={2}
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={handleSelect}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
