import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScrollBlock {
  id: string;
  title: string;
  imageUrl?: string;
}

interface StickyImageScrollProps {
  blocks: ScrollBlock[];
}

export function StickyImageScroll({ blocks }: StickyImageScrollProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Setup Intersection Observer
  useEffect(() => {
    if (!blocks || blocks.length === 0) return;

    const observerOptions: IntersectionObserverInit = {
      root: null, // viewport
      rootMargin: '-40% 0px -40% 0px', // Trigger when in center 20% of viewport
      threshold: 0,
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = titleRefs.current.findIndex((ref) => ref === entry.target);
          if (index !== -1) {
            setActiveIndex(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all title blocks
    titleRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [blocks]);

  // Filter blocks with valid images
  const blocksWithImages = blocks.filter((block) => block.imageUrl);

  if (!blocksWithImages || blocksWithImages.length === 0) {
    return null;
  }

  const activeBlock = blocksWithImages[activeIndex] || blocksWithImages[0];

  return (
    <section className="mb-24" ref={containerRef}>
      <h2 className="text-3xl font-heading font-bold mb-12 text-center">
        Scrolling Experience
      </h2>

      <div className="flex flex-col lg:flex-row min-h-[80vh]">
        {/* Left Column - Sticky Image */}
        <div className="w-full lg:w-1/2 lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)] flex items-center justify-center p-8 bg-gray-50">
          <div className="relative w-full max-w-md aspect-square overflow-hidden rounded-2xl shadow-xl">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeBlock.id}
                src={activeBlock.imageUrl}
                alt={activeBlock.title}
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column - Scrollable Titles */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center py-16 lg:py-32 px-8 lg:px-16">
          <div className="space-y-24 lg:space-y-48">
            {blocksWithImages.map((block, index) => (
              <div
                key={block.id}
                ref={(el) => { titleRefs.current[index] = el; }}
                className="transition-all duration-500 ease-out"
              >
                <h3
                  className={`text-2xl md:text-3xl lg:text-4xl font-heading transition-all duration-500 ${activeIndex === index
                      ? 'text-blue-600 font-bold translate-x-4'
                      : 'text-gray-400 font-normal'
                    }`}
                >
                  {block.title}
                </h3>

                {/* Optional: Progress indicator */}
                <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-600 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: activeIndex === index ? '100%' : '0%' }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Image Preview - shown on small screens */}
      <div className="lg:hidden mt-8 px-4">
        <p className="text-sm text-center text-gray-500 mb-4">
          Current: {activeBlock.title}
        </p>
      </div>
    </section>
  );
}
