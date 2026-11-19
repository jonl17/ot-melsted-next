/**
 * The OT.Melsted wordmark (T-201 #1 and #4): the header refresh button and the
 * loading screen both render this.
 *
 * The real logo file has not arrived yet, so it renders live text for now.
 * To switch to the logo, put the file in `public/brand/` and set `LOGO` below.
 * That is the only code change needed.
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
} | null = null;

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

  return (
    <Tag className={`${className} leading-none`}>
      <span
        role="img"
        aria-label="OT.Melsted"
        className="mx-auto block max-w-full bg-current"
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
