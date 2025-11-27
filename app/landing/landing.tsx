import { useState, useEffect } from 'react';
import { Header } from "~/components/share/header";
import { HeroSection } from "./hero-section";
import { BestSellerSection } from "./best-seller";
import { NewArrivalsSection } from "./new-arrivals";
import { FeatureSection } from "./feature-section";
import BlogSection from "./blog-section";
import { Footer } from "~/components/share/footer";
import type { Product } from "~/lib/services/product.service";

interface LandingProps {
  loaderData?: {
    bestSellers: Product[];
    newArrivals: Product[];
    error: string | null;
  };
}

export function Landing({ loaderData }: LandingProps) {
  const [showMainHeader, setShowMainHeader] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // console.log(scrollY);

      // if (scrollY > 90) {
      //   setShowMainHeader(true);
      // } else {
      //   setShowMainHeader(false);
      // }

      const heroNavElement = document.querySelector('[data-hero-nav]');

      if (heroNavElement) {
        const heroNavBottom = heroNavElement.getBoundingClientRect().bottom;

        // Show main header when hero nav is out of view
        if (heroNavBottom < 0) {
          setShowMainHeader(true);
        } else {
          setShowMainHeader(false);
        }
      } else {
        // Fallback: show after scrolling 200px
        if (scrollY > 200) {
          setShowMainHeader(true);
        } else {
          setShowMainHeader(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial scroll position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      <Header isLandingMagic={!showMainHeader} />
      <main className="min-h-screen bg-white">
        <HeroSection />
        <BestSellerSection 
          products={loaderData?.bestSellers} 
          error={loaderData?.error}
        />
        <FeatureSection />
        <NewArrivalsSection 
          products={loaderData?.newArrivals} 
          error={loaderData?.error}
        />
        <BlogSection />
        <Footer />
      </main>
    </div>
  );
}
