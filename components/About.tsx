"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { PrismicRichText } from "@prismicio/react";
import Text from "./elements/Text";
import { RichTextField } from "@prismicio/client";
import { motion, AnimatePresence } from "framer-motion";

interface AboutProps {
  aboutText: RichTextField;
  contactBox: RichTextField;
}

export default function About({ aboutText, contactBox }: AboutProps) {
  const { activeSection, previousSection } = useTheme();

  // Determine slide direction based on section navigation
  const direction = previousSection < activeSection ? -1 : 1;
  const slideOffset = 25 * direction;

  return (
    <AnimatePresence mode="wait">
      {activeSection === 2 && (
        <motion.div
          key="about-section"
          initial={{ x: -slideOffset, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: slideOffset, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 w-screen h-screen bg-white px-16 flex items-center"
        >
          <div className="flex">
            {/* Left side - About text */}
            <div className="pr-8 flex-1">
              <PrismicRichText
                field={aboutText}
                components={{
                  paragraph: ({ children }) => (
                    <Text variant="30" color="black" className="mb-6">
                      {children}
                    </Text>
                  ),
                }}
              />
            </div>

            {/* Right side - Contact box */}
            <div className="pl-36 flex-1">
              <PrismicRichText
                field={contactBox}
                components={{
                  paragraph: ({ children }) => (
                    <Text variant="large-mobile" color="black">
                      {children}
                    </Text>
                  ),
                  strong: ({ children }) => (
                    <Text variant="large-mobile" color="darkgray" as="span">
                      {children}
                    </Text>
                  ),
                  hyperlink: ({ node, children }) => (
                    <a
                      href={node.data.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-70 transition-opacity"
                    >
                      {children}
                    </a>
                  ),
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
