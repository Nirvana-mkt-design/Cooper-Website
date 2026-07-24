import type { ReactNode } from 'react'
import { VigWindow, FileChip, B, St, Row, Stack, KV, DiffRow, Bar, TwoCol, Note } from './vignette-kit'

/* ──────────────────────────────────────────────────────────────
   Vignettes — Cooper product-UI mockup content, one per feature,
   per the Cooper team's June-24 spec. Primitives in vignette-kit.tsx.
─────────────────────────────────────────────────────────────── */

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
            <KV k="Named insured" v="Maplewood Manufacturing" />
            <KV k="Submission ID" v="SUB-4471902" />
            <KV k="Eff. date" v="2026-06-25" />
          </>
        }
      />
      <Row attn className="mt-[10px]"><B>Written to Epic + 6 carrier portals</B><St kind="ok">✓ no re-entry</St></Row>
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
      <div
        className="mb-[10px] flex flex-wrap items-center justify-center gap-x-[10px] gap-y-[3px] border-b px-[11px] py-[8px] font-sans text-[12.5px] text-dark/70"
        style={{ borderColor: '#E2D9CF' }}
      >
        <B>Renews in 16 days · 2026-07-16</B>
        <St kind="warn">● upcoming</St>
      </div>
      <DiffRow header cells={['Term', 'Expiring', 'Renewal']} />
      <DiffRow cells={['Wind/hail deduct.', '2% TIV', '5% TIV']} accentIdx={2} />
      <DiffRow cells={['Equipment sublimit', '$250k', '$100k']} accentIdx={2} />
      <DiffRow cells={['Liability limit', '$1M', '$1M']} />
      <Row attn className="mt-[10px]"><B>2 silent downgrades · client summary drafted</B><St kind="ok">✓</St></Row>
    </VigWindow>,
    <VigWindow title="Certificate queue">
      <Stack>
        <Row><B>COI · Wells Fargo (additional insured)</B><St kind="ok">✓ issued</St></Row>
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
        <Row><B>Harbor Foods · GL</B><St kind="warn">● missing loss runs + GL supplement</St></Row>
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
      <Row attn className="mt-[8px]"><B>Quote back to retailer</B><St kind="ok">✓ 2 hrs</St></Row>
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
        <Row><B>Loss run · Granite Peak Contractors</B><St kind="ok">✓ generated</St></Row>
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
            <KV k="Fields mapped" v="142 / 142" />
            <KV k="Rows with value gaps" v="7 flagged" accent />
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
