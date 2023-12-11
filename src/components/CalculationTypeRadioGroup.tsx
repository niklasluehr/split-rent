import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Info } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

interface CalculationTypeRadioGroupProps {
  calcType: CalculationType;
  setCalcType: (calcType: CalculationType) => void;
}

export type CalculationType = "perNight" | "numNights";
const labels = ["Fixed price per night", "Fixed price per person-night"];

export const CalculationTypeRadioGroup = ({
  calcType,
  setCalcType,
}: CalculationTypeRadioGroupProps) => {
  return (
    <>
      <div className="mb-2 flex items-center gap-1">
        <Label>Method of Calculation</Label>
        <InfoSheet />
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

function InfoSheet() {
  return (
    <Sheet>
      <SheetTrigger className="hover:cursor-pointer" asChild>
        <Info size={18} />
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader className="mx-auto max-w-lg text-left">
          <SheetTitle>Methods of Calculation</SheetTitle>
          <SheetDescription>
            <p>
              There is different ways to split the rental price. Choose the one
              that fits your situation best and is the most fair. Play with the
              app to see how the settings affect the price splitting.
            </p>
            <h1 className="mt-4 font-bold">Fixed price per night</h1>
            <p>
              Take the total price and divide it by the number of nights. This
              is the fixed <i>price-per-night</i>. Then, for each night, split
              the <i>price-per-night</i> equally between all present persons on
              that night.
            </p>
            <p>
              Nights where no one is present are split equally by all persons.
            </p>
            <p>
              With this method, people pay more for nights when there are fewer
              persons present.
            </p>
            <h1 className="mt-4 font-bold">Fixed price per person-night</h1>
            <p>
              For each person, every night they stay counts as one person-night.
              Divide the total price by the total number of person-nights. This
              is the fixed <i>price-per-person-night</i>. Then, each person pays
              the <i>price-per-person-night</i> multiplied by the number of
              nights they stay.
            </p>
            <p>
              With this method, everyone pays an amount proportional to the time
              the stay.
            </p>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
