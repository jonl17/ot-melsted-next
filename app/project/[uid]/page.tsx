import { createClient } from "@/prismicio";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import { notFound } from "next/navigation";
import Link from "next/link";
import Text from "@/components/elements/Text";

interface ProjectPageProps {
  params: Promise<{ uid: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { uid } = await params;
  const client = createClient();

  try {
    const project = await client.getByUID("project", uid);

    return (
      <div className="bg-white min-h-screen relative">
        <SliceZone slices={project.data.slices} components={components} />

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
