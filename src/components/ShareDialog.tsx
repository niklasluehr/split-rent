"use client";

import { Check, Copy, Share2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useDataStore } from "@/store/store";
import { encodeParams } from "@/lib/urlSharing";
import { useState } from "react";
import Image from "next/image";
import emoji_wink from "../../public/images/emoji_wink.png";

/* https://ui.shadcn.com/docs/components/dialog */

export const ShareDialog = () => {
  const totalPrice = useDataStore((state) => state.totalPrice);
  const tenants = useDataStore((state) => state.tenants);
  const selectedDates = useDataStore((state) => state.selectedDates);
  const calcType = useDataStore((state) => state.calcType);
  const paymentType = useDataStore((state) => state.paymentType);
  const dateRange = useDataStore((state) => state.dateRange);

  const [linkCopied, setLinkCopied] = useState(false);

  const params = encodeParams({
    start: dateRange!.from!,
    end: dateRange!.to!,
    totalPrice,
    calcType,
    paymentType,
    tenants,
    selectedDates,
  });

  const link = "https://split-rent.vercel.app" + params;

  const handleShareClick = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setLinkCopied(true);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button onClick={() => setLinkCopied(false)} className="text-lg">
          <Share2 size="18" className="mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-left">
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription className="flex gap-1">
            Send this link to your friends if they don{"'"}t trust you
            <Image src={emoji_wink} alt="winking face" width={20} height={20} />
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="link" defaultValue={link} readOnly />
          </div>
          <Button
            disabled={linkCopied}
            onClick={handleShareClick}
            className="px-3 transition"
          >
            <span className="sr-only">Copy</span>
            {linkCopied ? (
              <Check className="h-5 w-5" />
            ) : (
              <Copy className="h-5 w-5" />
            )}
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <p className="text-sm text-muted-foreground">
            Changes are not synchronized. If you make any changes, you need to
            share a new link.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
