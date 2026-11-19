"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { slideshowConfig } from "@/utils/slideshowConfig";
import { sectionTransition } from "@/utils/animationConfig";
import BrandWordmark from "./BrandWordmark";

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, slideshowConfig.loadingScreenDuration);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            ...sectionTransition,
            duration: slideshowConfig.loadingScreenFadeDuration,
          }}
          className="fixed inset-0 z-[100] bg-lightgray flex flex-col items-center justify-center"
        >
          <BrandWordmark
            as="h1"
            className="px-4 text-center text-huge font-family-untitled-medium text-black"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
