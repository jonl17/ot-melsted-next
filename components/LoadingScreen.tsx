"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { slideshowConfig } from "@/utils/slideshowConfig";

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
          transition={{ duration: slideshowConfig.loadingScreenFadeDuration }}
          className="fixed inset-0 z-[100] bg-lightgray flex flex-col items-center justify-center"
        >
          <h1 className="text-huge font-family-untitled-medium text-black">
            OT.Melsted
          </h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
