"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ImageField,
  asImageSrc,
  asImageWidthSrcSet,
  isFilled,
} from "@prismicio/client";
import { useTheme } from "@/contexts/ThemeContext";
import { analyzeImageBrightness } from "@/utils/imageAnalysis";
import {
  getSectionDirection,
  getSectionVariants,
  sectionTransition,
} from "@/utils/animationConfig";
import {
  slideshowConfig,
  getFramerTransitionConfig,
} from "@/utils/slideshowConfig";

interface Slide {
  image: ImageField;
  /** Optional portrait-phone version (T-201 #3); missing until the field exists in Prismic. */
  mobile_image?: ImageField;
}

/** Portrait screens (phones held upright) get the mobile image or the uncropped layout. */
const PORTRAIT_QUERY = "(orientation: portrait)";

function hasMobileImage(slide: Slide): boolean {
  return Boolean(slide.mobile_image && isFilled.image(slide.mobile_image));
}

/** The image actually on screen, for the brightness check behind the logo colour. */
function shownImageUrl(slide: Slide): string | null | undefined {
  if (hasMobileImage(slide) && window.matchMedia(PORTRAIT_QUERY).matches) {
    return slide.mobile_image?.url;
  }
  return slide.image?.url;
}

interface SlideImageProps {
  slide: Slide;
  eager: boolean;
}

/**
 * One slide (T-201 #3). Desktop and landscape: the image fills the screen as
 * before. Portrait phones: the slide's mobile image fills the screen if the
 * editor added one; otherwise the whole desktop image is shown, centred on a
 * blurred copy of itself, instead of a centre crop that cut most of it off.
 * A <picture> lets the browser download only the version it shows.
 */
function SlideImage({ slide, eager }: SlideImageProps) {
  if (!isFilled.image(slide.image)) return null;
  const desktop = asImageWidthSrcSet(slide.image);
  const mobile =
    slide.mobile_image && isFilled.image(slide.mobile_image)
      ? asImageWidthSrcSet(slide.mobile_image)
      : null;
  const loading = eager ? "eager" : "lazy";

  return (
    <>
      {!mobile ? (
        // Tiny blurred fill behind the uncropped portrait layout; never shown in landscape.
        // eslint-disable-next-line @next/next/no-img-element -- imgix URL, 64px decorative fill
        <img
          aria-hidden="true"
          alt=""
          src={asImageSrc(slide.image, { w: 64, blur: 40 }) ?? undefined}
          loading="lazy"
          className="absolute inset-0 hidden h-full w-full scale-150 object-cover blur-2xl portrait:block"
        />
      ) : null}
      <picture>
        {mobile ? (
          <source media={PORTRAIT_QUERY} srcSet={mobile.srcset} sizes="100vw" />
        ) : null}
        <img
          src={desktop.src}
          srcSet={desktop.srcset}
          sizes="100vw"
          alt=""
          loading={loading}
          fetchPriority={eager ? "high" : "auto"}
          className={`absolute inset-0 h-full w-full object-cover ${
            mobile ? "" : "portrait:object-contain"
          }`}
        />
      </picture>
    </>
  );
}

interface FrontpageHeroSlideshowProps {
  slides: Slide[];
  interval?: number;
}
const sectionVariants = getSectionVariants();

export default function FrontpageHeroSlideshow({
  slides,
  interval = slideshowConfig.slideInterval,
}: FrontpageHeroSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastInteraction, setLastInteraction] = useState(0);
  const { setIsDark, activeSection, previousSection } = useTheme();
  const direction = getSectionDirection(activeSection, previousSection);

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
    const url = currentSlide ? shownImageUrl(currentSlide) : null;
    if (url) {
      analyzeImageBrightness(url).then((isDark) => {
        setIsDark(isDark);
      });
    }
  }, [currentIndex, slides, setIsDark, activeSection]);

  // Don't render if no slides
  if (!slides || slides.length === 0) return null;

  return (
    <AnimatePresence mode="wait" initial={false} custom={direction}>
      {activeSection === 0 && (
        <motion.div
          key="hero-section"
          custom={direction}
          variants={sectionVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={sectionTransition}
          className="fixed inset-0 w-screen h-screen"
        >
          {slides.map((slide, index) => (
            <motion.div
              key={index}
              initial={false}
              animate={{ opacity: index === currentIndex ? 1 : 0 }}
              transition={getFramerTransitionConfig()}
              className="absolute inset-0 w-full h-full overflow-hidden"
            >
              <SlideImage slide={slide} eager={index === 0} />
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
