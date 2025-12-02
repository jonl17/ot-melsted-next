import ProjectImageSection from '@/components/ProjectImageSection/ProjectImageSection'
import { Content } from '@prismicio/client'
import { SliceComponentProps } from '@prismicio/react'

/**
 * Props for `ProjectImageSection`.
 */
export type ProjectImageSectionProps =
  SliceComponentProps<Content.ProjectImageSectionSlice>

/**
 * Component for "ProjectImageSection" Slices.
 */
const ProjectImageSectionSlice = ({
  slice,
}: ProjectImageSectionProps) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <ProjectImageSection
        firstImage={slice.primary.first_image}
        secondImage={slice.primary.second_image}
        container={!slice.primary.remove_container}
      />
    </section>
  )
}

export default ProjectImageSectionSlice
