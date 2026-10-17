import { PrismicNextImage } from "@prismicio/next";
import { ImageField } from "@prismicio/client";

interface ProjectImageSectionProps {
  firstImage: ImageField;
  secondImage: ImageField;
  container: boolean;
}

/**
 * One row of project images.
 * - Contained rows use the shared side margin (--project-margin); full-width rows don't.
 * - A single image keeps its native aspect ratio (from Prismic dimensions).
 * - A pair uses one shared aspect box (the first image's ratio) with object-cover,
 *   so both images have equal width and height.
 * - Vertical spacing comes from the parent .project-rows gap, not from this row.
 */
export default function ProjectImageSection({
  firstImage,
  secondImage,
  container,
}: ProjectImageSectionProps) {
  const images = [firstImage, secondImage].filter((img) => img && img.url);
  if (images.length === 0) return null;

  return (
    <div
      className={`project-row ${container ? "" : "project-row--full"}`}
      style={{ ["--project-cols" as string]: images.length }}
    >
      {images.map((img, i) => {
        const isPair = images.length > 1;
        const box = isPair ? images[0] : img;
        const w = box.dimensions?.width;
        const h = box.dimensions?.height;
        return (
          <PrismicNextImage
            key={i}
            field={img}
            fallbackAlt=""
            className={`project-media${isPair ? " project-media--cover" : ""}`}
            sizes={
              isPair
                ? "(max-width: 1023px) 100vw, 25vw"
                : container
                  ? "(max-width: 1023px) 100vw, 50vw"
                  : "100vw"
            }
            style={w && h ? { aspectRatio: `${w} / ${h}` } : undefined}
          />
        );
      })}
    </div>
  );
}
