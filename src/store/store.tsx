import { n } from "@/lib/utils";
import { type PaymentType, type CalculationType } from "@/types/types";
import { eachDayOfInterval } from "date-fns";
import { type DateRange } from "react-day-picker";
import { create } from "zustand";

export interface StoreData {
  dateRange: DateRange | undefined;
  totalPrice: number;
  tenants: string[];
  selectedDates: number[][];
  calcType: CalculationType;
  paymentType: PaymentType;
}

interface StoreType extends StoreData {
  setDateRange: (dateRange: DateRange | undefined) => void;
  setTotalPrice: (totalPrice: number) => void;
  addTenant: () => void;
  removeTenant: (index: number) => void;
  changeTenantName: (index: number, name: string) => void;
  setCalcType: (calcType: CalculationType) => void;
  setPaymentType: (paymentType: PaymentType) => void;
  getDates: () => Date[];
  toggleCellSelection: (tenantIndex: number, date: Date) => void;
  selectAll: (tenantIndex: number) => void;
  deselectAll: (tenantIndex: number) => void;
}

const initialData: StoreData = {
  dateRange: undefined,
  totalPrice: 1500,
  tenants: ["", ""],
  selectedDates: [[], []],
  calcType: "perNight",
  paymentType: "perNight",
};

export const useDataStore = create<StoreType>()((set, get) => ({
  ...initialData,

  setDateRange: (dateRange: DateRange | undefined) => set({ dateRange }),
  getDates: () => {
    if (!get().dateRange?.from || !get().dateRange?.to) return [];
    return eachDayOfInterval({
      start: get().dateRange!.from!,
      end: get().dateRange!.to!,
    });
  },
  setTotalPrice: (totalPrice: number) => set({ totalPrice }),

  addTenant: () =>
    set((state) => ({
      tenants: [...state.tenants, ""],
      selectedDates: [...state.selectedDates, []],
    })),
  removeTenant: (index: number) =>
    set((state) => ({
      tenants: state.tenants.filter((_, i) => i !== index),
      selectedDates: state.selectedDates.filter((_, i) => i !== index),
    })),
  changeTenantName: (index: number, name: string) =>
    set((state) => ({
      tenants: state.tenants.map((tenant, i) => (i === index ? name : tenant)),
    })),

  toggleCellSelection: (tenantIndex: number, date: Date) => {
    const dateString = n(date);
    if (!get().selectedDates[tenantIndex]!.includes(dateString)) {
      set((state) => {
        const newSelectedDates = [...state.selectedDates];
        newSelectedDates[tenantIndex] = [
          ...state.selectedDates[tenantIndex]!,
          dateString,
        ].sort();
        return { selectedDates: newSelectedDates };
      });
    } else {
      set((state) => {
        const newSelectedDates = [...state.selectedDates];
        newSelectedDates[tenantIndex] = state.selectedDates[
          tenantIndex
        ]!.filter((d) => d !== dateString);
        return { selectedDates: newSelectedDates };
      });
    }
  },
  selectAll: (tenantIndex: number) =>
    set((state) => {
      const newSelectedDates = [...state.selectedDates];
      newSelectedDates[tenantIndex] = get()
        .getDates()
        .map((date) => n(date));
      return { selectedDates: newSelectedDates };
    }),
  deselectAll: (tenantIndex: number) =>
    set((state) => {
      const newSelectedDates = [...state.selectedDates];
      newSelectedDates[tenantIndex] = [];
      return { selectedDates: newSelectedDates };
    }),

  setCalcType: (calcType: CalculationType) => set({ calcType }),
  setPaymentType: (paymentType: PaymentType) => set({ paymentType }),
}));
