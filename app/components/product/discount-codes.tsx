import { useState } from "react";

interface DiscountCode {
  title: string;
  condition: string;
  code: string;
}

interface DiscountCodesProps {
  codes: DiscountCode[];
}

export function DiscountCodes({ codes }: DiscountCodesProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (!codes || codes.length === 0) return null;

  return (
    <div className="pt-4">
      <div className="flex justify-between items-baseline mb-4">
        <h3 className="text-lg font-serif">Discount Code</h3>
        <button className="text-xs text-gray-500 underline hover:text-black">see all</button>
      </div>
      <div className="flex overflow-x-auto gap-4 pb-2 -mx-4 px-4 scrollbar-hide">
        {codes.map((code, idx) => (
          <div key={idx} className="shrink-0 w-72 flex border-r border-gray-200 last:border-0 pr-4 mr-4 last:mr-0 last:pr-0">
            <div className="flex-1 pr-4">
              <div className="font-bold text-base mb-1">{code.title}</div>
              <div className="text-xs text-gray-400 mb-2">{code.condition}</div>
              <button className="text-xs text-gray-500 underline hover:text-black">รายละเอียด</button>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => copyToClipboard(code.code)}
                className="h-10 px-4 border border-gray-200 text-sm font-medium hover:border-black hover:bg-black hover:text-white transition-all whitespace-nowrap"
              >
                {copiedCode === code.code ? "คัดลอกแล้ว" : "คัดลอกโค้ด"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
