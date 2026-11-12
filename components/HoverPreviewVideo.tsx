"use client";

import { useEffect, useRef, useState } from "react";

/** Matches the `.media-fade` transition in globals.css. */
const FADE_MS = 250;

interface HoverPreviewVideoProps {
  src: string;
  active: boolean;
  className?: string;
  /**
   * Called once the first frame is playing and has faded in, so a fallback
   * image underneath can hide.
   */
  onPlaying?: () => void;
}

/**
 * Project-list hover preview (T-120): muted, looping, inline video.
 * Nothing is downloaded until the project is first hovered (preload="none");
 * it plays while hovered and pauses when the pointer leaves.
 * The first frame fades in (`.media-fade`, T-193) instead of popping in.
 */
export default function HoverPreviewVideo({
  src,
  active,
  className,
  onPlaying,
}: HoverPreviewVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const onPlayingRef = useRef(onPlaying);

  useEffect(() => {
    onPlayingRef.current = onPlaying;
  }, [onPlaying]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => onPlayingRef.current?.(), FADE_MS);
    return () => window.clearTimeout(timer);
  }, [playing]);

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
      className={`media-fade${playing ? " is-ready" : ""}${className ? ` ${className}` : ""}`}
      onPlaying={() => setPlaying(true)}
    />
  );
}
