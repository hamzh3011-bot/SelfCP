import Airlines from './components/Airlines'
import Destinations from './components/Destinations'
import Experience from './components/Experience'
import Faq from './components/Faq'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Inspiration from './components/Inspiration'
import Navbar from './components/Navbar'
import Newsletter from './components/Newsletter'
import Packages from './components/Packages'
import Services from './components/Services'
import Stats from './components/Stats'
import Testimonials from './components/Testimonials'
import WhyUs from './components/WhyUs'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Destinations />
        <Services />
        <WhyUs />
        <Experience />
        <Airlines />
        <Packages />
        <Testimonials />
        <Stats />
        <Inspiration />
        <Newsletter />
        <Faq />
      </main>
      <Footer />
    </>
  )
}
