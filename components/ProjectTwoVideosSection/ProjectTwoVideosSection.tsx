"use client";

import { useEffect, useRef, useState } from "react";
import LoopingVideo from "@/components/LoopingVideo";

interface ProjectTwoVideosSectionProps {
  firstVideoUrl: string;
  secondVideoUrl: string;
  firstPosterUrl?: string;
  secondPosterUrl?: string;
  container: boolean;
}

/**
 * One row with two videos side by side (T-151).
 * - Same grid as image pairs: equal width, --project-col-gap between, stacked below lg.
 * - Paired videos share the first video's intrinsic aspect ratio with object-cover
 *   so both panels have equal width and height (Figma: two equal panels).
 * - A single filled video renders alone at its native ratio.
 * - Empty (neither video) renders nothing.
 */
export default function ProjectTwoVideosSection({
  firstVideoUrl,
  secondVideoUrl,
  firstPosterUrl,
  secondPosterUrl,
  container,
}: ProjectTwoVideosSectionProps) {
  const hasFirst = Boolean(firstVideoUrl);
  const hasSecond = Boolean(secondVideoUrl);
  const firstRef = useRef<HTMLVideoElement>(null);
  const [firstAspect, setFirstAspect] = useState<string | undefined>(undefined);

  const isPair = hasFirst && hasSecond;

  useEffect(() => {
    if (!isPair) return;
    const el = firstRef.current;
    if (!el) return;
    const apply = () => {
      if (el.videoWidth > 0 && el.videoHeight > 0) {
        setFirstAspect(`${el.videoWidth} / ${el.videoHeight}`);
      }
    };
    if (el.readyState >= 1) apply();
    el.addEventListener("loadedmetadata", apply);
    return () => el.removeEventListener("loadedmetadata", apply);
  }, [isPair, firstVideoUrl]);

  if (!hasFirst && !hasSecond) return null;

  const mediaClass = `project-media${isPair ? " project-media--cover" : ""}`;
  const pairStyle =
    isPair && firstAspect ? { aspectRatio: firstAspect } : undefined;

  return (
    <div
      className={`project-row ${container ? "" : "project-row--full"}`}
      style={{ ["--project-cols" as string]: isPair ? 2 : 1 }}
    >
      {hasFirst ? (
        <LoopingVideo
          ref={firstRef}
          key="first"
          src={firstVideoUrl}
          poster={firstPosterUrl}
          className={mediaClass}
          style={pairStyle}
        />
      ) : null}
      {hasSecond ? (
        <LoopingVideo
          key="second"
          src={secondVideoUrl}
          poster={secondPosterUrl}
          className={mediaClass}
          style={pairStyle}
        />
      ) : null}
    </div>
  );
}
