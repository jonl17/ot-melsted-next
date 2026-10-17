import ProjectShowcase from "@/components/ProjectShowcase";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { getOrderedShowcaseProjects } from "@/utils/orderedProjects";

/**
 * Props for `ProjectShowcaseSlice`.
 */
export type ProjectShowcaseSliceProps =
  SliceComponentProps<Content.ProjectShowcaseSliceSlice>;

/**
 * Component for "ProjectShowcaseSlice" Slices.
 */
export default async function ProjectShowcaseSlice({
  slice,
}: ProjectShowcaseSliceProps) {
  const projectDocuments = await getOrderedShowcaseProjects(slice);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <ProjectShowcase projectDocuments={projectDocuments} />
    </section>
  );
}
