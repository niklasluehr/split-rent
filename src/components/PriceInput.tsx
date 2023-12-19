import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useDataStore } from "@/store/store";

export const PriceInput = () => {
  const [price, setPrice] = useState<string>("1500");
  const updateStorePrice = useDataStore((state) => state.setTotalPrice);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const lastChar = raw.charAt(raw.length - 1);

    if (isNaN(+raw) || lastChar === " ") {
      e.preventDefault();
      return;
    }

    setPrice(raw);
    updateStorePrice(+raw);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label>Total Price €</Label>
      <div className="flex items-center gap-2">
        <Input
          type="text"
          inputMode="numeric"
          value={price}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};
