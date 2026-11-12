"use client";

import {
  CSSProperties,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

interface LoopingVideoProps {
  src: string;
  poster?: string;
  className?: string;
  style?: CSSProperties;
}

/** Start loading and playing this far before the video scrolls into view. */
const NEAR_VIEWPORT_MARGIN = "300px 0px";

/**
 * Muted, looping, inline video for project rows (T-193).
 * - Nothing is downloaded until the video is near the viewport: no `autoPlay`
 *   attribute (it would override `preload`) and `preload="none"` until then.
 * - Plays while near/in view and pauses when it scrolls away. The src is kept,
 *   so coming back to it is instant.
 * - Fades in (`.media-fade`) once a frame can paint, instead of popping in.
 *   With a poster, the poster shows at once.
 */
const LoopingVideo = forwardRef<HTMLVideoElement, LoopingVideoProps>(
  function LoopingVideo({ src, poster, className, style }, ref) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [frameReady, setFrameReady] = useState(false);
    useImperativeHandle(ref, () => videoRef.current as HTMLVideoElement);

    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      const markReady = () => setFrameReady(true);
      video.addEventListener("loadeddata", markReady);
      video.addEventListener("playing", markReady);

      let refusedOnce = false;
      const start = () => {
        video.preload = "auto";
        video.play().catch((error: unknown) => {
          // Autoplay refused (e.g. iOS Low Power Mode): still load the first
          // frame so the row is not left empty. Ignore AbortError (a pause()
          // that interrupted play() while scrolling past).
          if (
            !refusedOnce &&
            error instanceof DOMException &&
            error.name === "NotAllowedError"
          ) {
            refusedOnce = true;
            video.load();
          }
        });
      };

      let observer: IntersectionObserver | undefined;
      if (typeof IntersectionObserver === "undefined") {
        start();
      } else {
        observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) start();
            else video.pause();
          },
          { rootMargin: NEAR_VIEWPORT_MARGIN },
        );
        observer.observe(video);
      }

      return () => {
        observer?.disconnect();
        video.removeEventListener("loadeddata", markReady);
        video.removeEventListener("playing", markReady);
      };
    }, [src]);

    const visible = frameReady || Boolean(poster);

    return (
      <video
        ref={videoRef}
        src={src}
        poster={poster || undefined}
        preload="none"
        loop
        muted
        playsInline
        className={`media-fade${visible ? " is-ready" : ""}${className ? ` ${className}` : ""}`}
        style={style}
      />
    );
  },
);

export default LoopingVideo;
