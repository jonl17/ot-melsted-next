import ProjectShowcase from '@/components/ProjectShowcase'
import { Content } from '@prismicio/client'
import { SliceComponentProps } from '@prismicio/react'
import { ProjectDocument } from '~prismicio-types-d'
import { createClient } from '@/prismicio'

/**
 * Props for `ProjectShowcaseSlice`.
 */
export type ProjectShowcaseSliceProps =
  SliceComponentProps<Content.ProjectShowcaseSliceSlice>

/**
 * Component for "ProjectShowcaseSlice" Slices.
 */
export default async function ProjectShowcaseSlice({
  slice,
}: ProjectShowcaseSliceProps) {
  const client = createClient()
  const projectDocuments = await client.getAllByIDs<ProjectDocument>(
    slice.items.map((item: any) => item.showcase.id)
  )

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <ProjectShowcase projectDocuments={projectDocuments} />
    </section>
  )
}
