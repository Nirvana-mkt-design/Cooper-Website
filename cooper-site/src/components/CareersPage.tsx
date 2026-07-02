import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

/* ── Scroll reveal ── */
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

/* ── Team photos for marquee ── */
const teamPhotos = [
  '/images/careers/IMG_2940.jpg',
  '/images/careers/IMG_5227.jpg',
  '/images/careers/IMG_2941.jpg',
  '/images/careers/IMG_7892.jpg',
  '/images/careers/IMG_2942.jpg',
  '/images/careers/IMG_3044.jpg',
  '/images/careers/IMG_7951.jpg',
  '/images/careers/IMG_2943.jpg',
  '/images/careers/IMG_8809.jpg',
  '/images/careers/IMG_3113.jpg',
  '/images/careers/IMG_2953.jpg',
  '/images/careers/IMG_9381.jpg',
  '/images/careers/IMG_3224.jpg',
  '/images/careers/IMG_2954.jpg',
  '/images/careers/IMG_3225.jpg',
  '/images/careers/IMG_3423.jpg',
  '/images/careers/IMG_3462.jpg',
  '/images/careers/image-1.jpg',
  '/images/careers/WhatsApp Image 2026-06-22 at 15.35.21.jpeg',
]

/* ── Investors ── */
const investors = [
  { name: 'Lightspeed', image: '/images/about/investor-2.png' },
  { name: 'General Catalyst', image: '/images/about/investor-3.png' },
  { name: 'Valor Equity Partners', image: '/images/about/investor-1.png' },
]

/* ── Roles data ── */
export interface Role {
  id: string
  title: string
  department: string
  location: string
  type: string
  description: string
  responsibilities: string[]
  qualifications: string[]
  niceToHave: string[]
  salary?: string
}

export const roles: Role[] = [
  {
    id: 'senior-fullstack-engineer',
    title: 'Senior Full-Stack Engineer',
    department: 'Engineering',
    location: 'San Francisco, CA / Remote',
    type: 'Full-time',
    description: 'You will build the core product that insurance professionals rely on every day. This means working across the stack, from React frontends to Python services that orchestrate LLM pipelines, retrieval systems, and document processing. You will ship features end-to-end and own the full lifecycle from prototype to production.',
    responsibilities: [
      'Design, build, and ship full-stack features across our React + TypeScript frontend and Python backend',
      'Build and optimize LLM-powered pipelines for document understanding, extraction, and summarization',
      'Collaborate directly with insurance domain experts to translate workflow requirements into product',
      'Own the reliability of the systems you build, including monitoring, alerting, and incident response',
      'Mentor junior engineers and contribute to architectural decisions',
    ],
    qualifications: [
      '5+ years of professional software engineering experience',
      'Strong proficiency in TypeScript/React and Python',
      'Experience building and deploying production ML or LLM-powered systems',
      'Comfort with ambiguity and ability to make pragmatic technical decisions',
      'Excellent written and verbal communication skills',
    ],
    niceToHave: [
      'Experience in insurance, fintech, or other regulated industries',
      'Familiarity with RAG architectures, vector databases, or document processing pipelines',
      'Prior experience at an early-stage startup (Series A or earlier)',
    ],
    salary: '$180K - $240K + equity',
  },
  {
    id: 'ml-engineer',
    title: 'Machine Learning Engineer',
    department: 'Engineering',
    location: 'San Francisco, CA / Remote',
    type: 'Full-time',
    description: 'You will push the boundaries of what AI can do in commercial insurance. From fine-tuning models on domain-specific data to building evaluation frameworks that catch subtle regressions, your work directly determines how much our customers can trust Cooper.',
    responsibilities: [
      'Fine-tune and evaluate LLMs for insurance-specific tasks like policy comparison, risk assessment, and document extraction',
      'Build robust evaluation pipelines and benchmarks that measure real-world accuracy',
      'Design retrieval-augmented generation (RAG) systems optimized for long, complex insurance documents',
      'Collaborate with product and domain experts to define what "correct" means for each use case',
      'Stay current with the rapidly evolving LLM landscape and bring relevant innovations to the team',
    ],
    qualifications: [
      '3+ years of experience in machine learning, NLP, or a related field',
      'Hands-on experience fine-tuning and deploying large language models',
      'Strong Python skills and familiarity with ML frameworks (PyTorch, Hugging Face, etc.)',
      'Experience building evaluation frameworks for generative AI systems',
      'Ability to communicate technical trade-offs clearly to non-technical stakeholders',
    ],
    niceToHave: [
      'Published research in NLP, information extraction, or document understanding',
      'Experience with insurance or financial services data',
      'Familiarity with prompt engineering techniques and multi-agent architectures',
    ],
    salary: '$190K - $260K + equity',
  },
  {
    id: 'product-designer',
    title: 'Product Designer',
    department: 'Design',
    location: 'San Francisco, CA / Remote',
    type: 'Full-time',
    description: 'You will shape how insurance professionals interact with AI. This is not a "make the chatbot pretty" role. You will design workflows that handle complex, high-stakes tasks where trust, clarity, and precision matter more than delight. The best interface is one that makes a 30-year underwriter feel like Cooper has been on their desk forever.',
    responsibilities: [
      'Own the end-to-end design process from research and wireframes to polished, production-ready specs',
      'Conduct user research with insurance professionals to understand their actual workflows and pain points',
      'Design complex interaction patterns for document review, comparison, and AI-assisted decision-making',
      'Build and maintain our design system, ensuring consistency across the product',
      'Work closely with engineering to ship high-quality experiences on tight timelines',
    ],
    qualifications: [
      '4+ years of product design experience, ideally on B2B or enterprise tools',
      'Strong systems thinking and ability to design for complex, multi-step workflows',
      'Proficiency in Figma and comfort with prototyping tools',
      'Portfolio demonstrating both visual craft and thoughtful UX problem-solving',
      'Experience working directly with engineers in a fast-moving environment',
    ],
    niceToHave: [
      'Experience designing for regulated industries (insurance, finance, healthcare)',
      'Familiarity with AI/LLM product patterns and responsible AI design',
      'Experience building or contributing to design systems from scratch',
    ],
    salary: '$160K - $210K + equity',
  },
  {
    id: 'account-executive',
    title: 'Account Executive',
    department: 'Go-to-Market',
    location: 'San Francisco, CA / Remote',
    type: 'Full-time',
    description: 'You will be one of the first dedicated sales hires at Cooper, selling directly to insurance agency principals, brokerage leaders, and carrier executives. This is a consultative, technical sale where understanding the customer\'s workflow matters as much as your closing skills.',
    responsibilities: [
      'Own the full sales cycle from prospecting through close for mid-market and enterprise insurance accounts',
      'Build deep relationships with agency principals, brokerage VPs, and carrier innovation teams',
      'Run discovery calls, product demos, and POC processes that map Cooper to specific customer workflows',
      'Collaborate with product and engineering to relay customer feedback and influence the roadmap',
      'Help define and refine the sales playbook, messaging, and competitive positioning',
    ],
    qualifications: [
      '3+ years of B2B SaaS sales experience, consistently meeting or exceeding quota',
      'Experience selling to insurance, financial services, or similar regulated industries',
      'Strong consultative selling skills with the ability to navigate complex buying committees',
      'Comfort with technical products and the ability to demo software confidently',
      'Self-starter mentality suited to an early-stage environment with limited playbooks',
    ],
    niceToHave: [
      'Existing relationships in the P&C insurance industry',
      'Experience selling AI/ML or automation products',
      'Prior experience as an early sales hire at a startup',
    ],
    salary: '$130K - $160K base + uncapped commission + equity',
  },
  {
    id: 'founding-insurance-strategist',
    title: 'Founding Insurance Strategist',
    department: 'Go-to-Market',
    location: 'San Francisco, CA / Remote',
    type: 'Full-time',
    description: 'You will be the bridge between Cooper\'s AI capabilities and the insurance industry\'s real-world complexity. Part domain expert, part product advisor, part customer advocate, you will ensure that everything we build actually works the way insurance professionals need it to.',
    responsibilities: [
      'Serve as the internal authority on commercial insurance workflows, terminology, and market dynamics',
      'Work with product and engineering to define requirements rooted in actual industry practice',
      'Lead customer onboarding and implementation, translating Cooper\'s capabilities to their specific workflows',
      'Create training materials, documentation, and playbooks for both customers and internal teams',
      'Identify new market segments and use cases where Cooper can deliver outsized value',
    ],
    qualifications: [
      '7+ years of experience in commercial insurance (agency, brokerage, carrier, or MGA)',
      'Deep understanding of submission workflows, underwriting processes, and policy administration',
      'Strong communication skills, both written and verbal, with the ability to explain complex concepts simply',
      'Comfort with technology and genuine interest in how AI can transform insurance operations',
      'Entrepreneurial mindset and willingness to wear multiple hats in a startup environment',
    ],
    niceToHave: [
      'CPCU, CIC, or similar industry designations',
      'Experience with insurtech or digital transformation initiatives',
      'Prior startup experience or consulting background',
    ],
    salary: '$150K - $200K + equity',
  },
]

/* ── Department color helper ── */
function deptColor(dept: string) {
  switch (dept) {
    case 'Engineering': return 'bg-[#BA4309]/10 text-[#BA4309]'
    case 'Design': return 'bg-[#7C5E3C]/10 text-[#7C5E3C]'
    case 'Go-to-Market': return 'bg-[#2D6A4F]/10 text-[#2D6A4F]'
    default: return 'bg-dark/10 text-dark'
  }
}

export default function CareersPage() {
  const departments = [...new Set(roles.map(r => r.department))]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ══════════════════════════════════════════════
          HERO — reuse careers CTA background
          ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden min-h-screen">
        {/* Background layers — same pattern as About/Home hero */}
        <div className="absolute inset-0 bg-dark" />
        <img
          src="/images/careers-hero.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 mix-blend-hard-light"
          style={{
            backgroundImage: 'linear-gradient(261deg, rgba(186,67,9,0) 37%, rgba(186,67,9,0.36) 53%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(37deg, rgba(0,0,0,0.42) 47%, rgba(0,0,0,0) 77%)',
          }}
        />

        {/* Top frosted blur — darker tone */}
        <div
          className="absolute top-0 left-0 right-0 h-[102px] z-[5] opacity-60"
          style={{
            filter: 'blur(39.85px)',
            background: 'linear-gradient(to bottom, rgba(30,26,21,0.5), rgba(30,26,21,0))',
          }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-[102px] z-[5]"
          style={{
            backdropFilter: 'blur(6.3px)',
            WebkitBackdropFilter: 'blur(6.3px)',
            maskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-12 lg:px-[85px] pt-[200px] pb-[120px] min-h-screen flex flex-col justify-end">
          <span className="font-grotesk font-medium text-[11px] tracking-[1.4px] uppercase text-cream-light/70 mb-[16px] block animate-fade-blur-in">
            Careers at Cooper
          </span>
          <h1 className="font-serif text-[40px] leading-[44px] md:text-[64px] md:leading-[68px] lg:text-[64px] lg:leading-[68px] tracking-[-1.44px] text-white max-w-[700px] mb-[32px] animate-fade-blur-in" style={{ animationDelay: '0.1s' }}>
            We're building the insurance coworker, one that does the real work.
          </h1>
          <p className="font-sans text-[18px] leading-[1.6] text-white/80 max-w-full lg:max-w-[540px] mb-[40px] animate-fade-blur-in" style={{ animationDelay: '0.2s' }}>
            We're a small team teaching Cooper the judgment of a top insurance professional. If that's your kind of problem, we'd love to meet you.
          </p>
          <a
            href="#open-roles"
            className="inline-block w-fit font-sans font-medium text-[15px] text-dark bg-white rounded-[6px] px-[28px] py-[12px] hover:bg-cream hover:scale-[1.03] transition-all duration-200 no-underline animate-fade-blur-in"
            style={{ animationDelay: '0.3s' }}
          >
            View open roles
          </a>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          MISSION INTRO — 2-col heading + body
          ══════════════════════════════════════════════ */}
      <RevealSection>
        <section className="bg-cream-light">
          <div className="max-w-[1440px] mx-auto px-5 md:px-12 lg:px-[85px] py-[100px] lg:py-[120px]">
            <div className="grid grid-cols-1 lg:grid-cols-[440px_1fr] gap-10 lg:gap-[80px] items-start">
              {/* Left — heading */}
              <div className="lg:sticky lg:top-[120px]">
                <h2 className="font-serif text-[30px] leading-[36px] md:text-[40px] md:leading-[46px] lg:text-[48px] lg:leading-[52px] tracking-[-0.5px] text-dark animate-fade-blur-in">
                  We're building the coworker insurance never had.
                </h2>
              </div>

              {/* Right — body paragraphs */}
              <div className="flex flex-col gap-[28px] animate-fade-blur-in" style={{ animationDelay: '0.15s' }}>
                <p className="font-sans text-[18px] leading-[1.7] text-dark/70">
                  Insurance is one of the largest industries in the world, and most of it still runs by hand: documents read one at a time, forms filled in, policies checked line by line. The people who do this work are good at it. The tools they've been given aren't.
                </p>
                <p className="font-sans text-[18px] leading-[1.7] text-dark/70">
                  That's where Cooper comes in. It takes on the work the way a sharp colleague would, learning how each shop runs and earning its way onto the tasks that matter most. It takes real judgment, not just automation, and it's hard to get right.
                </p>
                <p className="font-sans text-[18px] leading-[1.7] text-dark/70">
                  The work here stays close to the ground. You'll see how customers actually operate, put real things in their hands quickly, and own the outcome from start to finish. A rare problem, hiding in plain sight.
                </p>
                <p className="font-sans text-[18px] leading-[1.7] text-dark">
                  If it's the kind you've been looking for, come find your place here.
                </p>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ══════════════════════════════════════════════
          PHOTO STRIP — slow continuous marquee, pauses on hover
          ══════════════════════════════════════════════ */}
      <section className="bg-cream-light overflow-hidden pb-[80px] group/strip">
        <div className="flex gap-[10px] w-max animate-marquee-slow group-hover/strip:[animation-play-state:paused]">
          {[...teamPhotos, ...teamPhotos].map((src, i) => (
            <div
              key={i}
              className="h-[220px] md:h-[260px] shrink-0 overflow-hidden rounded-[6px] transition-transform duration-700 ease-out group-hover/strip:scale-[0.98]"
              style={{ aspectRatio: '4/3' }}
            >
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/strip:scale-[1.04]"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          INVESTORS
          ══════════════════════════════════════════════ */}
      <RevealSection>
        <section className="bg-cream-light">
          <div className="max-w-[1440px] mx-auto px-5 md:px-12 lg:px-[85px] py-[100px]">
            <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-[24px] mb-[56px]">
              <span className="font-grotesk font-medium text-[14px] tracking-[1.4px] uppercase text-accent-orange md:pt-[12px] shrink-0 animate-fade-blur-in">
                Our Investors
              </span>
              <h2 className="font-serif text-[26px] leading-[32px] md:text-[34px] md:leading-[40px] lg:text-[40px] lg:leading-[44.8px] text-dark max-w-[756px] animate-fade-blur-in" style={{ animationDelay: '0.1s' }}>
                Backed by builders of <span className="whitespace-nowrap">category-defining</span> companies.
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[20px]">
              {investors.map((inv, i) => (
                <div key={inv.name} className="animate-fade-blur-in" style={{ animationDelay: `${0.2 + i * 0.12}s` }}>
                  <img src={inv.image} alt={inv.name} className="w-full h-auto rounded-[16px] opacity-50" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ══════════════════════════════════════════════
          OPEN ROLES
          ══════════════════════════════════════════════ */}
      <RevealSection>
        <section id="open-roles" className="bg-cream-light scroll-mt-[80px]">
          <div className="max-w-[1440px] mx-auto px-5 md:px-12 lg:px-[85px] py-[100px]">
            <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-[24px] mb-[64px]">
              <span className="font-grotesk font-medium text-[14px] tracking-[1.4px] uppercase text-accent-orange md:pt-[12px] shrink-0 animate-fade-blur-in">
                Open Roles
              </span>
              <h2 className="font-serif text-[26px] leading-[32px] md:text-[34px] md:leading-[40px] lg:text-[40px] lg:leading-[44.8px] text-dark max-w-[600px] animate-fade-blur-in" style={{ animationDelay: '0.1s' }}>
                Find your place at Cooper.
              </h2>
            </div>

            {departments.map((dept) => (
              <div key={dept} className="mb-[48px]">
                <h3 className="font-grotesk font-medium text-[12px] tracking-[1.2px] uppercase text-dark/40 mb-[20px] pb-[12px] border-b border-dark/[0.08]">
                  {dept}
                </h3>
                <div className="flex flex-col">
                  {roles
                    .filter(r => r.department === dept)
                    .map((role, i) => (
                      <Link
                        key={role.id}
                        to={`/careers/${role.id}`}
                        className="group flex flex-col gap-3 md:flex-row md:items-center md:justify-between py-[20px] border-b border-dark/[0.06] no-underline transition-colors hover:bg-cream/50 px-[16px] -mx-[16px] rounded-[8px] animate-fade-blur-in"
                        style={{ animationDelay: `${0.2 + i * 0.06}s` }}
                      >
                        <div className="flex items-center gap-[16px]">
                          <span className="font-sans text-[17px] font-medium text-dark group-hover:text-accent-orange transition-colors">
                            {role.title}
                          </span>
                          <span className={`font-grotesk text-[11px] font-medium tracking-[0.5px] uppercase px-[8px] py-[3px] rounded-full ${deptColor(role.department)}`}>
                            {role.department}
                          </span>
                        </div>
                        <div className="flex items-center flex-wrap gap-x-[16px] gap-y-2 md:gap-[24px]">
                          <span className="font-sans text-[14px] text-dark/40">{role.location}</span>
                          <span className="font-sans text-[14px] text-dark/40">{role.type}</span>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-dark/30 group-hover:text-accent-orange group-hover:translate-x-1 transition-all">
                            <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </RevealSection>


      <Footer />
    </div>
  )
}
