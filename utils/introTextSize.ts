import { asText, type RichTextField } from "@prismicio/client";

/**
 * Deterministic font-size tier for a project intro, chosen from the Prismic text on the
 * server so there is no flash. ProjectDescription (top of a project page) and NextProject
 * (bottom of the previous page) both use this helper, so their frames stay identical.
 *
 * The tiers only shrink text below md (768px). From md up, everything keeps the original
 * 30px/38px. Each extra paragraph counts as a partly empty line.
 */
export const INTRO_TIERS = [
  { maxChars: 200, className: "" }, // original 30px/38px
  { maxChars: 260, className: "intro-text--t1" }, // 24/30
  { maxChars: 340, className: "intro-text--t2" }, // 21/27
  { maxChars: 560, className: "intro-text--t3" }, // 18/24
  { maxChars: Infinity, className: "intro-text--t4" }, // 15/20
] as const;

export const PARAGRAPH_WEIGHT = 25;

export function introWeight(text: RichTextField, smallText = ""): number {
  const paragraphs = text.filter((b) => "text" in b && b.text.trim()).length;
  return (
    asText(text).length +
    Math.max(0, paragraphs - 1) * PARAGRAPH_WEIGHT +
    Math.round(smallText.length * 0.4)
  );
}

export function introTextClass(text: RichTextField, smallText = ""): string {
  const w = introWeight(text, smallText);
  return INTRO_TIERS.find((t) => w <= t.maxChars)!.className;
}
