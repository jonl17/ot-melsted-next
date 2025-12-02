import FrontpageHeroSlideshow from '@/components/FrontpageHeroSlideshow'
import { Content } from '@prismicio/client'
import { SliceComponentProps } from '@prismicio/react'

/**
 * Props for `FrontpageHeroSlice`.
 */
export type FrontpageHeroSliceProps =
  SliceComponentProps<Content.FrontpageHeroSliceSlice>

/**
 * Component for "FrontpageHeroSlice" Slices.
 */
const FrontpageHeroSlice = ({
  slice,
}: FrontpageHeroSliceProps) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <FrontpageHeroSlideshow slides={slice.primary.slides} />
    </section>
  )
}

export default FrontpageHeroSlice
