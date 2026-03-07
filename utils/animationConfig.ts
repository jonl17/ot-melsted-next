import { Variants } from "framer-motion";

export const animationConfig = {
  sectionOffsetPx: 20,
  sectionDuration: 0.16,
  sectionEase: [0.22, 1, 0.36, 1] as const,
  contentFadeDuration: 0.14,
  contentFadeDelay: 0.02,
  contentFadeEase: "easeOut" as const,
  slideshowFadeDuration: 0.5,
  slideshowFadeEase: "easeInOut" as const,
  loadingScreenDurationMs: 1500,
  loadingScreenFadeDuration: 0.4,
};

export const getSectionDirection = (
  activeSection: number,
  previousSection: number,
) => (activeSection > previousSection ? 1 : -1);

export const getSectionVariants = (): Variants => ({
  enter: (direction: number) => ({
    x: direction * animationConfig.sectionOffsetPx,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: -direction * animationConfig.sectionOffsetPx,
    opacity: 0,
  }),
});

export const sectionTransition = {
  duration: animationConfig.sectionDuration,
  ease: animationConfig.sectionEase,
} as const;

export const contentFadeTransition = {
  duration: animationConfig.contentFadeDuration,
  delay: animationConfig.contentFadeDelay,
  ease: animationConfig.contentFadeEase,
} as const;
