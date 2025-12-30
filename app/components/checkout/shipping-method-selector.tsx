import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Loader2, Truck, AlertCircle } from "lucide-react";
import { getShippingMethods, type ShippingMethod } from "~/lib/services/order.service";
import { formatCurrencyFromCents } from "~/lib/formatter";

interface ShippingMethodSelectorProps {
  selectedMethod?: string;
  onMethodChange: (methodId: string, cost: number) => void;
  className?: string;
}

export function ShippingMethodSelector({
  selectedMethod,
  onMethodChange,
  className = "",
}: ShippingMethodSelectorProps) {
  const [methods, setMethods] = useState<ShippingMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchShippingMethods() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getShippingMethods();
        setMethods(data);

        // Auto-select first method if none selected
        if (!selectedMethod && data.length > 0) {
          onMethodChange(data[0].id, data[0].cost);
        }
      } catch (err) {
        console.error("Failed to fetch shipping methods:", err);
        setError("Unable to load shipping methods. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchShippingMethods();
  }, []); // Only run on mount

  const handleMethodChange = (methodId: string) => {
    const method = methods.find((m) => m.id === methodId);
    if (method) {
      onMethodChange(method.id, method.cost);
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center py-8 ${className}`}>
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-600">กำลังโหลดวิธีจัดส่ง...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (methods.length === 0) {
    return (
      <Alert className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>ขณะนี้ไม่มีวิธีจัดส่งที่พร้อมใช้งาน</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={className}>
      <RadioGroup
        value={selectedMethod}
        onValueChange={handleMethodChange}
        className="space-y-3"
      >
        {methods.map((method, index) => (
          <div
            key={method.id}
            className={`border rounded-md p-4 transition-colors ${selectedMethod === method.id
                ? "bg-gray-50 border-black"
                : "border-gray-200 hover:bg-gray-50/50"
              } ${index === 0 ? "rounded-t-md" : ""} ${index === methods.length - 1 ? "rounded-b-md" : ""
              }`}
          >
            <div className="flex items-start space-x-3">
              <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
              <Label
                htmlFor={method.id}
                className="flex-1 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Method Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Truck className="h-4 w-4 text-gray-600" />
                      <span className="font-medium text-gray-900">{method.name}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {method.description}
                    </p>
                    {method.carrier && (
                      <p className="text-xs text-gray-500">
                        ผู้ให้บริการ: {method.carrier}
                      </p>
                    )}
                  </div>

                  {/* Cost */}
                  <div className="text-right shrink-0">
                    <div className="font-medium text-gray-900">
                      {method.cost === 0 ? (
                        <span className="text-green-600">ฟรี</span>
                      ) : (
                        formatCurrencyFromCents(method.cost, { symbol: "฿" })
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {method.estimatedDays === 1
                        ? "วันรุ่งขึ้น"
                        : `${method.estimatedDays} วัน`}
                    </div>
                  </div>
                </div>
              </Label>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
