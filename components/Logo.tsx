"use client";

import { useTheme } from "@/contexts/ThemeContext";
import Text from "./elements/Text";
import { getTailwindTransitionClasses } from "@/utils/slideshowConfig";

export default function Logo() {
  const { isDark, activeSection, setActiveSection } = useTheme();

  // Only use isDark colors when slideshow is active (section 0)
  // Section 1 (project showcase) and section 2 (about) have white backgrounds, so use black text
  const textColor =
    activeSection === 0
      ? (isDark ? "white" : "black")
      : activeSection === 1 || activeSection === 2
        ? "black"
        : "white";

  return (
    <div className="fixed top-12 left-0 right-0 flex justify-center z-50 w-full">
      <div
        onClick={() => setActiveSection(0)}
        className="cursor-pointer hover:opacity-70 transition-opacity"
      >
        <Text
          className={getTailwindTransitionClasses()}
          variant="medium"
          font="untitled-medium"
          color={textColor}
        >
          OT.Melsted
        </Text>
      </div>
    </div>
  );
}
