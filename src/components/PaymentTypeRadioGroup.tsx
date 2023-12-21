import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { type PaymentType } from "@/types/types";
import { useDataStore } from "@/store/store";

const labels = ["Nightly (e.g. Hotel, Airbnb)", "Daily (e.g. Car rental)"];

export const PaymentTypeRadioGroup = () => {
  const paymentType = useDataStore((state) => state.paymentType);
  const setPaymentType = useDataStore((state) => state.setPaymentType);

  return (
    <>
      <Label>Payment</Label>
      <RadioGroup
        className="mt-1"
        defaultValue={paymentType}
        onValueChange={(e) => setPaymentType(e as PaymentType)}
      >
        {["perNight", "perDay"].map((value, index) => (
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
