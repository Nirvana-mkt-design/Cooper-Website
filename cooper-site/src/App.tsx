import { useEffect, useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import HowCooperHelps from './components/HowCooperHelps'
import OnePlatform from './components/OnePlatform'
import Metrics from './components/Metrics'
import BuiltForEveryRole from './components/BuiltForEveryRole'
import InvestorStrip from './components/InvestorStrip'
import Integrations from './components/Integrations'
import SecurityCompliance from './components/SecurityCompliance'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Footer'
import DemoPage from './components/DemoPage'
import PersonaPage from './components/PersonaPage'
import AboutPage from './components/AboutPage'
import CareersPage from './components/CareersPage'
import CareerRolePage from './components/CareerRolePage'

// Reset scroll to the top on every route change so a new page never opens
// at the scroll height of the previous one. Honors #hash anchors when present.
function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView()
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}

function RevealSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add('revealed'), delay)
          observer.unobserve(el)
        }
      },
      { threshold: 0.08 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div ref={ref} className="reveal-section" style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <RevealSection>
        <HowCooperHelps />
      </RevealSection>
      <RevealSection>
        <OnePlatform />
      </RevealSection>
      <RevealSection>
        <Metrics />
      </RevealSection>
      {/* Testimonial hidden until real customer stories are available */}
      {/* <RevealSection>
        <Testimonial />
      </RevealSection> */}
      <RevealSection>
        <BuiltForEveryRole />
      </RevealSection>
      <RevealSection>
        <InvestorStrip />
      </RevealSection>
      {/* <RevealSection>
        <TeamSection />
      </RevealSection> */}
      <RevealSection>
        <Integrations />
      </RevealSection>
      <RevealSection>
        <FinalCTA />
      </RevealSection>
      <RevealSection>
        <SecurityCompliance />
      </RevealSection>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/careers/:roleId" element={<CareerRolePage />} />
        <Route path="/personas/:slug" element={<PersonaPage />} />
      </Routes>
    </>
  )
}
