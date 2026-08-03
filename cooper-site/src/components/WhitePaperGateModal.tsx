/* ──────────────────────────────────────────────────────────────
   Layout A — the gate as a modal, opened from the card that sits over
   the blurred remainder of the paper.

   The second of layout A's two ways in. The rail card is above the
   fold and scrolls away; this one is for the reader who is already
   deep in the page when they decide, and who would otherwise have to
   scroll back up to a form they had stopped looking at.

   Everything except the frame comes from WhitePaperGateFields.
─────────────────────────────────────────────────────────────── */

import { useEffect, useRef } from 'react'
import { LockSimpleOpen } from '@phosphor-icons/react'
import ModalShell from './ModalShell'
import GateFields from './WhitePaperGateFields'
import { useWhitePaperGate } from '../lib/whitePaperGate'

export default function WhitePaperGateModal({
  onClose,
  onUnlock,
}: {
  onClose: () => void
  onUnlock: (body: string) => void
}) {
  const gate = useWhitePaperGate({ variant: 'modal', onUnlock })
  const firstField = useRef<HTMLDivElement>(null)

  // ModalShell owns Escape and the scroll lock; the gate only adds autofocus.
  // Empty deps so a parent re-render cannot yank the caret back to field one.
  useEffect(() => { firstField.current?.querySelector('input')?.focus() }, [])

  return (
    <ModalShell onClose={onClose} labelledBy="wp-gate-title" maxWidth={480} scroll>
      <div className="p-[28px] sm:p-[34px]">
        <span className="inline-flex items-center gap-[7px] font-grotesk text-[11.5px] font-medium uppercase tracking-[1.2px] text-accent-orange">
          <LockSimpleOpen size={14} weight="bold" /> Full paper
        </span>
        <h2 id="wp-gate-title" className="mt-[10px] font-serif text-[26px] leading-[1.15] text-dark">
          Read the whole thing
        </h2>
        <p className="mt-[10px] font-sans text-[14.5px] leading-[1.55] text-dark/55">
          The seven-criteria framework, the sourced numbers, and the low-risk path to
          getting started. Tell us where to send it and it opens right here.
        </p>

        <div ref={firstField} className="mt-[22px]">
          <GateFields gate={gate} idPrefix="wpm" submitLabel="Unlock the paper" />
        </div>
      </div>
    </ModalShell>
  )
}
