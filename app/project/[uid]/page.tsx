import { createClient } from "@/prismicio";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import { notFound } from "next/navigation";
import Link from "next/link";
import Text from "@/components/elements/Text";
import NextProject from "@/components/NextProject/NextProject";
import { ProjectDocument } from "~prismicio-types-d";

interface ProjectPageProps {
  params: Promise<{ uid: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { uid } = await params;
  const client = createClient();

  try {
    const project = await client.getByUID("project", uid);

    // Get all projects in the same order as the homepage
    const homepage = await client.getSingle("homepage");
    const projectShowcaseSlice = homepage.data.slices.find(
      (slice: any) => slice.slice_type === "project_showcase_slice"
    );

    let nextProjectData = null;
    if (projectShowcaseSlice) {
      const projectIds = projectShowcaseSlice.items.map(
        (item: any) => item.showcase.id
      );
      const allProjects = await client.getAllByIDs<ProjectDocument>(projectIds);

      // Find current project index
      const currentIndex = allProjects.findIndex((p) => p.uid === uid);
      if (currentIndex !== -1) {
        // Get next project (wrap to first if at the end)
        const nextIndex = (currentIndex + 1) % allProjects.length;
        const nextProject = allProjects[nextIndex];

        // Find the first description slice in the next project
        const descriptionSlice = nextProject.data.slices.find(
          (slice: any) => slice.slice_type === "description_slice"
        );

        if (descriptionSlice) {
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
      <div className="bg-white min-h-screen relative">
        <SliceZone slices={project.data.slices} components={components} />

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

        {/* Bottom left navigation */}
        <div className="fixed left-0 bottom-0 flex items-center justify-between gap-8 w-full p-12">
          <Text variant="large-mobile" color="black">
            {project.data.title}
          </Text>
          <Link href="/">
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
  } catch (error) {
    notFound();
  }
}
