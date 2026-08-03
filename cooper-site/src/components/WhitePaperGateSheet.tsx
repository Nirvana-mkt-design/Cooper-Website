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
import { LockSimple } from '@phosphor-icons/react'
import GateFields from './WhitePaperGateFields'
import { useWhitePaperGate, type GateVariant } from '../lib/whitePaperGate'

/** How far the reader has to move before the panel comes up. */
const SCROLL_TRIGGER = 60

/** Shown anyway after this long, for a viewport tall enough that the locked
    page does not scroll at all — otherwise the ask would never arrive. */
const FALLBACK_MS = 2600

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

  useEffect(() => {
    const check = () => { if (window.scrollY > SCROLL_TRIGGER) setShown(true) }

    /* The initial check waits a frame rather than running here. Someone who
       reloads part-way down the page is already past the trigger, and setting
       the state synchronously would mean the hidden position never paints — the
       panel would be there rather than arrive, with no transition to animate
       from. One frame is enough for it to slide. */
    const raf = requestAnimationFrame(check)
    window.addEventListener('scroll', check, { passive: true })
    const timer = window.setTimeout(() => setShown(true), FALLBACK_MS)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', check)
      window.clearTimeout(timer)
    }
  }, [])

  return (
    <>
      {/* The article does not stop, it dissolves into the panel. Fixed like the
          panel and sitting directly on top of it, so the fade tracks the page
          rather than a point in the document the reader has scrolled past. */}
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-x-0 bottom-0 z-[59] h-[570px] bg-cream-light transition-opacity duration-700 ${
          shown ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 62%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 62%)',
        }}
      />

      <aside
        aria-label="Read the full white paper"
        className={`fixed inset-x-0 bottom-0 z-[60] max-h-[88vh] overflow-y-auto border-t border-dark/[0.07] shadow-[0_-30px_80px_-40px_rgba(30,26,21,0.4)] transition-transform duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] bg-cream-light ${
          shown ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="mx-auto max-w-[1440px] px-5 py-[36px] md:px-10 lg:px-[62px] lg:py-[44px]">
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
