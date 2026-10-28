import { PrismicNextImage } from "@prismicio/next";
import { ImageField } from "@prismicio/client";
import LoopingVideo from "@/components/LoopingVideo";

interface ProjectVideoImageSectionProps {
  videoUrl: string;
  posterUrl?: string;
  image: ImageField;
  videoOnRight: boolean;
  container: boolean;
}

/**
 * One row with a video and a photo side by side (T-120).
 * - Same grid as image pairs: equal width, --project-col-gap between, stacked below lg.
 * - Both share one aspect box (the photo's ratio) with object-cover, like image pairs.
 * - If only one of the two is filled in, it renders alone at its native ratio.
 */
export default function ProjectVideoImageSection({
  videoUrl,
  posterUrl,
  image,
  videoOnRight,
  container,
}: ProjectVideoImageSectionProps) {
  const hasVideo = Boolean(videoUrl);
  const hasImage = Boolean(image?.url);
  if (!hasVideo && !hasImage) return null;

  const isPair = hasVideo && hasImage;
  const w = image?.dimensions?.width;
  const h = image?.dimensions?.height;
  const ratio = w && h ? { aspectRatio: `${w} / ${h}` } : undefined;
  const mediaClass = `project-media${isPair ? " project-media--cover" : ""}`;

  const video = hasVideo ? (
    <LoopingVideo
      key="video"
      src={videoUrl}
      poster={posterUrl}
      className={mediaClass}
      style={isPair ? ratio : undefined}
    />
  ) : null;

  const photo = hasImage ? (
    <PrismicNextImage
      key="image"
      field={image}
      fallbackAlt=""
      className={mediaClass}
      sizes={
        isPair
          ? "(max-width: 1023px) 100vw, 25vw"
          : container
            ? "(max-width: 1023px) 100vw, 50vw"
            : "100vw"
      }
      style={ratio}
    />
  ) : null;

  return (
    <div
      className={`project-row ${container ? "" : "project-row--full"}`}
      style={{ ["--project-cols" as string]: isPair ? 2 : 1 }}
    >
      {videoOnRight ? [photo, video] : [video, photo]}
    </div>
  );
}
