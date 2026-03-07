"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  animationConfig,
  contentFadeTransition,
} from "@/utils/animationConfig";

const INACTIVITY_TIMEOUT_MS = 2 * 60 * 1000;
const ACTIVITY_EVENTS = [
  "mousemove",
  "mousedown",
  "keydown",
  "scroll",
  "touchstart",
  "pointerdown",
  "pointermove",
  "wheel",
] as const;

interface ScreensaverOverlayProps {
  videoUrl?: string | null;
}

export default function ScreensaverOverlay({
  videoUrl,
}: ScreensaverOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!videoUrl) {
      return;
    }

    const resetTimer = () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        setIsVisible(true);
      }, INACTIVITY_TIMEOUT_MS);
    };

    const handleActivity = () => {
      setIsVisible(false);
      resetTimer();
    };

    resetTimer();

    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, handleActivity, { passive: true });
    });

    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }

      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, handleActivity);
      });
    };
  }, [videoUrl]);

  if (!videoUrl) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            ...contentFadeTransition,
            duration: animationConfig.sectionDuration,
            delay: 0,
          }}
          className="fixed inset-0 z-[90] bg-black"
        >
          <motion.video
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              ...contentFadeTransition,
              duration: animationConfig.sectionDuration,
              delay: 0,
            }}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
            src={videoUrl}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
