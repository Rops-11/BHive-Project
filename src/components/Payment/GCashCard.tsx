"use client";
import React, { useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import Image from "next/image";
import placeholderQR from "@/assets/BplaceLogo.jpg";

import { Button } from "../ui/button";

const GCashCard = ({
  paymentType,
  setPaymentType,
  selectedFile,
  setSelectedFile,
}: {
  selectedFile: File | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
  paymentType: string | undefined;
  setPaymentType: React.Dispatch<React.SetStateAction<string | undefined>>;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleCustomButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full shadow-lg border border-gray-200 flex flex-col h-full">
      <CardHeader className="pb-4 flex-shrink-0">
        <CardTitle className="text-xl font-semibold text-slate-800">
          Pay with GCash
        </CardTitle>
        <CardDescription className="text-sm text-slate-500">
          Scan the QR code using your GCash app.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5 sm:gap-6 flex-grow">
        <div className="flex justify-center items-center p-2 border border-dashed border-slate-300 rounded-md bg-slate-50">
          <Image
            src={placeholderQR}
            alt="GCash QR Code"
            width={200}
            height={200}
            className="object-contain rounded max-w-[180px] sm:max-w-[200px] md:max-w-[220px]"
            priority
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-slate-700 mb-2 block">
            Payment Amount:
          </Label>
          <RadioGroup
            // defaultValue="full"
            value={paymentType}
            onValueChange={setPaymentType}
            className="grid grid-cols-2 gap-3 sm:gap-4">
            <Label
              htmlFor="r1"
              className={`flex flex-col items-center justify-center rounded-md border-2 p-3 sm:p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all
              ${
                paymentType === "full"
                  ? "border-sky-500 ring-2 ring-sky-500 bg-sky-50 text-sky-700"
                  : "border-slate-200 text-slate-700"
              }`}>
              <RadioGroupItem
                value="full"
                id="r1"
                className="sr-only"
              />
              <span className="font-semibold text-sm sm:text-base">
                Full Payment
              </span>
            </Label>
            <Label
              htmlFor="r2"
              className={`flex flex-col items-center justify-center rounded-md border-2 p-3 sm:p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all
                         ${
                           paymentType === "partial"
                             ? "border-sky-500 ring-2 ring-sky-500 bg-sky-50 text-sky-700"
                             : "border-slate-200 text-slate-700"
                         }`}>
              <RadioGroupItem
                value="partial"
                id="r2"
                className="sr-only"
              />
              <span className="font-semibold text-sm sm:text-base">
                Down Payment
              </span>
            </Label>
          </RadioGroup>
        </div>
        <div className="space-y-2 mt-1">
          <Label className="text-sm font-medium text-slate-700 block">
            Upload Payment Proof:
          </Label>

          <input
            id="payment-proof-hidden"
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/png, image/jpeg, image/jpg, application/pdf"
          />

          <div className="flex flex-col items-start gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCustomButtonClick}
              className="w-full sm:w-auto border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 focus-visible:ring-sky-500">
              Choose File
            </Button>
            <div className="text-xs text-slate-500 w-full min-h-[3em]">
              {selectedFile ? (
                <>
                  <p className="truncate font-medium text-slate-700">
                    Selected: {selectedFile.name}
                  </p>
                  <p>Size: ({(selectedFile.size / 1024).toFixed(1)} KB)</p>
                </>
              ) : (
                <p>
                  No file chosen.
                  <br />
                  <span className="text-slate-400">
                    (JPG, PNG, PDF - Max 5MB)
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GCashCard;
