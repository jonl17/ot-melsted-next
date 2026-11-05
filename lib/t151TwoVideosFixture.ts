/**
 * T-151 FIXTURE ONLY — lives on branch `t-151-fixture`, never merge to main.
 * Injects a synthetic `twoVideos` slice on the Salurinn project page in Vercel
 * Preview when `?fixture=two-videos` (or -one / -none) is present.
 * Uses public Prismic CDN mp4s already on the OT Melsted site. No secrets.
 */

import type { Content } from "@prismicio/client";

const FIGMA_01 =
  "https://otmelsted.cdn.prismic.io/otmelsted/ktzOE_ojjbsOrduh_Salurinn_Figma_01.mp4";
const FIGMA_02 =
  "https://otmelsted.cdn.prismic.io/otmelsted/qz57-fcnFce6aTgO_Salurinn_Figma_02.mp4";

export type T151FixtureMode = "two-videos" | "two-videos-one" | "two-videos-none";

export function parseT151FixtureParam(
  raw: string | string[] | undefined,
): T151FixtureMode | null {
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (v === "two-videos" || v === "two-videos-one" || v === "two-videos-none") {
    return v;
  }
  return null;
}

/** True only on Vercel Preview (never Production). */
export function isT151FixtureEnvAllowed(): boolean {
  return process.env.VERCEL_ENV === "preview";
}

function mediaLink(url: string | null) {
  if (!url) {
    return { link_type: "Media" as const };
  }
  return {
    link_type: "Media" as const,
    url,
    kind: "file",
    name: url.split("/").pop() || "video.mp4",
    size: "0",
    id: `t151-fixture-${url.split("/").pop()}`,
  };
}

export function buildT151TwoVideosFixtureSlice(
  mode: T151FixtureMode,
): Content.ProjectImageSectionSliceTwoVideos {
  const firstUrl = mode === "two-videos-none" ? null : FIGMA_01;
  const secondUrl = mode === "two-videos" ? FIGMA_02 : null;

  return {
    id: `t151-fixture-twoVideos-${mode}`,
    slice_type: "project_image_section",
    slice_label: null,
    variation: "twoVideos",
    version: "t151-fixture",
    primary: {
      first_video: mediaLink(firstUrl),
      first_poster: {
        dimensions: null,
        alt: null,
        copyright: null,
        url: null,
        id: null,
        edit: null,
      },
      second_video: mediaLink(secondUrl),
      second_poster: {
        dimensions: null,
        alt: null,
        copyright: null,
        url: null,
        id: null,
        edit: null,
      },
      remove_container: false,
    },
    items: [],
  } as Content.ProjectImageSectionSliceTwoVideos;
}

/**
 * Insert the fixture slice just after the first description slice (or at the
 * start) so the pair is easy to see without scrolling past the whole page.
 */
export function injectT151TwoVideosFixture<T extends { slice_type: string }>(
  slices: T[],
  mode: T151FixtureMode,
): T[] {
  const fixture = buildT151TwoVideosFixtureSlice(mode) as unknown as T;
  const descIdx = slices.findIndex((s) => s.slice_type === "description_slice");
  const at = descIdx >= 0 ? descIdx + 1 : 0;
  return [...slices.slice(0, at), fixture, ...slices.slice(at)];
}
