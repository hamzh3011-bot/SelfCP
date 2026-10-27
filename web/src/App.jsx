import Hero from "./components/Hero.jsx";
import MenuSection from "./components/MenuSection.jsx";
import StorySection from "./components/StorySection.jsx";
import ValuesStrip from "./components/ValuesStrip.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <div dir="rtl" lang="fa" className="min-h-screen bg-cream">
      <main>
        <Hero />
        <MenuSection />
        <StorySection />
        <ValuesStrip />
      </main>
      <Footer />
    </div>
  );
}
