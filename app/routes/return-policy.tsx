import type { Route } from "./+types/return-policy";
import { Header } from "~/components/share/header";
import { Footer } from "~/components/share/footer";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Return & Refund Policy - Ekoe" },
    { name: "description", content: "Return & Refund Policy for Ekoe products." },
  ];
}

export default function ReturnPolicy() {
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header />

      <main className="pt-8 sm:pt-8 pb-16">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-xs text-gray-500 font-serif">
            <a href="/" className="hover:text-black">Home</a> / <span className="font-bold text-black">Return Policy</span>
          </p>
        </div>

        {/* Content Section */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <h1 className="text-3xl sm:text-4xl font-serif text-gray-900 mb-2 text-center">
            Return & Refund Policy
          </h1>
          <p className="text-gray-500 text-center mb-12 font-serif">
            Last Updated: {currentDate}
          </p>

          <div className="space-y-8 font-thai text-gray-700 leading-relaxed font-light">
            <section>
              <p className="mb-4">
                At Ekoe, we believe in the quality of our formulations and want you to feel confident in your skincare journey. However, we understand that sometimes a product may not be the right fit, or things may happen during shipping.
              </p>
              <p>
                Below is our policy on returns, refunds, and exchanges.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-gray-900 mb-4 font-serif">1. Return Window</h2>
              <p>
                You have 30 days from the date of delivery to request a return. If 30 days have gone by since your purchase arrived, unfortunately, we cannot offer you a refund or exchange.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-gray-900 mb-4 font-serif">2. Eligibility for Returns</h2>
              <p className="mb-2">
                To ensure the safety and hygiene of our customers, our return eligibility depends on the condition of the product:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="font-medium text-gray-900">Unopened & Unused:</strong> Items that are in their original packaging, with the safety seal intact, are eligible for a full refund minus shipping costs.
                </li>
                <li>
                  <strong className="font-medium text-gray-900">Opened or Gently Used (Satisfaction Guarantee):</strong> If you have used the product and are not satisfied with the results, we accept returns on items that are at least 50% full. <span className="italic">Note: This is issued as Store Credit only.</span>
                </li>
                <li>
                  <strong className="font-medium text-gray-900">Sale Items:</strong> Only regular-priced items may be refunded. Sale items, bundles, and gift cards are final sale.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-medium text-gray-900 mb-4 font-serif">3. Damages and Issues</h2>
              <p className="mb-4">
                Please inspect your order immediately upon receipt. If the item is defective, damaged, or if you received the wrong item, please contact us within 48 hours of delivery so that we can evaluate the issue and make it right.
              </p>
              <p className="mb-4">
                Please provide a photo of the damaged product and the shipping box.
              </p>
              <p className="font-medium text-gray-900">
                We will send a replacement immediately at no cost to you.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-gray-900 mb-4 font-serif">4. Allergic Reactions</h2>
              <p className="mb-4">
                We formulate with care, but we understand that everyone’s skin is unique.
              </p>
              <p className="mb-4">
                We recommend performing a patch test on the inside of your wrist before incorporating a new product into your routine.
              </p>
              <p className="mb-4">
                If you experience an allergic reaction, please discontinue use immediately and contact us at <a href="mailto:contact@ekoe.co.th" className="text-black underline">contact@ekoe.co.th</a>.
              </p>
              <p>
                Returns for reactions are handled on a case-by-case basis. We may request a photo of the reaction or a brief description to help us improve our product information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-gray-900 mb-4 font-serif">5. How to Initiate a Return</h2>
              <p className="mb-4">
                To start a return, please follow these steps:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Email us at <a href="mailto:contact@ekoe.co.th" className="text-black underline">contact@ekoe.co.th</a> with your Order Number and the reason for the return.
                </li>
                <li>
                  If your return is accepted, we will send you instructions on how and where to send your package.
                </li>
                <li>
                  Items sent back to us without first requesting a return will not be accepted.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-medium text-gray-900 mb-4 font-serif">6. Refunds</h2>
              <p className="mb-4">
                Once your return is received and inspected, we will notify you of the approval or rejection of your refund.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="font-medium text-gray-900">Approved:</strong> If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 5-10 business days.
                </li>
                <li>
                  <strong className="font-medium text-gray-900">Shipping Costs:</strong> Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund (unless the return is due to our error).
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-medium text-gray-900 mb-4 font-serif">7. Exchanges</h2>
              <p>
                We only replace items if they are defective or damaged. If you need to exchange an unopened item for a different product variant, please return the original item for a refund and make a separate purchase for the new item.
              </p>
            </section>

            <div className="border-t border-gray-200 pt-8 mt-12">
              <h2 className="text-xl font-medium text-gray-900 mb-4 font-serif">Contact Us</h2>
              <p className="mb-4">
                If you have any questions about our Returns and Refunds Policy, please contact us:
              </p>
              <div className="space-y-1">
                <p>Email: <a href="mailto:contact@ekoe.co.th" className="text-black underline">contact@ekoe.co.th</a></p>
              </div>
              <p className="mt-4 text-gray-500 text-sm">
                Support Hours: Mon-Fri, 9am - 5pm Bangkok Time
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
