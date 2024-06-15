import { useDataStore } from "@/store/store";

export const useDayOrNight = () => {
  const paymentType = useDataStore((state) => state.paymentType);
  const calcType = useDataStore((state) => state.calcType);
  const dayOrNight = paymentType === "perNight" ? "night" : "day";
  const personOrCalendar =
    calcType === "perCalendarNight" ? "calendar" : "person";

  const xDaysOrNights = (amount: number) =>
    `${amount} ${dayOrNight}${amount === 1 ? "" : "s"}`;

  const xDaysOrNightsWithType = (amount: number) =>
    `${amount} ${personOrCalendar}-${dayOrNight}${amount === 1 ? "" : "s"}`;

  return { dayOrNight, xDaysOrNights, xDaysOrNightsWithType };
};
