import Header from "./components/header";
import Hero from "./components/hero";
import CustomCursor from "./components/CustomCursor";
import TextMarquee from "./components/TextMarquee";
import WorkProcess from "./components/WorkProcess";
import SmoothScroll from "./components/SmoothScroll";
import AboutSection from "./components/AboutSection";
import ServicesSection from "./components/ServicesSection";
import ProjectsSlider from "./components/ProjectsSlider";
export default function App() {
  return (
    <>
      <Header />
      <Hero />
      <CustomCursor />
      <TextMarquee />
      <WorkProcess />
      <AboutSection />
      <SmoothScroll />
      <ServicesSection />
      <ProjectsSlider />
    </>
  );
}