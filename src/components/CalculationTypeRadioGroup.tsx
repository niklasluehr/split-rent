import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Info } from "lucide-react";

interface CalculationTypeRadioGroupProps {
  calcType: CalculationType;
  setCalcType: (calcType: CalculationType) => void;
}

export type CalculationType = "perNight" | "numNights";
const labels = ["Split per Night", "Split by Number of Nights"];

export const CalculationTypeRadioGroup = ({
  calcType,
  setCalcType,
}: CalculationTypeRadioGroupProps) => {
  return (
    <>
      <div className="mb-1 flex gap-2">
        <Label>Calculation Type</Label>
        <Info size={16} />
      </div>
      <RadioGroup
        defaultValue={calcType}
        onValueChange={(e) => setCalcType(e as CalculationType)}
      >
        {["perNight", "numNights"].map((value, index) => (
          <div key={value} className="flex items-center gap-2">
            <RadioGroupItem value={value} id={value} />
            <Label htmlFor={value}>{labels[index]}</Label>
          </div>
        ))}
      </RadioGroup>
    </>
  );
};
