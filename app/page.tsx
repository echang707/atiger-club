import Hero from "@/components/Hero";
import ScrollStory from "@/components/ScrollStory";
import UpcomingRows from "@/components/UpcomingRows";
import TigerWasHere from "@/components/TigerWasHere";
import Ending from "@/components/Ending";

export default function Home() {
  return (
    <main>
      <Hero />
      <ScrollStory />
      <UpcomingRows />
      <TigerWasHere />
      <Ending />
    </main>
  );
}
