import { useState, useEffect, useRef } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import HowCooperHelps from './components/HowCooperHelps'
import OnePlatform from './components/OnePlatform'
import Metrics from './components/Metrics'
import Testimonial from './components/Testimonial'
import BuiltForEveryRole from './components/BuiltForEveryRole'
import TeamSection from './components/TeamSection'
import Integrations from './components/Integrations'
import SecurityCompliance from './components/SecurityCompliance'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Footer'
import DemoPage from './components/DemoPage'

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

export default function App() {
  const [page, setPage] = useState(window.location.hash === '#demo' ? 'demo' : 'home')

  useEffect(() => {
    const onHash = () => setPage(window.location.hash === '#demo' ? 'demo' : 'home')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  if (page === 'demo') {
    return <DemoPage />
  }

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
      <RevealSection>
        <Testimonial />
      </RevealSection>
      <RevealSection>
        <BuiltForEveryRole />
      </RevealSection>
      <RevealSection>
        <TeamSection />
      </RevealSection>
      <RevealSection>
        <Integrations />
      </RevealSection>
      <RevealSection>
        <SecurityCompliance />
      </RevealSection>
      <RevealSection>
        <FinalCTA />
      </RevealSection>
      <Footer />
    </div>
  )
}
