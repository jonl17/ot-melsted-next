"use client";

import { useState } from "react";
import { ProjectDocument } from "~prismicio-types-d";
import { PrismicNextImage } from "@prismicio/next";
import { useTheme } from "@/contexts/ThemeContext";
import Text from "./elements/Text";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectShowcaseProps {
  projectDocuments: ProjectDocument[];
}

export default function ProjectShowcase({
  projectDocuments,
}: ProjectShowcaseProps) {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const { activeSection, previousSection } = useTheme();

  // Determine slide direction based on section navigation
  const direction = previousSection < activeSection ? -1 : 1;
  const slideOffset = 25 * direction;

  return (
    <AnimatePresence mode="wait">
      {activeSection === 1 && (
        <motion.div
          key="projects-section"
          initial={{ x: -slideOffset, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: slideOffset, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 w-screen h-screen bg-white flex"
        >
          {/* Left side - Project list */}
          <div className="flex-1 pl-16 pr-8 py-16 overflow-y-auto project-list-scroll">
            <div className="grid grid-cols-[auto_auto] gap-x-32 pb-16">
              {projectDocuments.map((project) => (
                <Link
                  key={project.id}
                  href={`/project/${project.uid}`}
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                  className="col-span-2 grid grid-cols-subgrid transition-opacity"
                >
                  <Text
                    variant="large"
                    font="untitled-medium"
                    color={hoveredProject === project.id ? "darkgray" : "black"}
                  >
                    {project.data.title}
                  </Text>
                  {project.tags && project.tags.length > 0 ? (
                    <Text
                      variant="large"
                      font="untitled-medium"
                      color={
                        hoveredProject === project.id ? "darkgray" : "black"
                      }
                    >
                      {project.tags.join(", ")}
                    </Text>
                  ) : (
                    <div />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side - Featured image */}
          <div className="flex-1 flex items-center justify-center p-16">
            <div className="relative w-full h-full max-w-2xl max-h-[80vh]">
              {projectDocuments.map((project) => {
                const isHovered = project.id === hoveredProject;
                if (!project.data.featured_image?.url) return null;

                return (
                  <div
                    key={project.id}
                    className={`absolute inset-0 transition-opacity duration-300 ${
                      isHovered ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <PrismicNextImage
                      field={project.data.featured_image}
                      className="w-full h-full object-contain"
                      fallbackAlt=""
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
