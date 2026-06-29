import { useEffect, useRef } from 'react'
import { Routes, Route } from 'react-router-dom'
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
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/demo" element={<DemoPage />} />
      <Route path="/personas/:slug" element={<PersonaPage />} />
    </Routes>
  )
}
