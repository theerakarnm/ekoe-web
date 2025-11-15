import { Header } from "~/components/share/header";
import { HeroSection } from "./hero-section";
import { BestSellerSection } from "./best-seller";
import { FeatureSection } from "./feature-section";
import BlogSection from "./blog-section";
import { Footer } from "~/components/share/footer";

export function Landing() {
  return (
    <div>
      <Header isLandingMagic />
      <main className="min-h-screen bg-white">
        <HeroSection />
        <BestSellerSection />
        <FeatureSection />
        <BlogSection />
        <Footer />
      </main>
    </div>
  );
}
