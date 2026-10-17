"use client";

import { useEffect, useRef } from "react";

interface ProjectVideoSectionProps {
  videoUrl: string;
  container: boolean;
  /** Optional poster image. The Prismic slice has no poster field yet. */
  posterUrl?: string;
}

/** Video row: same margin/gap rules as image rows, native aspect ratio (no cropping). */
export default function ProjectVideoSection({
  videoUrl,
  container,
  posterUrl,
}: ProjectVideoSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Play only while the video is in view; pause when it scrolls away.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (typeof IntersectionObserver === "undefined") {
      video.play().catch(() => {});
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [videoUrl]);

  if (!videoUrl) return null;

  return (
    <div
      className={`project-row ${container ? "" : "project-row--full"}`}
      style={{ ["--project-cols" as string]: 1 }}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        poster={posterUrl || undefined}
        preload="metadata"
        loop
        muted
        playsInline
        className="project-media"
      />
    </div>
  );
}
