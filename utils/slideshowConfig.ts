/**
 * Centralized configuration for slideshow animations
 * Tweak these values to adjust the slideshow behavior
 */

export const slideshowConfig = {
  // Duration of fade transition between slides (in seconds)
  transitionDuration: 0.5,

  // Easing function for transitions
  // Options: "linear", "easeIn", "easeOut", "easeInOut", "circIn", "circOut", "circInOut", "backIn", "backOut", "backInOut", "anticipate"
  transitionEasing: "easeInOut" as const,

  // Time each slide stays visible before transitioning (in milliseconds)
  slideInterval: 5000,

  // Loading screen display time before fade out (in milliseconds)
  loadingScreenDuration: 1500,

  // Loading screen fade out duration (in seconds)
  loadingScreenFadeDuration: 0.5,

  // Threshold for determining if image is dark (0-255)
  // Lower = more images considered dark, Higher = fewer images considered dark
  brightnessThreshold: 127.5,
};

/**
 * Get Tailwind CSS classes for transitions
 * Automatically generates the correct duration class
 */
export const getTailwindTransitionClasses = () => {
  const durationMs = slideshowConfig.transitionDuration * 1000;
  return `transition-colors duration-[${durationMs}ms] ease-in-out`;
};

/**
 * Get Framer Motion transition config
 */
export const getFramerTransitionConfig = () => ({
  duration: slideshowConfig.transitionDuration,
  ease: slideshowConfig.transitionEasing,
});
