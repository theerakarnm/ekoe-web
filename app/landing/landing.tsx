import { Header } from "~/components/share/header";
import { HeroSection } from "./hero-section";
import { BestSellerSection } from "./best-seller";

export function Landing() {
  return (
    <div>
      <Header isLandingMagic />
      <main className="min-h-screen bg-white px-6">
        <HeroSection />
        <BestSellerSection />
      </main>
    </div>
  );
}
