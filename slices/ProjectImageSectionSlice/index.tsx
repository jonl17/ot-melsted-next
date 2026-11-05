import ProjectImageSection from '@/components/ProjectImageSection/ProjectImageSection'
import ProjectVideoImageSection from '@/components/ProjectVideoImageSection/ProjectVideoImageSection'
import ProjectTwoVideosSection from '@/components/ProjectTwoVideosSection/ProjectTwoVideosSection'
import { Content } from '@prismicio/client'
import { SliceComponentProps } from '@prismicio/react'

/**
 * Props for `ProjectImageSection`.
 */
export type ProjectImageSectionProps =
  SliceComponentProps<Content.ProjectImageSectionSlice>

/**
 * Component for "ProjectImageSection" Slices.
 * - default: one or two images.
 * - videoAndImage: a video and a photo side by side (T-120).
 * - twoVideos: two videos side by side (T-151).
 */
const ProjectImageSectionSlice = ({
  slice,
}: ProjectImageSectionProps) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      {slice.variation === 'twoVideos' ? (
        <ProjectTwoVideosSection
          firstVideoUrl={
            slice.primary.first_video && 'url' in slice.primary.first_video
              ? slice.primary.first_video.url ?? ''
              : ''
          }
          secondVideoUrl={
            slice.primary.second_video && 'url' in slice.primary.second_video
              ? slice.primary.second_video.url ?? ''
              : ''
          }
          firstPosterUrl={slice.primary.first_poster?.url ?? undefined}
          secondPosterUrl={slice.primary.second_poster?.url ?? undefined}
          container={!slice.primary.remove_container}
        />
      ) : slice.variation === 'videoAndImage' ? (
        <ProjectVideoImageSection
          videoUrl={
            slice.primary.video && 'url' in slice.primary.video
              ? slice.primary.video.url ?? ''
              : ''
          }
          posterUrl={slice.primary.poster?.url ?? undefined}
          image={slice.primary.image}
          videoOnRight={Boolean(slice.primary.video_on_right)}
          container={!slice.primary.remove_container}
        />
      ) : (
        <ProjectImageSection
          firstImage={slice.primary.first_image}
          secondImage={slice.primary.second_image}
          container={!slice.primary.remove_container}
        />
      )}
    </section>
  )
}

export default ProjectImageSectionSlice
