/* global React */
// Bills empty states + Add Bill modal — Iteration 2

const { Z, ACCENTS, SERVICE_COLORS, SERVICE_ICONS, Icons } = window.UB;
const { ModalShell, ModalFooter, FieldGroup, Label, Input, Textarea, HintText, Ic2, ModalStage } = window;
const ACCENT_V = ACCENTS.violet;

// ---- Shared chevron select ----
function ChevSel({ id, value, options, placeholder, filled }) {
  return (
    <div style={{ position: 'relative' }}>
      <select id={id} defaultValue={value || ''} style={{
        appearance: 'none', WebkitAppearance: 'none',
        width: '100%', height: 36, padding: '0 32px 0 12px',
        fontSize: 14, fontFamily: 'inherit',
        color: value ? Z.foreground : Z.mutedFg,
        background: filled ? ACCENT_V.tintBg : Z.background,
        border: `1px solid ${filled ? ACCENT_V.tintBorder : Z.border}`,
        borderRadius: 6, fontWeight: filled ? 500 : 400, cursor: 'pointer',
      }}>
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={Z.mutedFg} strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
        style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
        <path d="m6 9 6 6 6-6"/>
      </svg>
    </div>
  );
}

const PROP_OPTS = [
  { value: 'p1', label: 'Apartment on Main St' },
  { value: 'p2', label: "Mom's apartment" },
  { value: 'p3', label: 'Summer house' },
];
const SVC_OPTS = [
  { value: 'electricity', label: 'Electricity' },
  { value: 'gas',         label: 'Gas' },
  { value: 'coldWater',   label: 'Cold water' },
  { value: 'hotWater',    label: 'Hot water' },
  { value: 'internet',    label: 'Internet' },
  { value: 'heating',     label: 'Heating' },
];
const MONTH_OPTS = [
  { value: 'apr2026', label: 'April 2026' },
  { value: 'mar2026', label: 'March 2026' },
  { value: 'feb2026', label: 'February 2026' },
  { value: 'jan2026', label: 'January 2026' },
  { value: 'dec2025', label: 'December 2025' },
  { value: 'nov2025', label: 'November 2025' },
  { value: 'custom',  label: 'Custom month…' },
];

// Service chip
function SvcChip({ svcId }) {
  const color = SERVICE_COLORS[svcId];
  const Ic = SERVICE_ICONS[svcId];
  const names = { electricity:'Electricity', gas:'Gas', coldWater:'Cold water', hotWater:'Hot water', internet:'Internet', heating:'Heating' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '2px 8px 2px 5px',
      background: color + '18', border: `1px solid ${color}2A`,
      borderRadius: 999, fontSize: 12, fontWeight: 500, color: Z.foreground,
    }}>
      {Ic && <Ic size={12} stroke={color}/>}{names[svcId]}
    </span>
  );
}

// ---- Add Bill — Default ----
function AddBillDefault() {
  return (
    <ModalShell title="Add bill" footer={<ModalFooter submitLabel="Save"/>}>
      <FieldGroup>
        <div>
          <Label htmlFor="ab-prop-d">Property</Label>
          <ChevSel id="ab-prop-d" placeholder="Select property…" options={PROP_OPTS}/>
        </div>
        <div>
          <Label htmlFor="ab-svc-d">Service</Label>
          <ChevSel id="ab-svc-d" placeholder="Select service…" options={SVC_OPTS}/>
          <HintText>Filtered by selected property</HintText>
        </div>
        <div>
          <Label htmlFor="ab-month-d">Month</Label>
          <ChevSel id="ab-month-d" value="apr2026" options={MONTH_OPTS}/>
        </div>
        <div>
          <Label htmlFor="ab-amt-d">Amount (UAH)</Label>
          <Input id="ab-amt-d" value="" placeholder="e.g. 680"/>
        </div>
        <div>
          <Label htmlFor="ab-notes-d">Notes <span style={{ fontWeight:400, color:Z.mutedFg }}>(optional)</span></Label>
          <Textarea id="ab-notes-d" value="" placeholder="Any remarks…"/>
        </div>
      </FieldGroup>
    </ModalShell>
  );
}

// ---- Add Bill — Filled (Electricity + amount + hints) ----
function AddBillFilled() {
  const inputFilled = {
    fontWeight: 500,
    border: `1px solid ${ACCENT_V.tintBorder}`,
    background: ACCENT_V.tintBg,
  };
  return (
    <ModalShell title="Add bill" footer={<ModalFooter submitLabel="Save"/>}>
      <FieldGroup>
        <div>
          <Label htmlFor="ab-prop-f">Property</Label>
          <ChevSel id="ab-prop-f" value="p1" filled options={PROP_OPTS}/>
        </div>
        <div>
          <Label htmlFor="ab-svc-f">Service</Label>
          <ChevSel id="ab-svc-f" value="electricity" filled options={SVC_OPTS}/>
          <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, color: Z.mutedFg }}>Selected:</span>
            <SvcChip svcId="electricity"/>
          </div>
        </div>
        <div>
          <Label htmlFor="ab-month-f">Month</Label>
          <ChevSel id="ab-month-f" value="apr2026" filled options={MONTH_OPTS}/>
        </div>
        <div>
          <Label htmlFor="ab-amt-f">Amount (UAH)</Label>
          <Input id="ab-amt-f" value="760" style={inputFilled}/>
          <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12.5, color: Z.mutedFg }}>Expected based on your tariff:</span>
            <span style={{
              fontSize: 12.5, fontWeight: 600, color: Z.foreground,
              background: Z.muted, padding: '1px 7px', borderRadius: 4,
              fontFeatureSettings: '"tnum" 1',
            }}>432 UAH</span>
          </div>
          <HintText warning>Amount is 76% higher than expected — double-check before saving.</HintText>
        </div>
        <div>
          <Label htmlFor="ab-notes-f">Notes <span style={{ fontWeight:400, color:Z.mutedFg }}>(optional)</span></Label>
          <Textarea id="ab-notes-f" value="Unusually high — AC running all month" placeholder="Any remarks…"/>
        </div>
      </FieldGroup>
    </ModalShell>
  );
}

// ================================================================
// BILLS EMPTY STATES
// ================================================================

// Large icon placeholder
function EmptyIcon({ children }) {
  return (
    <div style={{
      width: 72, height: 72, borderRadius: 16,
      background: Z.muted,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>{children}</div>
  );
}

function EmptyCard({ icon, title, body, cta }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
      <div style={{
        maxWidth: 440, width: '100%',
        background: Z.card,
        border: `1px solid ${Z.border}`,
        borderRadius: 8,
        boxShadow: '0 1px 2px rgba(24,24,27,0.05)',
        padding: '56px 32px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', textAlign: 'center', gap: 18,
      }}>
        {icon}
        <div>
          <h3 style={{ margin:0, fontSize:18, fontWeight:600, letterSpacing:-0.3 }}>{title}</h3>
          <p style={{ margin:'8px 0 0', fontSize:14, color:Z.mutedFg, lineHeight:1.5 }}>{body}</p>
        </div>
        {cta}
      </div>
    </div>
  );
}

// Fake topbar + header (static, no interactivity needed for empty states)
function BillsShell({ children, filterBar }) {
  return (
    <div style={{
      fontFamily: "'Inter', system-ui, sans-serif",
      WebkitFontSmoothing: 'antialiased',
      background: Z.background, minHeight: '100%', color: Z.foreground,
    }}>
      <window.UB.TopBar accent={ACCENT_V} activeNav="Bills"/>
      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '32px 32px 48px' }}>
        {/* Page header */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24 }}>
          <div>
            <h2 style={{ margin:0, fontSize:28, fontWeight:600, letterSpacing:-0.6 }}>Bills</h2>
            <div style={{ marginTop:5, fontSize:13, color:Z.mutedFg }}>0 records</div>
          </div>
          <button style={{
            display:'inline-flex', alignItems:'center', gap:6,
            height:34, padding:'0 16px', fontSize:13.5, fontWeight:500,
            background: ACCENT_V.solid, color:'#fff',
            border:'none', borderRadius:6, cursor:'pointer', fontFamily:'inherit',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5v14"/></svg>
            Add bill
          </button>
        </div>
        {filterBar}
        {children}
      </div>
    </div>
  );
}

// State A — No bills at all
function BillsEmptyNoBills() {
  return (
    <BillsShell>
      <EmptyCard
        icon={<EmptyIcon>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={Z.mutedFg} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z"/>
            <path d="M16 8H8M16 12H8M12 16H8"/>
          </svg>
        </EmptyIcon>}
        title="No bills yet"
        body={<>Record your first bill to start<br/>tracking expenses.</>}
        cta={
          <button style={{
            display:'inline-flex', alignItems:'center', gap:6,
            height:36, padding:'0 18px', fontSize:13.5, fontWeight:500,
            background: ACCENT_V.solid, color:'#fff',
            border:'none', borderRadius:6, cursor:'pointer', fontFamily:'inherit',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5v14"/></svg>
            Add bill
          </button>
        }
      />
    </BillsShell>
  );
}

// State B — Has bills, but active filters yield nothing
function BillsEmptyFiltered() {
  return (
    <BillsShell
      filterBar={
        <div style={{
          display:'flex', alignItems:'center', gap:10,
          padding:'10px 14px',
          background: Z.background, border:`1px solid ${Z.border}`,
          borderRadius:8, marginBottom:16, flexWrap:'wrap',
        }}>
          <span style={{ fontSize:12.5, color:Z.mutedFg, paddingLeft:2 }}>Filter</span>
          {/* Active filters shown with tinted selects */}
          {[
            { label: "Summer house", active: true },
            { label: "Electricity",  active: true },
            { label: "Last 3 months",active: false },
          ].map(f => (
            <div key={f.label} style={{ position:'relative' }}>
              <div style={{
                display:'inline-flex', alignItems:'center', gap:8,
                height:32, padding:'0 28px 0 12px',
                fontSize:13, fontFamily:'inherit',
                color: f.active ? ACCENT_V.solid : Z.foreground,
                background: f.active ? ACCENT_V.tintBg : Z.background,
                border: `1px solid ${f.active ? ACCENT_V.tintBorder : Z.border}`,
                borderRadius:6, fontWeight: f.active ? 500 : 400,
                minWidth:140,
              }}>
                {f.label}
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={f.active ? ACCENT_V.solid : Z.mutedFg} strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
                style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}>
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </div>
          ))}
          <div style={{ flex:1 }}/>
          <button style={{
            background:'none', border:'none', cursor:'pointer',
            fontSize:12.5, color:Z.mutedFg, textDecoration:'underline',
            padding:'0 4px', fontFamily:'inherit',
          }}>Clear filters</button>
        </div>
      }
    >
      <EmptyCard
        icon={<EmptyIcon>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={Z.mutedFg} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13.013 3H2l8 9.46V19l4 2v-8.054l.26-.31"/>
            <path d="m22 3-5 5M17 3l5 5"/>
          </svg>
        </EmptyIcon>}
        title="No bills match your filters"
        body={<>Try adjusting period, property,<br/>or service filters.</>}
        cta={
          <button style={{
            display:'inline-flex', alignItems:'center', gap:6,
            height:36, padding:'0 18px', fontSize:13.5, fontWeight:500,
            background: Z.background, color: Z.foreground,
            border:`1px solid ${Z.border}`, borderRadius:6,
            cursor:'pointer', fontFamily:'inherit',
          }}>
            Clear filters
          </button>
        }
      />
    </BillsShell>
  );
}

window.AddBillDefault = AddBillDefault;
window.AddBillFilled = AddBillFilled;
window.BillsEmptyNoBills = BillsEmptyNoBills;
window.BillsEmptyFiltered = BillsEmptyFiltered;
