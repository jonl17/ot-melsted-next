import { slideshowConfig } from "./slideshowConfig";

/** Width of the copy used for the brightness check (T-193). */
const ANALYSIS_WIDTH_PX = 64;

/**
 * A small imgix copy of a Prismic image (e.g. `?auto=format,compress&w=64`).
 * The average brightness is the same at this size, but the phone downloads a
 * few KB instead of the full-resolution original and draws a tiny canvas.
 * Non-imgix URLs (e.g. SVGs on the Prismic file CDN) are returned unchanged.
 */
export function analysisImageUrl(imageSrc: string): string {
  let url: URL;
  try {
    url = new URL(imageSrc);
  } catch {
    return imageSrc;
  }
  if (url.hostname !== "images.prismic.io") return imageSrc;

  const params = url.search
    .replace(/^\?/, "")
    .split("&")
    .filter((part) => part && !/^(w|h|width|height)=/.test(part));
  if (!params.some((part) => part.startsWith("auto="))) {
    params.unshift("auto=format,compress");
  }
  params.push(`w=${ANALYSIS_WIDTH_PX}`);
  return `${url.origin}${url.pathname}?${params.join("&")}`;
}

export async function analyzeImageBrightness(imageSrc: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        resolve(true); // Default to dark mode
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Sample pixels from the image
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      let totalBrightness = 0;
      const sampleSize = pixels.length / 4; // Total number of pixels

      // Calculate average brightness
      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        // Calculate relative luminance
        const brightness = (0.299 * r + 0.587 * g + 0.114 * b);
        totalBrightness += brightness;
      }

      const averageBrightness = totalBrightness / sampleSize;

      // Return true if dark (so we use light text), false if bright (so we use dark text)
      const isDark = averageBrightness < slideshowConfig.brightnessThreshold;
      resolve(isDark);
    };

    img.onerror = () => {
      resolve(true); // Default to dark mode on error
    };

    img.src = analysisImageUrl(imageSrc);
  });
}
