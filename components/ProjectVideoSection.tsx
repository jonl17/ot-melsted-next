import LoopingVideo from "@/components/LoopingVideo";

interface ProjectVideoSectionProps {
  videoUrl: string;
  container: boolean;
  /** Optional poster image (Prismic `poster` field on the video slice). */
  posterUrl?: string;
}

/**
 * Video row: same margin/gap rules as image rows, native aspect ratio (no cropping).
 * Loads and plays only near the viewport, with a short fade-in (LoopingVideo, T-193).
 */
export default function ProjectVideoSection({
  videoUrl,
  container,
  posterUrl,
}: ProjectVideoSectionProps) {
  if (!videoUrl) return null;

  return (
    <div
      className={`project-row ${container ? "" : "project-row--full"}`}
      style={{ ["--project-cols" as string]: 1 }}
    >
      <LoopingVideo src={videoUrl} poster={posterUrl} className="project-media" />
    </div>
  );
}
