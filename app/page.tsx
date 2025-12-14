import { createClient } from "@/prismicio";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import Logo from "@/components/Logo";
import NavigationDots from "@/components/NavigationDots";
import About from "@/components/About";

export default async function Home() {
  const client = createClient();
  const homepage = await client.getSingle("homepage");
  const pageSettings = await client.getSingle("page_settings");

  console.log("Homepage data:", homepage);

  return (
    <div className="bg-black min-h-screen">
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
