"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { PrismicRichText } from "@prismicio/react";
import Text from "./elements/Text";
import { RichTextField } from "@prismicio/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  contentFadeTransition,
  getSectionDirection,
  getSectionVariants,
  sectionTransition,
} from "@/utils/animationConfig";

interface AboutProps {
  aboutText: RichTextField;
  contactBox: RichTextField;
}
const sectionVariants = getSectionVariants();

export default function About({ aboutText, contactBox }: AboutProps) {
  const { activeSection, previousSection } = useTheme();
  const direction = getSectionDirection(activeSection, previousSection);

  return (
    <AnimatePresence mode="wait" initial={false} custom={direction}>
      {activeSection === 2 && (
        <motion.div
          key="about-section"
          custom={direction}
          variants={sectionVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={sectionTransition}
          className="fixed inset-0 h-screen w-screen overflow-y-auto bg-white px-6 pt-24 pb-12 md:flex md:items-center md:px-16"
        >
          <div className="flex w-full flex-col gap-10 md:flex-row md:gap-0">
            {/* Left side - About text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={contentFadeTransition}
              className="flex-1 md:pr-8"
            >
              <PrismicRichText
                field={aboutText}
                components={{
                  paragraph: ({ children }) => (
                    <Text
                      variant="large-mobile"
                      color="black"
                      className="mb-5 leading-7 md:mb-6 md:text-30 md:leading-[38px]"
                    >
                      {children}
                    </Text>
                  ),
                }}
              />
            </motion.div>

            {/* Right side - Contact box */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={contentFadeTransition}
              className="flex-1 border-t border-black/10 pt-6 md:border-t-0 md:pl-36 md:pt-0"
            >
              <PrismicRichText
                field={contactBox}
                components={{
                  paragraph: ({ children }) => (
                    <Text
                      variant="large-mobile"
                      color="black"
                      className="leading-7"
                    >
                      {children}
                    </Text>
                  ),
                  strong: ({ children }) => (
                    <Text
                      variant="large-mobile"
                      color="darkgray"
                      as="span"
                      className="leading-7"
                    >
                      {children}
                    </Text>
                  ),
                  hyperlink: ({ node, children }) => (
                    <a
                      href={node.data.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-opacity hover:opacity-70"
                    >
                      {children}
                    </a>
                  ),
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
