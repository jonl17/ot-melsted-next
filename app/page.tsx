import { createClient } from "@/prismicio";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import Logo from "@/components/Logo";
import NavigationDots from "@/components/NavigationDots";

export default async function Home() {
  const client = createClient();
  const homepage = await client.getSingle("homepage");

  console.log("Homepage data:", homepage);

  return (
    <div className="bg-black min-h-screen">
      <Logo />
      <SliceZone slices={homepage.data.slices} components={components} />
      <NavigationDots />
    </div>
  );
}
