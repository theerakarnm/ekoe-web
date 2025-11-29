import { CreditCard, QrCode } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";

export type PaymentMethod = "promptpay" | "credit_card";

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
}

export function PaymentMethodSelector({
  selectedMethod,
  onMethodChange,
}: PaymentMethodSelectorProps) {
  return (
    <RadioGroup
      value={selectedMethod}
      onValueChange={(value) => onMethodChange(value as PaymentMethod)}
      className="flex flex-col space-y-0"
    >
      {/* PromptPay Option */}
      <div
        className={`border rounded-t-md p-4 transition-colors ${
          selectedMethod === "promptpay"
            ? "bg-gray-50 border-black z-10"
            : "border-gray-200 hover:bg-gray-50/50"
        }`}
      >
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="promptpay" id="promptpay" />
          <Label
            htmlFor="promptpay"
            className="flex-1 flex justify-between items-center cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <QrCode className="h-5 w-5 text-gray-700" />
              <div>
                <div className="font-medium">PromptPay QR Code</div>
                <div className="text-sm text-gray-500 font-normal">
                  Scan QR code with your mobile banking app
                </div>
              </div>
            </div>
          </Label>
        </div>
      </div>

      {/* Credit Card Option */}
      <div
        className={`border border-t-0 rounded-b-md p-4 transition-colors ${
          selectedMethod === "credit_card"
            ? "bg-gray-50 border-black"
            : "border-gray-200 hover:bg-gray-50/50"
        }`}
      >
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="credit_card" id="credit_card" />
          <Label
            htmlFor="credit_card"
            className="flex-1 flex justify-between items-center cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-gray-700" />
              <div>
                <div className="font-medium">Credit Card</div>
                <div className="text-sm text-gray-500 font-normal">
                  Pay securely with Visa, Mastercard, or other cards
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              <div className="w-8 h-5 bg-blue-600 rounded text-[8px] text-white flex items-center justify-center font-bold italic">
                VISA
              </div>
              <div className="w-8 h-5 bg-red-500 rounded text-[8px] text-white flex items-center justify-center font-bold">
                MC
              </div>
            </div>
          </Label>
        </div>
      </div>
    </RadioGroup>
  );
}
