import { slideshowConfig } from "./slideshowConfig";

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

    img.src = imageSrc;
  });
}
