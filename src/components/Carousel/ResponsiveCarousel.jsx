import { useWindowWidth } from "../../hooks/useWindowWidth";

import Container from "react-bootstrap/Container";
import Carousel from "react-bootstrap/Carousel";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./ResponsiveCarousel.css";

const DEFAULT_BREAKPOINTS = {
  // Key is the minimum width, value is the number of items to show on one slide.
  // This maintains the current behavior as a default: 1 item < 768px, 3 items >= 768px.
  768: 3, // For 'md' and up
  0: 1, // Default for 'xs'
};

export default function ResponsiveCarousel({
  items = [],
  itemRenderer,
  breakpoints = DEFAULT_BREAKPOINTS, // For slide logic
  colProps = { xs: 12, md: 4 }, // For column rendering
}) {
  const windowWidth = useWindowWidth();

  let itemsPerSlide = 1;
  const sortedBreakpoints = Object.keys(breakpoints).sort((a, b) => b - a);

  for (const minWidth of sortedBreakpoints) {
    if (windowWidth >= Number(minWidth)) {
      itemsPerSlide = breakpoints[minWidth];
      break;
    }
  }

  const slides = [];
  for (let i = 0; i < items.length; i += itemsPerSlide) {
    slides.push(items.slice(i, i + itemsPerSlide));
  }

  return (
    <Container>
      <Carousel indicators={false} interval={null}>
        {slides.map((slideItems, slideIndex) => (
          <Carousel.Item key={slideIndex}>
            <Row>
              {slideItems.map((item, itemIndex) => (
                <Col key={item.id || itemIndex} {...colProps}>
                  {itemRenderer(item)}
                </Col>
              ))}
            </Row>
          </Carousel.Item>
        ))}
      </Carousel>
    </Container>
  );
}
