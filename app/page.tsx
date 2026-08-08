import Hero from "@/components/Hero";
import MediumsSpread from "@/components/MediumsSpread";
import ScrollStory from "@/components/ScrollStory";
import UpcomingRows from "@/components/UpcomingRows";
import Ending from "@/components/Ending";

export default function Home() {
  return (
    <main>
      <Hero />
      <MediumsSpread />
      <ScrollStory />
      <UpcomingRows />
      <Ending />
    </main>
  );
}
