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
}

function ScatterPreview({ project, placement }: ScatterPreviewProps) {
  const [videoReady, setVideoReady] = useState(false);
  const videoUrl = getFeaturedVideoUrl(project);
  const hasImage = Boolean(project.data.featured_image?.url);

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
      {hasImage && (
        <PrismicNextImage
          field={project.data.featured_image}
          sizes={`${HOVER_IMAGE_WIDTH_VW}vw`}
          className={`h-full w-full object-contain ${
            videoUrl && videoReady ? "invisible" : ""
          }`}
          fallbackAlt=""
        />
      )}
      {videoUrl && (
        <HoverPreviewVideo
          src={videoUrl}
          active
          className="absolute inset-0 h-full w-full object-contain"
          onPlaying={() => setVideoReady(true)}
        />
      )}
    </div>
  );
}

export default function ProjectShowcase({
  projectDocuments,
}: ProjectShowcaseProps) {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [placement, setPlacement] = useState<ScatterPlacement | null>(null);
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
            />
          ) : null}

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
