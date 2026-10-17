import { createClient } from "@/prismicio";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import { notFound } from "next/navigation";
import Link from "next/link";
import Text from "@/components/elements/Text";
import NextProject from "@/components/NextProject/NextProject";
import { ProjectDocument } from "~prismicio-types-d";
import { Content } from "@prismicio/client";
import { getOrderedShowcaseProjects } from "@/utils/orderedProjects";

// Render unknown uids on demand (new projects published after the last build)
export const dynamicParams = true;

interface ProjectPageProps {
  params: Promise<{ uid: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { uid } = await params;
  const client = createClient();

  const project = await client
    .getByUID<ProjectDocument>("project", uid)
    .catch(() => null);
  if (!project) notFound();

  {

    // Get all projects in the same order as the homepage
    const homepage = await client.getSingle("homepage");
    const projectShowcaseSlice = homepage.data.slices.find(
      (slice) => slice.slice_type === "project_showcase_slice"
    );

    let nextProjectData = null;
    if (projectShowcaseSlice) {
      const allProjects = await getOrderedShowcaseProjects(
        projectShowcaseSlice as Content.ProjectShowcaseSliceSlice,
        client
      );

      // Find current project index
      const currentIndex = allProjects.findIndex((p) => p.uid === uid);
      if (currentIndex !== -1) {
        // Get next project (wrap to first if at the end)
        const nextIndex = (currentIndex + 1) % allProjects.length;
        const nextProject = allProjects[nextIndex];

        // Find the first description slice in the next project
        const descriptionSlice = nextProject.data.slices.find(
          (slice) => slice.slice_type === "description_slice"
        ) as Content.DescriptionSliceSlice | undefined;

        if (descriptionSlice && "text" in descriptionSlice.primary) {
          nextProjectData = {
            uid: nextProject.uid || "",
            title: nextProject.data.title || "",
            descriptionText: descriptionSlice.primary.text,
            descriptionSmallText: descriptionSlice.primary.small_text || "",
          };
        }
      }
    }

    return (
      <div className="bg-white min-h-screen relative pb-[calc(76px+env(safe-area-inset-bottom))] md:pb-[calc(92px+env(safe-area-inset-bottom))]">
        {/* All rows share one vertical gap (--project-row-gap) */}
        <div className="project-rows">
          <SliceZone slices={project.data.slices} components={components} />
        </div>

        {/* Next Project Section */}
        {nextProjectData && (
          <NextProject
            nextProjectUid={nextProjectData.uid}
            nextProjectTitle={nextProjectData.title}
            nextProjectDescriptionText={nextProjectData.descriptionText}
            nextProjectDescriptionSmallText={
              nextProjectData.descriptionSmallText
            }
          />
        )}

        {/* Bottom title/close bar. Content above reserves its height via bottom padding. */}
        <div className="fixed left-0 bottom-0 z-40 flex items-center justify-between gap-8 w-full bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] md:px-12 md:py-6 md:pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
          <Text variant="large-mobile" color="black">
            {project.data.title}
          </Text>
          <Link
            href="/"
            aria-label="Close"
            className="inline-flex min-w-11 min-h-11 items-center justify-center"
          >
            <Text
              variant="large-mobile"
              color="black"
              className="cursor-pointer hover:opacity-70 transition-opacity"
            >
              X
            </Text>
          </Link>
        </div>
      </div>
    );
  }
}
