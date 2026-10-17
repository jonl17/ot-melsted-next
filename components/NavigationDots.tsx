"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { getTailwindTransitionClasses } from "@/utils/slideshowConfig";

export default function NavigationDots() {
  const { isDark, activeSection, setActiveSection } = useTheme();
  const transitionClasses = getTailwindTransitionClasses();

  const getButtonColor = (index: number) => {
    const isActive = activeSection === index;

    // Inactive dots are always gray
    if (!isActive) return "bg-darkgray";

    // Active dot: use brightness detection when slideshow is active (section 0)
    if (activeSection === 0) {
      return isDark ? "bg-white" : "bg-black";
    }

    // Active dot on section 1 (project showcase) and section 2 (about) with white bg: black
    if (activeSection === 1 || activeSection === 2) {
      return "bg-black";
    }

    // Active dot on other sections: white
    return "bg-white";
  };

  return (
    <div className="fixed bottom-[34px] left-0 right-0 flex justify-center z-50">
      <button
        type="button"
        onClick={() => setActiveSection(0)}
        aria-label="Go to slideshow"
        aria-current={activeSection === 0 ? "true" : undefined}
        className="inline-flex min-w-11 min-h-11 items-center justify-center"
      >
        <span
          aria-hidden="true"
          className={`block w-4 h-4 ${transitionClasses} ${getButtonColor(0)}`}
        />
      </button>
      <button
        type="button"
        onClick={() => setActiveSection(1)}
        aria-label="Go to projects"
        aria-current={activeSection === 1 ? "true" : undefined}
        className="inline-flex min-w-11 min-h-11 items-center justify-center"
      >
        <span
          aria-hidden="true"
          className={`block w-4 h-4 ${transitionClasses} ${getButtonColor(1)}`}
        />
      </button>
      <button
        type="button"
        onClick={() => setActiveSection(2)}
        aria-label="Go to about"
        aria-current={activeSection === 2 ? "true" : undefined}
        className="inline-flex min-w-11 min-h-11 items-center justify-center"
      >
        <span
          aria-hidden="true"
          className={`block w-4 h-4 ${transitionClasses} ${getButtonColor(2)}`}
        />
      </button>
    </div>
  );
}
