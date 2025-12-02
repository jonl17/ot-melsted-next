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

    // Active dot on other sections: white
    return "bg-white";
  };

  return (
    <div className="fixed bottom-12 left-0 right-0 flex justify-center gap-4 z-50">
      <button
        onClick={() => setActiveSection(0)}
        className={`w-4 h-4 ${transitionClasses} ${getButtonColor(0)}`}
      />
      <button
        onClick={() => setActiveSection(1)}
        className={`w-4 h-4 ${transitionClasses} ${getButtonColor(1)}`}
      />
      <button
        onClick={() => setActiveSection(2)}
        className={`w-4 h-4 ${transitionClasses} ${getButtonColor(2)}`}
      />
    </div>
  );
}
