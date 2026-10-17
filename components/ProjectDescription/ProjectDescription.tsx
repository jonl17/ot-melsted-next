import type { RichTextField } from "@prismicio/client";
import Text from "@/components/elements/Text";
import { PrismicRichText } from "@prismicio/react";
import { introTextClass } from "@/utils/introTextSize";

interface ProjectDescriptionProps {
  text: RichTextField;
  smallText: string;
}

export default function ProjectDescription({
  text,
  smallText,
}: ProjectDescriptionProps) {
  const sizeClass = introTextClass(text, smallText);
  return (
    <div className="min-h-screen flex items-center justify-center px-8 py-24">
      <div className="max-w-4xl w-full">
        <PrismicRichText
          field={text}
          components={{
            paragraph: ({ children }) => (
              <Text variant="30" className={sizeClass}>
                {children}
              </Text>
            ),
          }}
        />
        {smallText && (
          <Text variant="small" color="darkgray" className="mt-8">
            {smallText}
          </Text>
        )}
      </div>
    </div>
  );
}
