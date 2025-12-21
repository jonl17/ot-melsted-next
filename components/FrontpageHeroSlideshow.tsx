"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageField } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { useTheme } from "@/contexts/ThemeContext";
import { analyzeImageBrightness } from "@/utils/imageAnalysis";
import {
  slideshowConfig,
  getFramerTransitionConfig,
} from "@/utils/slideshowConfig";

interface Slide {
  image: ImageField;
}

interface FrontpageHeroSlideshowProps {
  slides: Slide[];
  interval?: number;
}

export default function FrontpageHeroSlideshow({
  slides,
  interval = slideshowConfig.slideInterval,
}: FrontpageHeroSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastInteraction, setLastInteraction] = useState<number>(Date.now());
  const { setIsDark, activeSection } = useTheme();

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setLastInteraction(Date.now());
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setLastInteraction(Date.now());
  };

  // Only run slideshow when this section is active
  useEffect(() => {
    if (slides.length <= 1 || activeSection !== 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, interval);

    return () => clearInterval(timer);
  }, [slides.length, interval, activeSection, lastInteraction]);

  // Only analyze brightness when this section is active
  useEffect(() => {
    if (activeSection !== 0) return;

    const currentSlide = slides[currentIndex];
    if (currentSlide?.image?.url) {
      analyzeImageBrightness(currentSlide.image.url).then((isDark) => {
        setIsDark(isDark);
      });
    }
  }, [currentIndex, slides, setIsDark, activeSection]);

  // Don't render if no slides
  if (!slides || slides.length === 0) return null;

  return (
    <AnimatePresence mode="wait">
      {activeSection === 0 && (
        <motion.div
          key="hero-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 w-screen h-screen"
        >
          {slides.map((slide, index) => (
            <motion.div
              key={index}
              initial={false}
              animate={{ opacity: index === currentIndex ? 1 : 0 }}
              transition={getFramerTransitionConfig()}
              className="absolute inset-0 w-full h-full"
            >
              <PrismicNextImage
                field={slide.image}
                fill
                className="object-cover"
                fetchPriority={index === 0 ? "high" : "auto"}
                alt=""
              />
            </motion.div>
          ))}

          {/* Navigation overlays */}
          <div className="absolute inset-0 flex justify-between">
            {/* Left 25% - Previous */}
            <div
              className="w-1/4 cursor-w-resize"
              onClick={goToPrevious}
            />

            {/* Right 25% - Next */}
            <div
              className="w-1/4 cursor-e-resize"
              onClick={goToNext}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
