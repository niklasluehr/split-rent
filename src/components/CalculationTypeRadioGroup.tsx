import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Info } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { type CalculationType } from "@/types/types";
import { useDataStore } from "@/store/store";

export const CalculationTypeRadioGroup = () => {
  const calcType = useDataStore((state) => state.calcType);
  const setCalcType = useDataStore((state) => state.setCalcType);
  const paymentType = useDataStore((state) => state.paymentType);

  const dayOrNight = paymentType === "perNight" ? "night" : "day";
  const labels = [
    `Fixed price per ${dayOrNight}`,
    `Fixed price per person-${dayOrNight}`,
  ];

  return (
    <>
      <div className="mb-2 flex items-center gap-1">
        <Label>Method of Calculation</Label>
        <InfoDrawer dayOrNight={dayOrNight} />
      </div>
      <RadioGroup
        defaultValue={calcType}
        onValueChange={(e) => setCalcType(e as CalculationType)}
      >
        {["perNight", "numNights"].map((value, index) => (
          <div key={value} className="flex items-center gap-2">
            <RadioGroupItem value={value} id={value} />
            <Label className="text-base leading-tight" htmlFor={value}>
              {labels[index]}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </>
  );
};

interface InfoDrawerProps {
  dayOrNight: string;
}

function InfoDrawer({ dayOrNight }: InfoDrawerProps) {
  const dayOrNightCap =
    dayOrNight.charAt(0).toUpperCase() + dayOrNight.slice(1);

  return (
    <Drawer>
      <DrawerTrigger className="hover:cursor-pointer" asChild>
        <Info size={18} />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="mx-auto max-w-lg text-left">
          <DrawerTitle>Methods of Calculation</DrawerTitle>
          <DrawerDescription>
            <p>
              There is different ways to split the rental price. Choose the one
              that fits your situation best and is the most fair. Play with the
              app to see how the settings affect the price splitting.
            </p>
            <h1 className="mt-4 font-bold">Fixed price per {dayOrNight}</h1>
            <p>
              Take the total price and divide it by the number of {dayOrNight}s.
              This is the fixed <i>price-per-{dayOrNight}</i>. Then, for each{" "}
              {dayOrNight}, split the <i>price-per-{dayOrNight}</i> equally
              between all present persons on that
              {dayOrNight}.
            </p>
            <p>
              {dayOrNightCap}s where no one is present are split equally by all
              persons.
            </p>
            <p>
              With this method, people pay more for {dayOrNight}s when there are
              fewer persons present.
            </p>
            <h1 className="mt-4 font-bold">
              Fixed price per person-{dayOrNight}
            </h1>
            <p>
              For each person, every {dayOrNight} they stay counts as one
              person-{dayOrNight}. Divide the total price by the total number of
              person-{dayOrNight}s. This is the fixed{" "}
              <i>price-per-person-{dayOrNight}</i>. Then, each person pays the{" "}
              <i>price-per-person-{dayOrNight}</i> multiplied by the number of{" "}
              {dayOrNight}s they stay.
            </p>
            <p>
              With this method, everyone pays an amount proportional to the time
              they stay.
            </p>
          </DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}
