import { Header } from "~/components/share/header";
import { HeroSection } from "./hero-section";
import { BestSellerSection } from "./best-seller";
import { FeatureSection } from "./feature-section";

export function Landing() {
  return (
    <div>
      <Header isLandingMagic />
      <main className="min-h-screen bg-white px-6">
        <HeroSection />
        <BestSellerSection />
        <FeatureSection />
      </main>
    </div>
  );
}
