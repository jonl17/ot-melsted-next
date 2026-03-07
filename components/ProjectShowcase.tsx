"use client";

import { useState } from "react";
import { ProjectDocument } from "~prismicio-types-d";
import { PrismicNextImage } from "@prismicio/next";
import { useTheme } from "@/contexts/ThemeContext";
import Text from "./elements/Text";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  contentFadeTransition,
  getSectionDirection,
  getSectionVariants,
  sectionTransition,
} from "@/utils/animationConfig";

interface ProjectShowcaseProps {
  projectDocuments: ProjectDocument[];
}
const sectionVariants = getSectionVariants();

export default function ProjectShowcase({
  projectDocuments,
}: ProjectShowcaseProps) {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const { activeSection, previousSection } = useTheme();
  const direction = getSectionDirection(activeSection, previousSection);

  return (
    <AnimatePresence mode="wait" initial={false} custom={direction}>
      {activeSection === 1 && (
        <motion.div
          key="projects-section"
          custom={direction}
          variants={sectionVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={sectionTransition}
          className="fixed inset-0 w-screen h-screen bg-white flex"
        >
          {/* Left side - Project list */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={contentFadeTransition}
            className="flex-1 overflow-y-auto project-list-scroll px-6 py-24 md:pl-16 md:pr-8 md:py-16"
          >
            <div className="flex flex-col gap-0.5 pb-10 md:grid md:grid-cols-[auto_auto] md:gap-x-32 md:gap-y-0 md:pb-16">
              {projectDocuments.map((project) => (
                <Link
                  key={project.id}
                  href={`/project/${project.uid}`}
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                  className="transition-opacity md:col-span-2 md:grid md:grid-cols-subgrid"
                >
                  <Text
                    variant="medium"
                    font="untitled-medium"
                    color={hoveredProject === project.id ? "darkgray" : "black"}
                    className="md:text-large"
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
                      className="hidden md:block"
                    >
                      {project.tags.join(", ")}
                    </Text>
                  ) : (
                    <div className="hidden md:block" />
                  )}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Right side - Featured image */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={contentFadeTransition}
            className="hidden flex-1 items-center justify-center p-16 md:flex"
          >
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
