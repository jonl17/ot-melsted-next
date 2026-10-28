"use client";

import { useEffect, useRef } from "react";

interface HoverPreviewVideoProps {
  src: string;
  active: boolean;
  className?: string;
  /** Called once the first frame is playing, so a fallback image can hide. */
  onPlaying?: () => void;
}

/**
 * Project-list hover preview (T-120): muted, looping, inline video.
 * Nothing is downloaded until the project is first hovered (preload="none");
 * it plays while hovered and pauses when the pointer leaves.
 */
export default function HoverPreviewVideo({
  src,
  active,
  className,
  onPlaying,
}: HoverPreviewVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (active) {
      video.preload = "auto";
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [active]);

  return (
    <video
      ref={videoRef}
      src={src}
      preload="none"
      loop
      muted
      playsInline
      aria-hidden="true"
      className={className}
      onPlaying={onPlaying}
    />
  );
}
