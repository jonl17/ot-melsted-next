import { PrismicNextImage } from "@prismicio/next";
import { ImageField } from "@prismicio/client";

interface ProjectImageSectionProps {
  firstImage: ImageField;
  secondImage: ImageField;
  container: boolean;
}

export default function ProjectImageSection({
  firstImage,
  secondImage,
  container,
}: ProjectImageSectionProps) {
  const hasFirstImage = firstImage && firstImage.url;
  const hasSecondImage = secondImage && secondImage.url;
  const isTwoImages = hasFirstImage && hasSecondImage;

  if (!hasFirstImage) return null;

  return (
    <div className="min-h-screen flex items-center justify-center px-8 py-24">
      <div
        className={`w-full flex items-center justify-center ${
          isTwoImages ? "gap-6" : ""
        }`}
      >
        {isTwoImages ? (
          <>
            {/* Two images side by side */}
            <div className="relative w-full max-w-md aspect-[4/5]">
              <PrismicNextImage
                field={firstImage}
                className="w-full h-full object-cover"
                fallbackAlt=""
              />
            </div>
            <div className="relative w-full max-w-md aspect-[4/5]">
              <PrismicNextImage
                field={secondImage}
                className="w-full h-full object-cover"
                fallbackAlt=""
              />
            </div>
          </>
        ) : (
          /* Single image centered */
          <div className="relative w-full max-w-4xl mx-auto aspect-[6/4]">
            <PrismicNextImage
              field={firstImage}
              className="w-full h-full object-cover"
              fallbackAlt=""
            />
          </div>
        )}
      </div>
    </div>
  );
}
