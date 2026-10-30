"use client";

import { CSSProperties, useEffect, useRef } from "react";

interface LoopingVideoProps {
  src: string;
  poster?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Muted, looping, inline video that plays only while at least 25% of it is in view
 * (same behaviour as the full-width video rows).
 */
export default function LoopingVideo({ src, poster, className, style }: LoopingVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

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
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster || undefined}
      preload="metadata"
      autoPlay
      loop
      muted
      playsInline
      className={className}
      style={style}
    />
  );
}
