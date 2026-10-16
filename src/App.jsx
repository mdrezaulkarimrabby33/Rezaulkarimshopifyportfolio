import Header from "./components/header";
import Hero from "./components/hero";
import CustomCursor from "./components/CustomCursor";
import TextMarquee from "./components/TextMarquee";
import WorkProcess from "./components/WorkProcess";
import SmoothScroll from "./components/SmoothScroll";
import AboutSection from "./components/AboutSection";
import ServicesSection from "./components/ServicesSection";
import ProjectsSlider from "./components/ProjectsSlider";
import ContactServices from "./components/ContactServices";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <SmoothScroll />
      <CustomCursor />
      <Header />

      <main className="relative z-10 bg-[#F2EFE9]">
        <Hero />
        <TextMarquee />
        <WorkProcess />
        <AboutSection />
        <ServicesSection />
        <ProjectsSlider />
        <ContactServices />
      </main>

      <Footer />
    </>
  );
}