import { useEffect, type ReactNode } from 'react'
import { X } from '@phosphor-icons/react'

/**
 * Dark overlay + centered cream panel, closing on Escape, overlay click and
 * the X button, with the page held still underneath.
 *
 * Lifted out of IntegrationsPage when the ROI gate needed the same thing. The
 * a11y and scroll-lock contract is fiddly enough that a second copy would have
 * drifted from this one the first time either was touched.
 */
export default function ModalShell({
  onClose,
  labelledBy,
  children,
  maxWidth = 560,
  scroll = false,
}: {
  onClose: () => void
  /** id of the heading that names this dialog. */
  labelledBy: string
  children: ReactNode
  maxWidth?: number
  /** Scroll inside the panel rather than clipping — for taller content. */
  scroll?: boolean
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <div
      className="animate-overlay-in fixed inset-0 z-[100] flex items-end justify-center bg-dark/50 p-0 backdrop-blur-[3px] sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth }}
        className={`animate-modal-in relative flex max-h-[92vh] w-full flex-col rounded-t-[20px] border border-dark/10 bg-cream-light shadow-[0_40px_120px_-40px_rgba(30,26,21,0.6)] sm:rounded-[20px] ${
          scroll ? 'overflow-y-auto' : 'overflow-hidden'
        }`}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-[16px] top-[16px] z-10 grid h-[34px] w-[34px] place-items-center rounded-full border border-dark/10 bg-cream-light text-dark/50 transition-colors hover:bg-cream hover:text-dark"
        >
          <X size={17} weight="bold" />
        </button>
        {children}
      </div>
    </div>
  )
}
