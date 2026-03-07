import * as prismic from "@prismicio/client";
import { createClient } from "@/prismicio";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import Logo from "@/components/Logo";
import NavigationDots from "@/components/NavigationDots";
import About from "@/components/About";
import ScreensaverOverlay from "@/components/ScreensaverOverlay";

export default async function Home() {
  const client = createClient();
  const homepage = await client.getSingle("homepage");
  const pageSettings = await client.getSingle("page_settings");
  const screensaverUrl = prismic.isFilled.linkToMedia(
    pageSettings.data.screensaver,
  )
    ? pageSettings.data.screensaver.url
    : null;

  return (
    <div className="min-h-screen">
      <ScreensaverOverlay videoUrl={screensaverUrl} />
      <Logo />
      <SliceZone slices={homepage.data.slices} components={components} />
      <About
        aboutText={pageSettings.data.about_text}
        contactBox={pageSettings.data.contact_box}
      />
      <NavigationDots />
    </div>
  );
}
