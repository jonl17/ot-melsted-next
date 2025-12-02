import ProjectVideoSection from '@/components/ProjectVideoSection'
import { Content } from '@prismicio/client'
import { SliceComponentProps } from '@prismicio/react'

/**
 * Props for `ProjectVideoSectionSlice`.
 */
export type ProjectVideoSectionSliceProps =
  SliceComponentProps<Content.ProjectVideoSectionSliceSlice>

/**
 * Component for "ProjectVideoSectionSlice" Slices.
 */
const ProjectVideoSectionSlice = ({
  slice,
}: ProjectVideoSectionSliceProps) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <ProjectVideoSection
        // @ts-ignore
        videoUrl={slice.primary.video.url}
        container={!slice.primary.remove_container}
      />
    </section>
  )
}

export default ProjectVideoSectionSlice
