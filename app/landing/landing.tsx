import { useState, useEffect } from 'react';
import { Header } from "~/components/share/header";
import { HeroSection } from "./hero-section";
import { BestSellerSection } from "./best-seller";
import { FeatureSection } from "./feature-section";
import BlogSection from "./blog-section";
import { Footer } from "~/components/share/footer";
import { WelcomePopup } from "~/components/share/welcome-popup";
import type { Product } from "~/lib/services/product.service";
import type { BlogPost } from "~/interface/blog.interface";
import type { SiteSettings } from "~/lib/services/site-settings.service";

interface LandingProps {
  loaderData?: {
    bestSellers: Product[];
    newArrivals: Product[];
    blogs?: BlogPost[];
    siteSettings?: SiteSettings | null;
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
        <HeroSection slides={loaderData?.siteSettings?.hero_slides} />
        <BestSellerSection
          products={loaderData?.bestSellers}
          error={loaderData?.error}
        />
        <FeatureSection settings={loaderData?.siteSettings?.feature_section} />
        {/* <NewArrivalsSection 
          products={loaderData?.newArrivals} 
          error={loaderData?.error}
        /> */}
        <BlogSection posts={loaderData?.blogs} />
        <Footer />
      </main>
      <WelcomePopup settings={loaderData?.siteSettings?.welcome_popup} />
    </div>
  );
}
