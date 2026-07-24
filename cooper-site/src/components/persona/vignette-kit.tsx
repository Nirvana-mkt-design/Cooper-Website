import type { ReactNode } from 'react'

/* ──────────────────────────────────────────────────────────────
   Vignette kit — UI primitives for the Cooper product-UI mockups
   that float on top of each feature photo. The per-persona content
   built from these lives in vignettes.tsx; keeping components and
   data in separate files lets react-refresh hot-reload them.
─────────────────────────────────────────────────────────────── */

const OK = '#3f7a45'
const WARN = '#b4561a'
const NO = '#b23b3b'

/* Floating panel — mirrors the Cooper app home-card style (flat, sharp, no dots) */
export function VigWindow({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div
      aria-label={title}
      className="overflow-hidden rounded-[6px] border border-[#E2D9CF] bg-white/[0.94] shadow-[0_34px_80px_-28px_rgba(20,17,12,0.6)]"
    >
      <div className="p-[18px]" style={{ backgroundColor: '#faf7ef' }}>
        {children}
      </div>
    </div>
  )
}

/* File chip — matches the Cooper app's attachment cards (typed icon + size) */
const FILE_COLORS: Record<string, string> = {
  pdf: '#9d2e24',
  xlsx: '#1d7a44',
  xls: '#1d7a44',
  csv: '#1d7a44',
  docx: '#2a5bb8',
  doc: '#2a5bb8',
  eml: '#6b675f',
}
export function FileChip({ name, meta }: { name: string; meta?: string }) {
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  const color = FILE_COLORS[ext] ?? '#6b675f'
  return (
    <div className="flex items-center gap-[9px] rounded-none border-b border-[#E2D9CF] bg-transparent px-[11px] py-[8px] last:border-b-0">
      <span className="grid h-[26px] w-[26px] shrink-0 place-items-center rounded-[5px]" style={{ background: color }}>
        <svg viewBox="0 0 24 24" className="h-[13px] w-[13px]" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M9 13h6M9 17h4" />
        </svg>
      </span>
      <div className="min-w-0 flex-1 leading-tight">
        <div className="truncate font-sans text-[11px] md:text-[12.5px] font-semibold text-dark">{name}</div>
        {meta && <div className="font-sans text-[10.5px] uppercase tracking-[0.03em] text-dark/40">{meta}</div>}
      </div>
    </div>
  )
}

export function B({ children }: { children: ReactNode }) {
  return <b className="font-semibold text-dark">{children}</b>
}

type StKind = 'ok' | 'warn' | 'no' | 'neutral'
export function St({ kind, children }: { kind: StKind; children: ReactNode }) {
  const color = kind === 'ok' ? OK : kind === 'warn' ? WARN : kind === 'no' ? NO : 'rgba(30,26,21,0.45)'
  return (
    <span
      className="inline-flex shrink-0 items-center gap-[5px] whitespace-nowrap font-grotesk text-[10.5px] font-semibold uppercase tracking-[0.03em]"
      style={{ color }}
    >
      {children}
    </span>
  )
}

export function Row({ children, attn = false, className = '' }: { children: ReactNode; attn?: boolean; className?: string }) {
  return (
    <div
      className={`flex items-center justify-between gap-[10px] border-b px-[11px] py-[8px] font-sans text-[12.5px] text-dark/70 last:border-b-0 ${className}`}
      style={
        attn
          ? { background: 'rgba(217,86,17,0.06)', borderColor: '#E2D9CF', borderLeft: '3px solid #d95611', paddingLeft: 9 }
          : { background: 'transparent', borderColor: '#E2D9CF' }
      }
    >
      {children}
    </div>
  )
}

export function Stack({ children, gap = 7 }: { children: ReactNode; gap?: number }) {
  return (
    <div className="flex flex-col" style={{ gap }}>
      {children}
    </div>
  )
}

export function KV({ k, v, accent = false }: { k: string; v: ReactNode; accent?: boolean }) {
  return (
    <div className="flex justify-between gap-[10px] border-b border-[#E2D9CF] py-[5px] font-sans text-[12.5px] last:border-0">
      <span className="text-dark/55">{k}</span>
      <b className="font-semibold text-right" style={{ color: accent ? '#d95611' : '#1e1a15' }}>{v}</b>
    </div>
  )
}

export function DiffRow({ cells, header = false, accentIdx }: { cells: ReactNode[]; header?: boolean; accentIdx?: number }) {
  return (
    <div className="grid grid-cols-[1.4fr_0.8fr_0.8fr] items-center border-b border-[#E2D9CF] py-[6px] last:border-0">
      {cells.map((c, i) => (
        <span
          key={i}
          className={header ? 'font-grotesk text-[8.5px] md:text-[9.5px] uppercase tracking-[0.05em] text-dark/45' : 'font-sans text-[11px] md:text-[12px] text-dark/70'}
          style={!header && accentIdx === i ? { color: '#d95611', fontWeight: 600 } : undefined}
        >
          {c}
        </span>
      ))}
    </div>
  )
}

export function Bar({ label, pct, value, alert = false }: { label: string; pct: number; value: string; alert?: boolean }) {
  return (
    <div className="flex items-center gap-[8px] font-sans text-[12px]">
      <span className="w-[84px] shrink-0 text-dark/70">{label}</span>
      <span className="h-[7px] flex-1 overflow-hidden rounded-[4px] bg-dark/[0.10]">
        <i className="block h-full rounded-[4px]" style={{ width: `${pct}%`, background: alert ? NO : '#d95611' }} />
      </span>
      <b className="w-[34px] shrink-0 text-right font-semibold text-dark">{value}</b>
    </div>
  )
}

export function TwoCol({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-[10px]">
      <Stack gap={6}>{left}</Stack>
      <span className="hidden md:block text-[18px] leading-none text-accent-orange">→</span>
      <div>{right}</div>
    </div>
  )
}

export function Note({ children, accent = false }: { children: ReactNode; accent?: boolean }) {
  return <p className="mt-[7px] font-sans text-[11.5px]" style={{ color: accent ? '#d95611' : 'rgba(30,26,21,0.45)' }}>{children}</p>
}
