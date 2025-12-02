import ProjectBanner from '@/components/ProjectBanner'
import { Content } from '@prismicio/client'
import { SliceComponentProps } from '@prismicio/react'

/**
 * Props for `ProjectBanner`.
 */
export type ProjectBannerProps = SliceComponentProps<Content.ProjectBannerSlice>

/**
 * Component for "ProjectBanner" Slices.
 */
const ProjectBannerSlice = ({ slice }: ProjectBannerProps) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <ProjectBanner image={slice.primary.image} />
    </section>
  )
}

export default ProjectBannerSlice
