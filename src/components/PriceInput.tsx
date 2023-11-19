import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface PriceInputProps {
  updatePrice: (value: number) => void;
}

export const PriceInput = ({ updatePrice }: PriceInputProps) => {
  const [price, setPrice] = useState<string>("1.500");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const lastChar = raw.charAt(raw.length - 1);

    if (isNaN(+raw) || lastChar === " ") {
      e.preventDefault();
      return;
    }

    setPrice(raw);
    updatePrice(+raw);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label>Total Price</Label>
      <div className="flex items-center gap-2">
        <Input
          className="w-24"
          type="text"
          inputMode="numeric"
          value={price}
          onChange={handleChange}
        />
        <span>€</span>
      </div>
    </div>
  );
};
