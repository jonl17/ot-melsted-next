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

/** How often the letterbox colour follows the video on portrait screens. */
const EDGE_SAMPLE_MS = 250;

/**
 * The colour of the frame's top-left corner, for the bars above and below the
 * video on portrait screens (T-201 #2). The screensaver's background colour
 * changes over the loop, so it is read from the playing video. Null if the
 * frame cannot be read yet (or the file has no CORS headers).
 */
function readEdgeColor(
  video: HTMLVideoElement,
  context: CanvasRenderingContext2D,
): string | null {
  if (video.readyState < 2 || !video.videoWidth) return null;
  try {
    const size = Math.max(1, Math.round(video.videoWidth * 0.02));
    context.drawImage(video, 0, 0, size, size, 0, 0, 1, 1);
    const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
    return `rgb(${r} ${g} ${b})`;
  } catch {
    return null;
  }
}

interface ScreensaverOverlayProps {
  videoUrl?: string | null;
}

export default function ScreensaverOverlay({
  videoUrl,
}: ScreensaverOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [edgeColor, setEdgeColor] = useState<string | null>(null);

  // Portrait phones show the whole 16:9 frame (object-contain) instead of a
  // centre crop that cut the wordmark off; the bars take the frame's colour.
  useEffect(() => {
    if (!isVisible) return;
    const portrait = window.matchMedia("(orientation: portrait)");
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;

    const timer = window.setInterval(() => {
      const video = videoRef.current;
      if (!video || !portrait.matches) return;
      const color = readEdgeColor(video, context);
      if (color) setEdgeColor(color);
    }, EDGE_SAMPLE_MS);

    return () => window.clearInterval(timer);
  }, [isVisible]);

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
          className="fixed inset-0 z-[90] bg-black transition-colors duration-300 ease-linear"
          style={edgeColor ? { backgroundColor: edgeColor } : undefined}
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
            ref={videoRef}
            crossOrigin="anonymous"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="h-full w-full object-cover portrait:object-contain"
            src={videoUrl}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
