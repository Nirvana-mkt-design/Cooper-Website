/* ──────────────────────────────────────────────────────────────
   Layout B — the gate as a panel that rises to meet the reader.

   The pattern Every and the New York Times use on a metered article:
   the reader gets a screenful of the real thing with nothing asked of
   them, and then, once they move, the page hands them the ask. No
   rail, no card floating over a blur, no button that opens something
   else. The page ends here and the panel is the end.

   Why it might beat layout A: nothing competes with the article on the
   way in, so the first screen is only the paper. The ask arrives after
   the reader has decided the writing is worth their address rather
   than before they have read a word of it. Whether that trade — a
   later ask, against a form that is never visible early — actually
   converts better is the question the A/B is asking.

   Fixed to the foot of the viewport rather than parked at the end of
   the article, because it has to arrive rather than be scrolled to.
   Neither layout renders a closing banner or a footer while the paper is
   locked, so there is nothing below the panel to scroll down to. The
   reader can still go back up and re-read; they just cannot go past.

   Layout C uses this too, in place of the card it had in its rail. Same
   panel, same fields; C simply keeps the cover in the rail on its own.
─────────────────────────────────────────────────────────────── */

import { useEffect, useState } from 'react'
import { LockSimple, X } from '@phosphor-icons/react'
import GateFields from './WhitePaperGateFields'
import { useWhitePaperGate, type GateVariant } from '../lib/whitePaperGate'

/** How far the reader has to move before the panel comes up. A share of the
    viewport rather than a fixed nudge, so the reader gets roughly a screenful
    of the report to read before the ask arrives rather than having it jump up
    on the first flick. Floored so a short viewport still asks for real scroll. */
const scrollTrigger = () => Math.max(460, window.innerHeight * 0.6)

/** Shown anyway after this long, for a viewport tall enough that the locked
    page does not scroll at all — otherwise the ask would never arrive. Only
    armed when the page cannot actually scroll, so on the normal long report it
    is the reader's scroll, not a timer, that decides when the panel arrives. */
const FALLBACK_MS = 6500

export default function WhitePaperGateSheet({
  onUnlock,
  /* Layouts B and C both end in this panel. They report separately so the A/B
     can tell which page around it converted, not just which form. */
  variant = 'sheet',
}: {
  onUnlock: (body: string) => void
  variant?: GateVariant
}) {
  const gate = useWhitePaperGate({ variant, onUnlock })
  const [shown, setShown] = useState(false)
  /* The reader has closed the panel with the X. It collapses to a small
     "Keep reading" tab so the paper below is theirs to read again, and the tab
     is how they bring the form back — a closed gate with no way back would just
     be a broken one. */
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const trigger = scrollTrigger()
    const check = () => { if (window.scrollY > trigger) setShown(true) }

    /* The initial check waits a frame rather than running here. Someone who
       reloads part-way down the page is already past the trigger, and setting
       the state synchronously would mean the hidden position never paints — the
       panel would be there rather than arrive, with no transition to animate
       from. One frame is enough for it to slide. */
    const raf = requestAnimationFrame(check)
    window.addEventListener('scroll', check, { passive: true })

    /* Only arm the fallback when the page has nothing to scroll — otherwise the
       reader's own scroll past the trigger is what raises the panel, and a
       timer firing first would defeat the point of giving them room to read. */
    const canScroll = document.documentElement.scrollHeight > window.innerHeight + 40
    const timer = canScroll ? undefined : window.setTimeout(() => setShown(true), FALLBACK_MS)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', check)
      if (timer) window.clearTimeout(timer)
    }
  }, [])

  const open = shown && !collapsed

  return (
    <>
      {/* The article does not stop, it dissolves into the panel. Fixed like the
          panel and sitting directly on top of it, so the fade tracks the page
          rather than a point in the document the reader has scrolled past. */}
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-x-0 bottom-0 z-[59] h-[570px] bg-cream-light transition-opacity duration-700 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 62%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 62%)',
        }}
      />

      {/* The collapsed tab. Once the reader closes the panel it waits at the
          foot of the screen rather than vanishing, so the form is one tap away
          again. Only rendered after the panel has been shown at least once. */}
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        aria-label="Keep reading the white paper"
        className={`fixed bottom-[18px] left-1/2 z-[60] inline-flex -translate-x-1/2 items-center gap-[7px] rounded-full border border-dark/[0.08] bg-dark px-[20px] py-[11px] font-grotesk text-[11px] font-medium uppercase tracking-[1.2px] text-cream-light shadow-[0_16px_40px_-16px_rgba(30,26,21,0.6)] transition-all duration-300 hover:scale-[1.03] ${
          shown && collapsed ? 'pointer-events-auto opacity-100' : 'pointer-events-none translate-y-[80px] opacity-0'
        }`}
      >
        <LockSimple size={13} weight="bold" /> Keep reading
      </button>

      <aside
        aria-label="Read the full white paper"
        className={`fixed inset-x-0 bottom-0 z-[60] max-h-[88vh] overflow-y-auto border-t border-dark/[0.07] shadow-[0_-30px_80px_-40px_rgba(30,26,21,0.4)] transition-transform duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] bg-cream-light ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="relative mx-auto max-w-[1440px] px-5 py-[36px] md:px-10 lg:px-[62px] lg:py-[44px]">
          {/* Close the panel and hand the page back to the reader. */}
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            aria-label="Close and keep reading the page"
            className="absolute right-[14px] top-[14px] z-10 inline-flex size-[34px] items-center justify-center rounded-full border border-dark/[0.08] bg-cream-light/80 text-dark/55 transition-colors hover:bg-cream hover:text-dark md:right-[24px] md:top-[20px]"
          >
            <X size={16} weight="bold" />
          </button>
          <div className="mx-auto max-w-[560px] text-center">
            <span className="inline-flex items-center gap-[7px] font-grotesk text-[11px] font-medium uppercase tracking-[1.3px] text-accent-orange">
              <LockSimple size={13} weight="bold" /> Keep reading
            </span>
            <h2 className="mx-auto mt-[11px] max-w-[440px] font-serif text-[28px] leading-[1.14] text-dark sm:text-[34px]">
              Create free access, and finish the paper
            </h2>
            <p className="mx-auto mt-[10px] max-w-[450px] font-sans text-[14.5px] leading-[1.55] text-dark/55">
              Ten more minutes of reading: the seven criteria, every figure traced to its
              source, and the low-risk path to getting started. It opens right here, no
              download.
            </p>

            <div className="mt-[22px]">
              <GateFields gate={gate} idPrefix="wps" submitLabel="Unlock to Read" columns>
                <LockSimple size={15} weight="bold" />
              </GateFields>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
