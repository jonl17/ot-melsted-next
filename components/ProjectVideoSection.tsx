"use client";

interface ProjectVideoSectionProps {
  videoUrl: string;
  container: boolean;
}

export default function ProjectVideoSection({
  videoUrl,
  container,
}: ProjectVideoSectionProps) {
  if (!videoUrl) return null;

  return (
    <div className="min-h-screen flex items-center justify-center px-8 py-24">
      <div className="w-full max-w-4xl mx-auto aspect-[6/4]">
        <video
          src={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
