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
 * - Images keep their native aspect ratio (from Prismic dimensions); never cropped.
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
        const w = img.dimensions?.width;
        const h = img.dimensions?.height;
        return (
          <PrismicNextImage
            key={i}
            field={img}
            fallbackAlt=""
            className="project-media"
            sizes={
              images.length > 1
                ? "(max-width: 768px) 100vw, 50vw"
                : "100vw"
            }
            style={w && h ? { aspectRatio: `${w} / ${h}` } : undefined}
          />
        );
      })}
    </div>
  );
}
