import { Container } from "react-bootstrap";
import ModuleCarousel from "../../components/Carousel/ModuleCarousel";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import HeroSection from "./HeroSection";

function Home() {
  useDocumentTitle("Home");

  return (
    <Container className="my-2">
      <HeroSection />
      <ModuleCarousel />
    </Container>
  );
}

export default Home;
