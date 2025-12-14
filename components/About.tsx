"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { PrismicRichText } from "@prismicio/react";
import Text from "./elements/Text";
import { RichTextField } from "@prismicio/client";

interface AboutProps {
  aboutText: RichTextField;
  contactBox: RichTextField;
}

export default function About({ aboutText, contactBox }: AboutProps) {
  const { activeSection } = useTheme();

  // Only render when this section is active
  if (activeSection !== 2) return null;

  return (
    <div className="fixed inset-0 w-screen h-screen bg-white px-16 flex items-center">
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
    </div>
  );
}
