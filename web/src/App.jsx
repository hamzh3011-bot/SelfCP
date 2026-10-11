import { useEffect, useState } from 'react'
import AdminPanel from './components/AdminPanel'
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
import { useSiteContent } from './data/siteStore'

export default function App() {
  const { brand } = useSiteContent()
  const [adminOpen, setAdminOpen] = useState(false)

  // The admin panel's site name also drives the browser tab.
  useEffect(() => {
    document.title = `${brand.name} | ${brand.tagline}`
  }, [brand.name, brand.tagline])

  return (
    <>
      <Navbar onSecretOpen={() => setAdminOpen(true)} />
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
      <AdminPanel open={adminOpen} onClose={() => setAdminOpen(false)} />
    </>
  )
}
