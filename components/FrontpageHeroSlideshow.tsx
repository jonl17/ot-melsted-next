"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageField } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { useTheme } from "@/contexts/ThemeContext";
import { analyzeImageBrightness } from "@/utils/imageAnalysis";
import { slideshowConfig, getFramerTransitionConfig } from "@/utils/slideshowConfig";

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
  const { setIsDark, activeSection } = useTheme();

  // Only run slideshow when this section is active
  useEffect(() => {
    if (slides.length <= 1 || activeSection !== 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, interval);

    return () => clearInterval(timer);
  }, [slides.length, interval, activeSection]);

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

  // Only render when this section is active
  if (!slides || slides.length === 0 || activeSection !== 0) return null;

  return (
    <div className="fixed inset-0 w-screen h-screen">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={getFramerTransitionConfig()}
          className="absolute inset-0 w-full h-full"
        >
          <PrismicNextImage
            field={slides[currentIndex].image}
            fill
            className="object-cover"
            fetchPriority={currentIndex === 0 ? "high" : "auto"}
            alt=""
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
