"use client";

import { useTheme } from "@/contexts/ThemeContext";
import Text from "./elements/Text";
import { getTailwindTransitionClasses } from "@/utils/slideshowConfig";

export default function Logo() {
  const { isDark, activeSection } = useTheme();

  // Only use isDark colors when slideshow is active (section 0)
  const textColor =
    activeSection === 0 ? (isDark ? "white" : "black") : "white";

  return (
    <div className="fixed top-12 left-0 right-0 flex justify-center z-50 w-full">
      <div>
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
