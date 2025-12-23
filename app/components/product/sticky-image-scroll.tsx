import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

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

  // Filter blocks with valid images
  const blocksWithImages = blocks.filter((block) => block.imageUrl);
  const blockCount = blocksWithImages.length;

  // Track scroll progress within the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Calculate active index based on scroll progress
  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    if (blockCount > 0) {
      // Map progress (0-1) to block index (0 to blockCount-1)
      const newIndex = Math.min(
        Math.floor(progress * blockCount),
        blockCount - 1
      );
      if (newIndex !== activeIndex && newIndex >= 0) {
        setActiveIndex(newIndex);
      }
    }
  });

  // Transform for each block's opacity and position
  const getBlockTransforms = (index: number) => {
    const segmentStart = index / blockCount;
    const segmentEnd = (index + 1) / blockCount;
    const segmentMid = (segmentStart + segmentEnd) / 2;

    return {
      opacity: useTransform(
        scrollYProgress,
        [segmentStart, segmentMid, segmentEnd],
        index === blockCount - 1
          ? [0, 1, 1] // Last block stays visible
          : [0, 1, 0]
      ),
      y: useTransform(
        scrollYProgress,
        [segmentStart, segmentEnd],
        ['20%', '-20%']
      ),
    };
  };

  if (!blocksWithImages || blocksWithImages.length === 0) {
    return null;
  }

  const activeBlock = blocksWithImages[activeIndex] || blocksWithImages[0];

  // Calculate total scroll height: 100vh per block
  const totalScrollHeight = `${blockCount * 100}vh`;

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: totalScrollHeight }}
    >
      {/* Sticky container - stays fixed while scrolling */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-gradient-to-br from-gray-50 to-white">
        {/* Content wrapper */}
        <div className="h-full flex flex-col lg:flex-row">
          {/* Left Column - Full height image */}
          <div className="w-full lg:w-3/5 h-1/2 lg:h-full flex items-center justify-center relative">
            {/* Background glow effect */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[80%] h-[80%] bg-blue-500/10 blur-3xl rounded-full" />
            </div>

            {/* Image container - full height */}
            <div className="relative w-full h-full overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeBlock.id}
                  src={activeBlock.imageUrl}
                  alt={activeBlock.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.15 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                />
              </AnimatePresence>

              {/* Subtle overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>
          </div>

          {/* Right Column - Titles with scroll-based animations */}
          <div className="w-full lg:w-2/5 h-1/2 lg:h-full flex items-center justify-center px-6 lg:px-12">
            <div className="w-full max-w-md">
              {/* Progress indicators */}
              <div className="flex gap-2 mb-8">
                {blocksWithImages.map((_, index) => (
                  <motion.div
                    key={index}
                    className="h-1 flex-1 rounded-full overflow-hidden bg-gray-200"
                  >
                    <motion.div
                      className="h-full bg-blue-600 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{
                        width: index < activeIndex ? '100%' : index === activeIndex ? '100%' : '0%'
                      }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Title display */}
              <div className="relative h-48">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeBlock.id}
                    className="absolute inset-0 flex flex-col justify-center"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <span className="text-blue-600 text-sm font-semibold uppercase tracking-wider mb-3">
                      {String(activeIndex + 1).padStart(2, '0')} / {String(blockCount).padStart(2, '0')}
                    </span>
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 leading-tight">
                      {activeBlock.title}
                    </h3>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Scroll hint */}
              <motion.div
                className="mt-12 flex items-center gap-3 text-gray-400"
                animate={{ opacity: activeIndex === blockCount - 1 ? 0 : 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="w-6 h-10 border-2 border-gray-300 rounded-full flex items-start justify-center p-1"
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <motion.div
                    className="w-1.5 h-3 bg-gray-400 rounded-full"
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </motion.div>
                <span className="text-sm">Scroll to explore</span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Block number indicator - bottom left */}
        <div className="absolute bottom-8 left-8 lg:left-16">
          <div className="flex items-baseline gap-1">
            <span className="text-6xl lg:text-8xl font-bold text-gray-100">
              {String(activeIndex + 1).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
