"use client";
import type { RichTextField } from "@prismicio/client";

import { useRouter } from "next/navigation";
import Text from "@/components/elements/Text";
import { PrismicRichText } from "@prismicio/react";
import { introTextClass } from "@/utils/introTextSize";

interface NextProjectProps {
  nextProjectUid: string;
  nextProjectTitle: string;
  nextProjectDescriptionText: RichTextField;
  nextProjectDescriptionSmallText: string;
}

export default function NextProject({
  nextProjectUid,
  nextProjectTitle,
  nextProjectDescriptionText,
  nextProjectDescriptionSmallText,
}: NextProjectProps) {
  const router = useRouter();
  const sizeClass = introTextClass(
    nextProjectDescriptionText,
    nextProjectDescriptionSmallText
  );

  const handleClick = () => {
    router.push(`/project/${nextProjectUid}`);
  };

  return (
    // Exactly one viewport tall. The inner block uses the same layout and size tier as the
    // next page's intro (ProjectDescription), so at the bottom of this page the frame is
    // identical to the next page's first frame. The tiers keep every intro within one viewport;
    // overflow-hidden is only a safety net and never clips current content (checked in tests).
    <div className="h-screen overflow-hidden">
      <div
        onClick={handleClick}
        className="min-h-screen flex items-center justify-center px-8 py-24 cursor-pointer hover:opacity-80 transition-opacity"
      >
        <div className="max-w-4xl w-full relative">
          <div
            onClick={handleClick}
            className="absolute left-0 -top-16 z-10 cursor-pointer hover:opacity-70 transition-opacity"
          >
            <Text variant="large-mobile" color="darkgray">
              Next project
            </Text>
          </div>
          <PrismicRichText
            field={nextProjectDescriptionText}
            components={{
              paragraph: ({ children }) => (
                <Text variant="30" className={sizeClass}>
                  {children}
                </Text>
              ),
            }}
          />
          {nextProjectDescriptionSmallText && (
            <Text variant="small" color="darkgray" className="mt-8">
              {nextProjectDescriptionSmallText}
            </Text>
          )}
        </div>
      </div>
    </div>
  );
}
