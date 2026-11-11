"use client";

import { useEffect, useRef, useState } from "react";
import { ProjectDocument } from "~prismicio-types-d";
import { PrismicNextImage } from "@prismicio/next";
import HoverPreviewVideo from "./HoverPreviewVideo";
import { useTheme } from "@/contexts/ThemeContext";
import Text from "./elements/Text";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  contentFadeTransition,
  getSectionDirection,
  getSectionVariants,
  sectionTransition,
} from "@/utils/animationConfig";

interface ProjectShowcaseProps {
  projectDocuments: ProjectDocument[];
}

interface ViewportSize {
  width: number;
  height: number;
}

interface PreviewBox {
  width: number;
  height: number;
}

interface ScatterPlacement extends PreviewBox {
  hoverId: number;
  projectId: string;
  x: number;
  y: number;
}

/**
 * Hover image width, as a percentage of the viewport. Same on every hover.
 * Height follows the media aspect and shrinks only when that is what keeps
 * the whole image inside the viewport. Tune this number to resize every image.
 */
const HOVER_IMAGE_WIDTH_VW = 28;

/** Clears the fixed logo (`top-12` plus one line of wordmark). */
const SCATTER_TOP_PX = 96;

/** Clears the nav dots (`bottom-[34px]` inside a 44px hit target). */
const SCATTER_BOTTOM_PX = 96;

/** Desktop hover, matching Tailwind `lg` plus a real hover pointer. Touch never matches. */
const DESKTOP_HOVER_QUERY =
  "(hover: hover) and (pointer: fine) and (min-width: 1024px)";

const sectionVariants = getSectionVariants();

/** Optional `featured_video` (T-120); missing until the field exists in Prismic. */
function getFeaturedVideoUrl(project: ProjectDocument): string {
  const field = project.data.featured_video;
  return field && "url" in field && field.url ? field.url : "";
}

function hasPreviewMedia(project: ProjectDocument): boolean {
  return (
    Boolean(project.data.featured_image?.url) ||
    Boolean(getFeaturedVideoUrl(project))
  );
}

/** Height / width. Image dimensions win; video metadata is the fallback. */
function previewAspect(project: ProjectDocument): number {
  const image = project.data.featured_image;
  const imageWidth = image?.dimensions?.width ?? 0;
  const imageHeight = image?.dimensions?.height ?? 0;
  if (imageWidth > 0 && imageHeight > 0) return imageHeight / imageWidth;

  const video = project.data.featured_video;
  if (video && "width" in video && "height" in video) {
    const videoWidth = Number(video.width);
    const videoHeight = Number(video.height);
    if (videoWidth > 0 && videoHeight > 0) return videoHeight / videoWidth;
  }

  return 1;
}

function previewBox(aspect: number, viewport: ViewportSize): PreviewBox {
  const maxWidth = Math.max(1, (viewport.width * HOVER_IMAGE_WIDTH_VW) / 100);
  const maxHeight = Math.max(
    1,
    viewport.height - SCATTER_TOP_PX - SCATTER_BOTTOM_PX,
  );
  let width = Math.min(maxWidth, viewport.width);
  let height = width * aspect;
  if (height > maxHeight) {
    height = maxHeight;
    width = height / aspect;
  }
  return { width, height };
}

/** Inclusive integer range. Only call this from the mouseenter handler. */
function randomInRange(min: number, max: number): number {
  if (max <= min) return min;
  return min + Math.floor(Math.random() * (max - min + 1));
}

function pickPosition(
  box: PreviewBox,
  viewport: ViewportSize,
): { x: number; y: number } {
  const maxX = Math.max(0, Math.floor(viewport.width - box.width));
  const minY = SCATTER_TOP_PX;
  const maxY = Math.max(
    minY,
    Math.floor(viewport.height - box.height - SCATTER_BOTTOM_PX),
  );
  return {
    x: randomInRange(0, maxX),
    y: randomInRange(minY, maxY),
  };
}

function canUseScatterHover(): boolean {
  return window.matchMedia(DESKTOP_HOVER_QUERY).matches;
}

interface ScatterPreviewProps {
  project: ProjectDocument;
  placement: ScatterPlacement;
  /** The project's video is already showing a frame, so the image can hide. */
  videoReady: boolean;
}

/** The featured image, remounted at a new spot on every hover. */
function ScatterPreview({ project, placement, videoReady }: ScatterPreviewProps) {
  if (!project.data.featured_image?.url) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute z-0"
      style={{
        left: placement.x,
        top: placement.y,
        width: placement.width,
        height: placement.height,
      }}
    >
      <PrismicNextImage
        field={project.data.featured_image}
        sizes={`${HOVER_IMAGE_WIDTH_VW}vw`}
        className={`h-full w-full object-contain ${
          videoReady ? "invisible" : ""
        }`}
        fallbackAlt=""
      />
    </div>
  );
}

interface ScatterVideoProps {
  src: string;
  /** Where to show it, or null to hide and pause it. */
  placement: ScatterPlacement | null;
  onPlaying: () => void;
}

/**
 * One video element per project, mounted on its first hover and kept after
 * that (T-189). Hiding and moving it instead of remounting means the file is
 * fetched once, not again on every hover.
 */
function ScatterVideo({ src, placement, onPlaying }: ScatterVideoProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute z-0 ${placement ? "" : "hidden"}`}
      style={
        placement
          ? {
              left: placement.x,
              top: placement.y,
              width: placement.width,
              height: placement.height,
            }
          : undefined
      }
    >
      <HoverPreviewVideo
        src={src}
        active={placement !== null}
        className="h-full w-full object-contain"
        onPlaying={onPlaying}
      />
    </div>
  );
}

export default function ProjectShowcase({
  projectDocuments,
}: ProjectShowcaseProps) {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [placement, setPlacement] = useState<ScatterPlacement | null>(null);
  /** Projects whose video element is mounted, in first-hover order (T-189). */
  const [videoProjectIds, setVideoProjectIds] = useState<string[]>([]);
  /** Projects whose video has played at least one frame. */
  const [readyVideoIds, setReadyVideoIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const hoverIdRef = useRef(0);
  const { activeSection, previousSection } = useTheme();
  const direction = getSectionDirection(activeSection, previousSection);
  const scatteredProject = placement
    ? projectDocuments.find((project) => project.id === placement.projectId)
    : undefined;

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_HOVER_QUERY);
    function clearWhenHoverEnds() {
      if (!media.matches) setPlacement(null);
    }
    media.addEventListener("change", clearWhenHoverEnds);
    return () => media.removeEventListener("change", clearWhenHoverEnds);
  }, []);

  // The box was sized and placed for the old viewport; hide it until the
  // next hover picks a new spot (T-188).
  useEffect(() => {
    function clearOnResize() {
      setPlacement(null);
    }
    window.addEventListener("resize", clearOnResize);
    return () => window.removeEventListener("resize", clearOnResize);
  }, []);

  function markVideoReady(projectId: string) {
    setReadyVideoIds((current) =>
      current.has(projectId) ? current : new Set(current).add(projectId),
    );
  }

  function handleProjectEnter(project: ProjectDocument) {
    setHoveredProject(project.id);
    if (!canUseScatterHover() || !hasPreviewMedia(project)) {
      setPlacement(null);
      return;
    }

    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    const box = previewBox(previewAspect(project), viewport);
    const position = pickPosition(box, viewport);
    if (getFeaturedVideoUrl(project)) {
      setVideoProjectIds((current) =>
        current.includes(project.id) ? current : [...current, project.id],
      );
    }
    hoverIdRef.current += 1;
    setPlacement({
      hoverId: hoverIdRef.current,
      projectId: project.id,
      ...position,
      ...box,
    });
  }

  function handleProjectLeave(projectId: string) {
    setHoveredProject((current) => (current === projectId ? null : current));
    setPlacement((current) =>
      current?.projectId === projectId ? null : current,
    );
  }

  return (
    <AnimatePresence mode="wait" initial={false} custom={direction}>
      {activeSection === 1 && (
        <motion.div
          key="projects-section"
          custom={direction}
          variants={sectionVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={sectionTransition}
          className="fixed inset-0 h-screen w-screen bg-white"
        >
          {placement && scatteredProject ? (
            <ScatterPreview
              key={placement.hoverId}
              project={scatteredProject}
              placement={placement}
              videoReady={readyVideoIds.has(scatteredProject.id)}
            />
          ) : null}

          {videoProjectIds.map((projectId) => {
            const project = projectDocuments.find((p) => p.id === projectId);
            const src = project ? getFeaturedVideoUrl(project) : "";
            if (!src) return null;
            return (
              <ScatterVideo
                key={projectId}
                src={src}
                placement={
                  placement?.projectId === projectId ? placement : null
                }
                onPlaying={() => markVideoReady(projectId)}
              />
            );
          })}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={contentFadeTransition}
            className="project-list-scroll relative z-10 h-full w-full overflow-y-auto"
          >
            <div className="flex min-h-full flex-col px-6 pt-24 pb-[calc(6rem+env(safe-area-inset-bottom))] md:px-16">
              <div className="m-auto flex w-full flex-col items-center gap-0.5 text-center">
                {projectDocuments.map((project) => (
                  <Link
                    key={project.id}
                    href={`/project/${project.uid}`}
                    onMouseEnter={() => handleProjectEnter(project)}
                    onMouseLeave={() => handleProjectLeave(project.id)}
                    className="max-w-full"
                  >
                    <Text
                      variant="medium"
                      font="untitled-medium"
                      color={
                        hoveredProject === project.id ? "darkgray" : "black"
                      }
                      className="lg:text-large"
                    >
                      {project.data.title}
                    </Text>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
