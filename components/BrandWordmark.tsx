import { preload } from "react-dom";

/**
 * The OT.Melsted wordmark (T-201 #1 and #4): the header refresh button and the
 * loading screen both render this.
 *
 * The logo is Ólafur's OT_Merki.svg (19 Nov 2026), saved as
 * `public/brand/ot-melsted-logo.svg` (T-202). Set `LOGO` to null to go back
 * to the live-text wordmark.
 *
 * The file is drawn as a CSS mask filled with the text colour, so one
 * single-colour SVG (or a PNG with transparency) turns black or white with the
 * page theme, exactly like the text does today. It is sized from the
 * surrounding font size, so it keeps the size of the text it replaces;
 * `heightEm` tunes that.
 */
const LOGO: {
  /** Path under `public/`, e.g. "/brand/ot-melsted-logo.svg". */
  src: string;
  /** Pixel width and height of the file (only the ratio matters). */
  width: number;
  height: number;
  /** Logo height relative to the font size of the text it replaces. */
  heightEm: number;
} | null = {
  src: "/brand/ot-melsted-logo.svg",
  // viewBox of the SVG
  width: 1862.96,
  height: 268.81,
  // Same width as the text it replaces: the 18px header text was 100px wide,
  // and 100 / (1862.96 / 268.81) / 18 = 0.8.
  heightEm: 0.8,
};

interface BrandWordmarkProps {
  /** Classes for the text fallback (font, size, colour). */
  className?: string;
  /** Element for the text fallback. */
  as?: "p" | "h1";
}

export default function BrandWordmark({
  className = "",
  as: Tag = "p",
}: BrandWordmarkProps) {
  if (!LOGO) {
    return <Tag className={className}>OT.Melsted</Tag>;
  }

  // Fetch the mask file with the HTML, so the loading screen shows the logo on first paint.
  preload(LOGO.src, { as: "image", type: "image/svg+xml" });

  return (
    // Same element, classes and line height as the text, so nothing around it moves.
    // The 0.08em lift puts the logo where the text glyphs sat (measured at 390px).
    <Tag className={className}>
      <span
        role="img"
        aria-label="OT.Melsted"
        className="relative -top-[0.08em] inline-block max-w-full bg-current align-middle"
        style={{
          height: `${LOGO.heightEm}em`,
          aspectRatio: `${LOGO.width} / ${LOGO.height}`,
          maskImage: `url(${LOGO.src})`,
          WebkitMaskImage: `url(${LOGO.src})`,
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
        }}
      />
    </Tag>
  );
}
