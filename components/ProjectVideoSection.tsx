"use client";

interface ProjectVideoSectionProps {
  videoUrl: string;
  container: boolean;
}

/** Video row: same margin/gap rules as image rows, native aspect ratio (no cropping). */
export default function ProjectVideoSection({
  videoUrl,
  container,
}: ProjectVideoSectionProps) {
  if (!videoUrl) return null;

  return (
    <div
      className={`project-row ${container ? "" : "project-row--full"}`}
      style={{ ["--project-cols" as string]: 1 }}
    >
      <video
        src={videoUrl}
        autoPlay
        loop
        muted
        playsInline
        className="project-media"
      />
    </div>
  );
}
