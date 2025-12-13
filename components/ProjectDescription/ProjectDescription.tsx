import Text from "@/components/elements/Text";
import { PrismicRichText } from "@prismicio/react";

interface ProjectDescriptionProps {
  text: any;
  smallText: string;
}

export default function ProjectDescription({
  text,
  smallText,
}: ProjectDescriptionProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-8 py-24">
      <div className="max-w-4xl w-full">
        <PrismicRichText
          field={text}
          components={{
            paragraph: ({ children }) => <Text variant="30">{children}</Text>,
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
