import ModuleCarousel from "../../components/Carousel/ModuleCarousel";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import HeroSection from "./HeroSection";

function Home() {
  useDocumentTitle("Home");

  return (
    <>
      <HeroSection />
      <ModuleCarousel />
    </>
  );
}

export default Home;
