import ProjectDescription from '@/components/ProjectDescription/ProjectDescription'
import { Content } from '@prismicio/client'
import { SliceComponentProps } from '@prismicio/react'

/**
 * Props for `DescriptionSlice`.
 */
export type DescriptionSliceProps =
  SliceComponentProps<Content.DescriptionSliceSlice>

/**
 * Component for "DescriptionSlice" Slices.
 */
const DescriptionSlice = ({ slice }: DescriptionSliceProps) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <ProjectDescription
        text={slice.primary.text}
        smallText={slice.primary.small_text ?? ''}
      />
    </section>
  )
}

export default DescriptionSlice
