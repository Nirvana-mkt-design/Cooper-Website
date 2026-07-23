import type { ReactNode, Ref } from 'react'

/**
 * Holds a box at the width of its final value so an animating number can't
 * resize its container and drag the surrounding layout around while it counts.
 *
 * `final` renders invisibly to size the box; `children` (the live value) stacks
 * in the same grid cell, aligned to the start so growing digits push outward
 * instead of shifting everything already on screen.
 */
export default function StableWidth({
  final,
  children,
  className = '',
  ref,
}: {
  final: ReactNode
  children: ReactNode
  className?: string
  ref?: Ref<HTMLSpanElement>
}) {
  return (
    <span ref={ref} className={`grid tabular-nums ${className}`}>
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {final}
      </span>
      <span className="col-start-1 row-start-1 text-left">{children}</span>
    </span>
  )
}
