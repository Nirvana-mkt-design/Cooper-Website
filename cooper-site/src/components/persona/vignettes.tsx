import type { ReactNode } from 'react'

/* ──────────────────────────────────────────────────────────────
   Vignette kit — Cooper product-UI mockups that float on top of
   each feature photo. Content per the Cooper team's June-24 spec.
─────────────────────────────────────────────────────────────── */

const OK = '#3f7a45'
const WARN = '#b4561a'
const NO = '#b23b3b'

/* Floating panel — mirrors the Cooper app (dotted canvas, near-square corners, no title bar) */
export function VigWindow({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div
      aria-label={title}
      className="overflow-hidden rounded-[8px] border border-dark/[0.08] bg-cream-light shadow-[0_34px_80px_-28px_rgba(20,17,12,0.6)] ring-1 ring-black/[0.02]"
    >
      <div
        className="p-[18px]"
        style={{
          backgroundColor: '#faf7ef',
          backgroundImage: 'radial-gradient(rgba(30,26,21,0.05) 1px, transparent 1px)',
          backgroundSize: '15px 15px',
        }}
      >
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
    <div className="flex items-center gap-[9px] rounded-[8px] border border-dark/[0.10] bg-white px-[10px] py-[8px] shadow-[0_1px_2px_rgba(30,26,21,0.04)]">
      <span className="grid h-[26px] w-[26px] shrink-0 place-items-center rounded-[6px]" style={{ background: color }}>
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
      className={`flex items-center justify-between gap-[10px] rounded-[6px] border px-[11px] py-[8px] font-sans text-[12.5px] text-dark/70 ${className}`}
      style={
        attn
          ? { background: 'rgba(217,86,17,0.07)', borderColor: 'rgba(217,86,17,0.28)', borderLeft: '3px solid #d95611', paddingLeft: 9 }
          : { background: '#fff', borderColor: 'rgba(30,26,21,0.10)' }
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
    <div className="flex justify-between gap-[10px] border-b border-dashed border-dark/15 py-[5px] font-sans text-[12.5px] last:border-0">
      <span className="text-dark/55">{k}</span>
      <b className="font-semibold" style={{ color: accent ? '#d95611' : '#1e1a15' }}>{v}</b>
    </div>
  )
}

export function DiffRow({ cells, header = false, accentIdx }: { cells: ReactNode[]; header?: boolean; accentIdx?: number }) {
  return (
    <div className="grid grid-cols-[1.4fr_0.8fr_0.8fr] items-center border-b border-dark/[0.08] py-[6px] last:border-0">
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

/* Per-feature roletag pills (Retail only, per the spec) */
export const roletags: Record<string, string[]> = {
  'retail-agencies': ['For account managers + producers', 'For producers', 'For producers + account managers', 'For account managers'],
}

/* Vignettes, one per feature in data order */
export const vignettes: Record<string, ReactNode[]> = {
  'retail-agencies': [
    <VigWindow title="Applied Epic · account record">
      <TwoCol
        left={
          <>
            <FileChip name="Dec page.pdf" meta="PDF · 248 KB" />
            <FileChip name="Loss runs.pdf" meta="PDF · 931 KB" />
          </>
        }
        right={
          <>
            <KV k="Named insured" v="ABC Trucking" />
            <KV k="Submission ID" v="SUB-4471902" />
            <KV k="Eff. date" v="2026-06-25" />
          </>
        }
      />
      <Row attn className="mt-[10px]"><B>Written to Epic + 6 carrier portals</B><St kind="ok">✓ no retype</St></Row>
    </VigWindow>,
    <VigWindow title="Submission · ready to quote">
      <Stack>
        <Row><B>ACORD application</B><St kind="ok">✓ filled</St></Row>
        <Row><B>Carrier supplements</B><St kind="ok">✓ filled</St></Row>
        <Row><B>5-yr loss summary</B><St kind="ok">✓ built</St></Row>
        <Row attn><B>Gap worth a call: no hired-auto</B><St kind="warn">● flagged</St></Row>
      </Stack>
    </VigWindow>,
    <VigWindow title="Renewal · coverage diff">
      <Row className="mb-[10px]"><B>Renews in 23 days · 2026-07-16</B><St kind="warn">● upcoming</St></Row>
      <DiffRow header cells={['Term', 'Expiring', 'Renewal']} />
      <DiffRow cells={['Wind/hail deduct.', '$5,000', '$25,000']} accentIdx={2} />
      <DiffRow cells={['Equipment sublimit', '$250k', '$100k']} accentIdx={2} />
      <DiffRow cells={['Liability limit', '$1M', '$1M']} />
      <Row attn className="mt-[10px]"><B>2 silent downgrades · client summary drafted</B><St kind="ok">✓</St></Row>
    </VigWindow>,
    <VigWindow title="Certificate queue">
      <Stack>
        <Row><B>COI · 14 Wells Fargo (AI)</B><St kind="ok">✓ issued</St></Row>
        <Row><B>COI · Waiver of subro</B><St kind="ok">✓ issued</St></Row>
        <Row><B>COI · primary &amp; non-contrib.</B><St kind="no">✗ not on policy</St></Row>
        <Row attn><B>1 exception needs you · 2 shipped</B><St kind="warn">● review</St></Row>
      </Stack>
    </VigWindow>,
  ],

  'wholesale-brokers': [
    <VigWindow title="Inbox triage">
      <Stack>
        <Row><B>Cedar Logistics · Property</B><St kind="ok">✓ in appetite · complete</St></Row>
        <Row><B>Harbor Foods · GL</B><St kind="warn">● missing SOV + loss runs</St></Row>
        <Row><B>Pinewood Mfg · WC</B><St kind="no">✗ out of appetite</St></Row>
      </Stack>
    </VigWindow>,
    <VigWindow title="Market match · with reasoning">
      <Stack gap={9}>
        <Bar label="Nautilus" pct={92} value="92%" />
        <Bar label="RSUI" pct={81} value="81%" />
        <Bar label="Scottsdale" pct={64} value="64%" />
      </Stack>
      <Note>Ranked on carrier guidelines + your quoting history</Note>
    </VigWindow>,
    <VigWindow title="Proposal · drafted">
      <DiffRow header cells={['Carrier', 'Premium', 'Status']} />
      <DiffRow cells={['Nautilus', '$18,400', <St kind="ok">ready</St>]} />
      <DiffRow cells={['RSUI', '$21,050', <St kind="ok">ready</St>]} />
      <Row attn className="mt-[8px]"><B>Proposal back to retailer</B><St kind="ok">✓ 2 hrs</St></Row>
    </VigWindow>,
    <VigWindow title="Bind · surplus lines">
      <Stack>
        <Row><B>Binder issued</B><St kind="ok">✓</St></Row>
        <Row><B>SL tax + stamping (TX)</B><St kind="ok">✓ filed</St></Row>
        <Row><B>Diligent search affidavit</B><St kind="ok">✓ attached</St></Row>
      </Stack>
    </VigWindow>,
  ],

  'mgas-insurers': [
    <VigWindow title="Guideline check">
      <Stack>
        <Row><B>TIV within authority</B><St kind="ok">✓ clear</St></Row>
        <Row><B>Protection class 4</B><St kind="ok">✓ clear</St></Row>
        <Row><B>Coastal tier · refer</B><St kind="warn">● refer + reason</St></Row>
      </Stack>
    </VigWindow>,
    <VigWindow title="Rating + benchmark">
      <KV k="Indicated premium" v="$34,800" />
      <KV k="Rate / $100 TIV" v="0.42" />
      <div className="mt-[8px]">
        <KV k="vs similar accounts" v="+4%" />
      </div>
    </VigWindow>,
    <VigWindow title="Audit trail">
      <Stack>
        <Row><B>Rates applied per program</B><St kind="ok">✓</St></Row>
        <Row><B>Form set matched</B><St kind="ok">✓</St></Row>
        <Row attn><B>1 bind outside authority</B><St kind="warn">● flagged</St></Row>
      </Stack>
    </VigWindow>,
    <VigWindow title="Bordereaux · carrier format">
      <DiffRow header cells={['Policy', 'Premium', 'Recon']} />
      <DiffRow cells={['BX-1102', '$4,210', <St kind="ok">✓</St>]} />
      <DiffRow cells={['BX-1103', '$2,980', <St kind="ok">✓</St>]} />
      <Row attn className="mt-[8px]"><B>Reconciled to bound policies</B><St kind="ok">✓ ready</St></Row>
    </VigWindow>,
  ],

  // data order: FNOL · Signals · Coverage · Reports
  'claims-tpas': [
    <VigWindow title="FNOL intake">
      <TwoCol
        left={
          <>
            <Row><B>Phone</B></Row>
            <Row><B>Email · Portal · Fax</B></Row>
          </>
        }
        right={
          <>
            <KV k="Claim file" v="#CLM-88421" />
            <KV k="Policy matched" v="✓" />
          </>
        }
      />
      <Row attn className="mt-[8px]"><B>Acknowledged within SLA</B><St kind="ok">✓ 1h12m</St></Row>
    </VigWindow>,
    <VigWindow title="Signals · for adjuster review">
      <Stack>
        <Row attn><B>Possible subrogation · 3rd party</B><St kind="warn">● review</St></Row>
        <Row attn><B>Prior-loss pattern noted</B><St kind="warn">● review</St></Row>
      </Stack>
      <Note>Cooper flags, the adjuster decides</Note>
    </VigWindow>,
    <VigWindow title="Coverage · policy vs loss">
      <KV k="Per-occurrence limit" v="$500k" />
      <KV k="Deductible" v="$2,500" />
      <KV k="Water exclusion" v="applies" accent />
      <Note>With the contract language cited</Note>
    </VigWindow>,
    <VigWindow title="Reports · on demand">
      <Stack>
        <Row><B>Loss run · Acme account</B><St kind="ok">✓ generated</St></Row>
        <Row><B>Large-loss report (&gt;$50k)</B><St kind="ok">✓ generated</St></Row>
        <Row><B>Reserves &amp; diaries</B><St kind="ok">✓ current</St></Row>
      </Stack>
    </VigWindow>,
  ],

  reinsurers: [
    <VigWindow title="Cedent file · mapped">
      <TwoCol
        left={<FileChip name="cedent_bdx.xlsx" meta="XLSX · 1.2 MB" />}
        right={
          <>
            <KV k="Mapped fields" v="142 / 142" />
            <KV k="Gaps" v="7 flagged" accent />
          </>
        }
      />
      <Row attn className="mt-[8px]"><B>Standard schema · usable</B><St kind="ok">✓</St></Row>
    </VigWindow>,
    <VigWindow title="Accumulation · by peril">
      <Stack gap={9}>
        <Bar label="FL wind" pct={96} value="96%" alert />
        <Bar label="CA quake" pct={61} value="61%" />
        <Bar label="TX hail" pct={44} value="44%" />
      </Stack>
      <Note accent>FL wind over tolerance · alert</Note>
    </VigWindow>,
    <VigWindow title="Treaty · wording check">
      <Stack>
        <Row><B>Event definition matches</B><St kind="ok">✓</St></Row>
        <Row><B>Hours clause · 72h</B><St kind="ok">✓</St></Row>
        <Row attn><B>Claim ceded off-contract</B><St kind="warn">● flagged</St></Row>
      </Stack>
    </VigWindow>,
    <VigWindow title="Renewal file · assembled">
      <Stack>
        <Row><B>5-yr experience</B><St kind="ok">✓ compiled</St></Row>
        <Row><B>Exposure history</B><St kind="ok">✓ lined up</St></Row>
        <Row><B>Modeled view</B><St kind="ok">✓ attached</St></Row>
      </Stack>
    </VigWindow>,
  ],
}
