import type { Route } from "./+types/checkout";
import { CheckoutForm } from "~/components/checkout/checkout-form";
import { CheckoutSummary } from "~/components/checkout/checkout-summary";
import { CustomerAuthGuard } from "~/components/auth/customer-auth-guard";
import { ShoppingCart } from "lucide-react";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Checkout - Ekoe" },
    { name: "description", content: "Secure Checkout" },
  ];
}

export default function Checkout() {
  return (
    <CustomerAuthGuard>
      <div className="min-h-screen bg-white font-sans text-[#1a1a1a]">
        {/* Simplified Header */}
        <header className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
            <h1 className="text-2xl font-serif text-gray-800">Ekoe</h1>
            <button className="text-gray-700 hover:text-gray-900">
              <ShoppingCart className="h-6 w-6" />
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Column - Form */}
            <div className="px-4 sm:px-6 lg:px-12">
              <CheckoutForm />
            </div>

            {/* Right Column - Summary */}
            <div className="lg:sticky lg:top-0 lg:h-screen">
              <CheckoutSummary />
            </div>
          </div>
        </main>
      </div>
    </CustomerAuthGuard>
  );
}
