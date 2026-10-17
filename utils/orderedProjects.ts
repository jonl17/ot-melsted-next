import { isFilled, Content } from "@prismicio/client";
import { createClient } from "@/prismicio";
import { ProjectDocument } from "~prismicio-types-d";

/**
 * Project IDs from the homepage showcase list, in the editor's order,
 * with empty entries skipped and duplicates removed (first occurrence wins).
 */
export function getShowcaseProjectIds(
  slice: Content.ProjectShowcaseSliceSlice
): string[] {
  const seen = new Set<string>();
  const ids: string[] = [];
  for (const item of slice.items) {
    if (!isFilled.contentRelationship(item.showcase)) continue;
    const id = item.showcase.id;
    if (seen.has(id)) continue;
    seen.add(id);
    ids.push(id);
  }
  return ids;
}

/**
 * Fetches the showcase projects and returns them in the editor's order.
 * getAllByIDs returns Prismic's own order, so results are re-sorted here.
 */
export async function getOrderedShowcaseProjects(
  slice: Content.ProjectShowcaseSliceSlice,
  client = createClient()
): Promise<ProjectDocument[]> {
  const ids = getShowcaseProjectIds(slice);
  if (ids.length === 0) return [];
  const docs = await client.getAllByIDs<ProjectDocument>(ids);
  const byId = new Map(docs.map((d) => [d.id, d]));
  return ids
    .map((id) => byId.get(id))
    .filter((d): d is ProjectDocument => Boolean(d));
}
