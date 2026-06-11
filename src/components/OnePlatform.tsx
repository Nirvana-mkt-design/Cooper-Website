import { useState, useEffect, useCallback, useRef } from 'react'

const tabs = [
  {
    id: 'intake',
    label: 'Intelligent intake',
    title: 'Submissions processed in seconds, not hours',
    description:
      "Emails, PDFs, applications, loss runs — Cooper reads everything that comes in, organizes it into your workflow, and tells you exactly what's missing before you have to chase it.",
    checks: [
      { bold: 'Any format, any carrier.', rest: 'Processed automatically' },
      { bold: 'Key details structured and ready', rest: 'for your team instantly' },
      { bold: 'Missing information flagged', rest: 'before it slows you down' },
    ],
  },
  {
    id: 'insights',
    label: 'Deep insights',
    title: 'Catch what matters before it costs money',
    description:
      'Cooper reads policies, loss runs, and applications like a senior underwriter — surfacing coverage gaps, comparing terms across carriers, and catching the issues that would take your team hours to find.',
    checks: [
      { bold: 'Side-by-side policy and quote', rest: 'comparison' },
      { bold: 'Loss history trends', rest: 'and ratio analysis in seconds' },
      { bold: 'Exclusions, limitations, and red flags', rest: 'surfaced automatically' },
    ],
  },
  {
    id: 'automation',
    label: 'Workflow automation',
    title: 'Your process, running at machine speed',
    description:
      'Cooper plugs into the way you already work — verifying guidelines, drafting emails, generating reports, answering questions about your documents in plain English.',
    checks: [
      { bold: 'Compliance and guideline checks', rest: 'run automatically' },
      { bold: 'Emails, summaries, and reports', rest: 'drafted with the right context' },
      { bold: 'Ask Cooper anything —', rest: 'get answers from your documents instantly' },
    ],
  },
]

const DURATION = 6000 // ms per tab

export default function OnePlatform() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const startRef = useRef(Date.now())
  const rafRef = useRef<number>(0)
  const [animKey, setAnimKey] = useState(0)
  const active = tabs[activeIdx]

  const goNext = useCallback(() => {
    setActiveIdx((prev) => (prev + 1) % tabs.length)
    setAnimKey((k) => k + 1)
    setProgress(0)
    startRef.current = Date.now()
  }, [])

  // Animation frame loop for smooth progress bar
  useEffect(() => {
    if (paused) return

    startRef.current = Date.now() - (progress / 100) * DURATION

    const tick = () => {
      const elapsed = Date.now() - startRef.current
      const pct = Math.min((elapsed / DURATION) * 100, 100)
      setProgress(pct)
      if (pct >= 100) {
        goNext()
      } else {
        rafRef.current = requestAnimationFrame(tick)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [paused, activeIdx, goNext])

  const handleTabClick = (idx: number) => {
    setActiveIdx(idx)
    setAnimKey((k) => k + 1)
    setProgress(0)
    startRef.current = Date.now()
    setPaused(true)
    setTimeout(() => setPaused(false), 15000)
  }

  return (
    <section className="bg-cream py-[100px]">
      <div className="max-w-[1440px] mx-auto px-[62px]">
        {/* Heading */}
        <h2 className="font-serif text-[38px] leading-[1.2] text-dark text-center mb-[60px]">
          One platform, every workflow
        </h2>

        {/* Card */}
        <div
          className="bg-cream-light border-4 border-black/[0.02] overflow-hidden relative max-h-[755px]"
          style={{ boxShadow: '0px 7.5px 69.6px -20px rgba(0,0,0,0.33)' }}
        >
          {/* Tab bar */}
          <div className="flex">
            {tabs.map((tab, i) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(i)}
                className={`relative flex-1 h-[73px] flex items-center justify-center border-b border-r border-black/[0.12] font-grotesk font-medium text-[14.5px] tracking-[1.45px] uppercase cursor-pointer transition-colors overflow-hidden ${
                  activeIdx === i
                    ? 'text-dark bg-cream-light'
                    : 'text-dark/40 bg-cream-light hover:text-dark/60'
                } last:border-r-0`}
              >
                {/* Progress line on top */}
                <span
                  className="absolute top-0 left-0 h-[3px] bg-accent-orange"
                  style={{
                    width: activeIdx === i ? `${progress}%` : '0%',
                    transition: activeIdx === i ? 'none' : 'width 0.3s ease',
                  }}
                />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="grid grid-cols-2 h-[682px] overflow-hidden">
            {/* Left text */}
            <div className="px-[62px] pt-[80px] pb-[60px] flex flex-col overflow-hidden h-[682px]">
              {/* Cooper icon — orange */}
              <svg width="42" height="42" viewBox="0 0 84 84" fill="none" className="mb-[24px] shrink-0">
                <path fillRule="evenodd" clipRule="evenodd" d="M60.0615 0C72.8642 0.000149885 83.2434 10.3788 83.2435 23.1815L83.2416 23.4811C83.1479 30.88 79.5864 37.442 74.1093 41.621C79.6604 45.8563 83.2435 52.5399 83.2435 60.061L83.2416 60.3607C83.0811 73.0254 72.7642 83.2428 60.0615 83.243L59.7619 83.2411C52.3632 83.1473 45.8009 79.5862 41.622 74.1093C37.3866 79.6603 30.7026 83.2429 23.1815 83.243L22.8818 83.2411C10.2172 83.0805 7.73898e-05 72.7637 0 60.061C4.11592e-05 52.5405 3.58211 45.8573 9.13223 41.622C3.58171 37.3866 7.63667e-06 30.7023 0 23.1815C7.00685e-05 10.3787 10.3787 7.00776e-05 23.1815 0C30.7026 4.03379e-05 37.3861 3.58279 41.6215 9.13367C45.8568 3.58276 52.5404 4.1168e-05 60.0615 0ZM18.6642 46.9719C13.2366 48.8446 9.33768 53.9971 9.33763 60.061C9.3377 67.7067 15.5358 73.9052 23.1815 73.9054C29.5238 73.9053 34.8689 69.6397 36.5073 63.8212C36.5133 63.8224 36.5195 63.8234 36.5255 63.8246C27.8285 62.0864 20.8884 55.4832 18.6642 46.9719ZM63.598 46.6742C61.5421 54.9938 54.9941 61.5414 46.6747 63.598C48.2377 69.5303 53.6383 73.9053 60.0615 73.9054C67.7072 73.9052 73.9058 67.7067 73.9059 60.061C73.9058 53.6377 69.5306 48.2371 63.598 46.6742ZM41.0933 27.2504C33.4476 27.2505 27.2496 33.4486 27.2495 41.0943C27.2495 48.7401 33.4476 54.9386 41.0933 54.9386C48.7392 54.9386 54.9377 48.7401 54.9377 41.0943C54.9376 33.4485 48.7391 27.2505 41.0933 27.2504ZM64.2686 41.6225C64.2725 41.4469 64.2758 41.2708 64.2758 41.0943L64.2734 41.394C64.2724 41.4702 64.2703 41.5464 64.2686 41.6225ZM60.0615 9.33762C53.9972 9.33768 48.8444 13.2371 46.9719 18.6651C46.9635 18.6629 46.9549 18.6606 46.9464 18.6584C55.4854 20.8798 62.1083 27.847 63.8332 36.5751C63.8288 36.5524 63.8253 36.5295 63.8207 36.5068C69.6397 34.8687 73.9058 29.5241 73.9059 23.1815C73.9058 15.5358 67.7072 9.33777 60.0615 9.33762ZM36.1884 18.4338C34.2509 13.1266 29.1592 9.33768 23.1815 9.33762C15.5357 9.33769 9.3377 15.5357 9.33763 23.1815C9.33764 29.1593 13.1266 34.2509 18.4338 36.1883C20.3441 27.3232 27.323 20.3437 36.1884 18.4338Z" fill="#d95611"/>
              </svg>
              <h3 className="font-serif text-[38px] leading-[1.15] text-dark mb-[28px] max-w-[445px]">
                {active.title}
              </h3>
              <p className="font-sans text-[17.8px] leading-[1.5] text-dark/70 max-w-[491px] mb-[44px]">
                {active.description}
              </p>
              <div className="flex flex-col gap-[24px]">
                {active.checks.map((check, i) => (
                  <div key={i} className="flex items-start gap-[12px]">
                    <img src="/images/check-circle.svg" alt="" className="w-[22px] h-[22px] mt-[1px] shrink-0" />
                    <p className="font-sans text-[16px] leading-[1.4] text-dark">
                      <span className="font-medium">{check.bold}</span><br />
                      <span className="text-dark/50">{check.rest}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — layered background + UI overlay */}
            <div className="relative border-l border-black/[0.12] overflow-hidden">
              {/* Background video */}
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src="/images/platform-bg-video.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 mix-blend-hard-light" style={{ backgroundImage: 'linear-gradient(-89.4deg, rgba(186,67,9,0.36) 35%, rgba(186,67,9,0) 70%)' }} />
              <div className="absolute inset-0 mix-blend-hard-light" style={{ backgroundImage: 'linear-gradient(241.6deg, rgba(186,186,9,0) 43%, rgba(186,89,9,0.43) 57%)' }} />
              <div className="absolute inset-0 mix-blend-soft-light" style={{ background: 'radial-gradient(ellipse at 90% -15%, rgba(55,27,19,0) 46%, rgba(55,27,19,0.56) 100%)' }} />
              <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 100% 110%, rgba(55,27,19,0) 46%, rgba(55,27,19,0.52) 100%)' }} />

              {/* UI Elements — animated layers, centered as a group */}
              <div className="absolute inset-0 z-10 flex items-center justify-center">
                <div className="relative w-[420px] h-[560px]" key={`ui-${animKey}`}>
                  {/* 1: Icon cards + badge */}
                  <img
                    src="/images/1.png"
                    alt=""
                    width="220"
                    height="200"
                    className="absolute top-0 left-[10px] w-[220px] animate-fade-blur-in"
                    style={{ animationDelay: '0.1s' }}
                  />
                  {/* 2: Status pills */}
                  <img
                    src="/images/2.png"
                    alt=""
                    width="185"
                    height="120"
                    className="absolute top-[15px] left-[230px] w-[185px] animate-fade-blur-in"
                    style={{ animationDelay: '0.25s' }}
                  />
                  {/* 3: Incoming Documents card */}
                  <img
                    src="/images/3.png"
                    alt=""
                    width="370"
                    height="320"
                    className="absolute top-[110px] left-0 w-[370px] animate-fade-blur-in"
                    style={{ animationDelay: '0.4s' }}
                  />
                  {/* 4: Missing elements alert */}
                  <img
                    src="/images/4.png"
                    alt=""
                    width="340"
                    height="100"
                    className="absolute top-[430px] left-[60px] w-[340px] animate-fade-blur-in"
                    style={{ animationDelay: '0.55s' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
