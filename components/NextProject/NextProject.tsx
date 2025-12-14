"use client";

import { useRouter } from "next/navigation";
import Text from "@/components/elements/Text";
import { PrismicRichText } from "@prismicio/react";

interface NextProjectProps {
  nextProjectUid: string;
  nextProjectTitle: string;
  nextProjectDescriptionText: any;
  nextProjectDescriptionSmallText: string;
}

export default function NextProject({
  nextProjectUid,
  nextProjectTitle,
  nextProjectDescriptionText,
  nextProjectDescriptionSmallText,
}: NextProjectProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/project/${nextProjectUid}`);
  };

  return (
    <>
      {/* Scrolling description content */}
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
              paragraph: ({ children }) => <Text variant="30">{children}</Text>,
            }}
          />
          {nextProjectDescriptionSmallText && (
            <Text variant="small" color="darkgray" className="mt-8">
              {nextProjectDescriptionSmallText}
            </Text>
          )}
        </div>
      </div>
    </>
  );
}
