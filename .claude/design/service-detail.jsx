/* global React */
// Service detail page — Iteration 3
// Route: /properties/[id]/services/[sid] — Electricity, Home apartment, two-zone meter
// Reuses window.UB primitives from dashboard.jsx

const { useState: useStSD } = React;
const { Z, ACCENTS, SERVICE_COLORS, Icons, TopBar } = window.UB;
const AV = ACCENTS.violet; // locked accent

// ── Extra icons ──────────────────────────────────────────────
const SDI = {
  Zap:        (p) => <svg width={p.s||16} height={p.s||16} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth={p.w||1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>,
  Receipt:    (p) => <svg width={p.s||16} height={p.s||16} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth={p.w||1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z"/><path d="M16 8H8M16 12H8M12 16H8"/></svg>,
  Wallet:     (p) => <svg width={p.s||16} height={p.s||16} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth={p.w||1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>,
  Pencil:     (p) => <svg width={p.s||16} height={p.s||16} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth={p.w||1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>,
  MoreH:      (p) => <svg width={p.s||16} height={p.s||16} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth={p.w||1.75} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>,
  ChevR:      (p) => <svg width={p.s||14} height={p.s||14} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>,
  ChevSlash:  (p) => <svg width={p.s||13} height={p.s||13} viewBox="0 0 24 24" fill="none" stroke={p.c||Z.border} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>,
  Gauge:      (p) => <svg width={p.s||16} height={p.s||16} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth={p.w||1.75} strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>,
  ArrowRight: (p) => <svg width={p.s||14} height={p.s||14} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  Plus:       (p) => <svg width={p.s||14} height={p.s||14} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5v14"/></svg>,
};

// ── Shared primitives ────────────────────────────────────────
const cardShadow = '0 1px 2px rgba(24,24,27,0.05)';

function SCard({ children, style }) {
  return (
    <div style={{
      background: Z.card, border: `1px solid ${Z.border}`,
      borderRadius: 8, boxShadow: cardShadow, ...style,
    }}>{children}</div>
  );
}

function CardHeader({ title, action }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 20px', borderBottom: `1px solid ${Z.border}`,
    }}>
      <span style={{ fontSize: 13.5, fontWeight: 600, color: Z.foreground, letterSpacing: -0.1 }}>
        {title}
      </span>
      {action}
    </div>
  );
}

function OutlineBtn({ children, onClick, style }) {
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      height: 32, padding: '0 12px', fontSize: 13, fontWeight: 500,
      background: Z.background, color: Z.foreground,
      border: `1px solid ${Z.border}`, borderRadius: 6,
      cursor: 'pointer', fontFamily: 'inherit', ...style,
    }}>{children}</button>
  );
}

function PrimaryBtn({ children, onClick, style }) {
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      height: 32, padding: '0 14px', fontSize: 13, fontWeight: 500,
      background: AV.solid, color: '#fff', border: 'none',
      borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit', ...style,
    }}>{children}</button>
  );
}

function GhostBtn({ children, onClick, style }) {
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      height: 32, padding: '0 10px', fontSize: 13, fontWeight: 500,
      background: 'transparent', color: Z.mutedFg,
      border: 'none', borderRadius: 6,
      cursor: 'pointer', fontFamily: 'inherit', ...style,
    }}>{children}</button>
  );
}

function IconBtn({ children, style }) {
  return (
    <button style={{
      width: 30, height: 30, borderRadius: 6,
      border: `1px solid ${Z.border}`, background: Z.background,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', ...style,
    }}>{children}</button>
  );
}

// ── Breadcrumbs ──────────────────────────────────────────────
function Breadcrumbs({ items }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      fontSize: 13, color: Z.mutedFg, marginBottom: 10,
    }}>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <SDI.ChevSlash/>}
          {item.href
            ? <a href="#" style={{ color: Z.mutedFg, textDecoration: 'none' }}>{item.label}</a>
            : <span style={{ color: Z.foreground }}>{item.label}</span>
          }
        </React.Fragment>
      ))}
    </div>
  );
}

// ── KV grid ─────────────────────────────────────────────────
function KVGrid({ pairs, cols = 2 }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap: '14px 32px',
    }}>
      {pairs.map(([k, v], i) => (
        <div key={i}>
          <div style={{ fontSize: 11.5, fontWeight: 500, color: Z.mutedFg, textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 4 }}>
            {k}
          </div>
          <div style={{ fontSize: 13.5, color: Z.foreground, lineHeight: 1.4 }}>{v}</div>
        </div>
      ))}
    </div>
  );
}

// ── Section 1: Balance card ───────────────────────────────────
function BalanceCard() {
  return (
    <SCard>
      <div style={{ padding: '24px 24px 20px' }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: Z.mutedFg, textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 12 }}>
          Current balance
        </div>
        <div style={{
          fontSize: 42, fontWeight: 700, color: Z.destructive,
          letterSpacing: -1.2, fontFeatureSettings: '"tnum" 1', lineHeight: 1,
        }}>
          −1,240.50 <span style={{ fontSize: 22, fontWeight: 500 }}>₴</span>
        </div>
        <div style={{ fontSize: 13.5, color: Z.mutedFg, marginTop: 8 }}>
          You owe <strong style={{ color: Z.destructive, fontWeight: 600 }}>1,240.50 ₴</strong> for this service
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
          <OutlineBtn><SDI.Receipt s={13} c={Z.foreground}/> View all bills</OutlineBtn>
          <OutlineBtn><SDI.Wallet s={13} c={Z.foreground}/> View all payments</OutlineBtn>
        </div>
      </div>
    </SCard>
  );
}

// ── Section 2: Current contract card ─────────────────────────
function ContractCard({ onUpdate, onHistory }) {
  return (
    <SCard>
      <CardHeader
        title="Current contract"
        action={
          <div style={{ display: 'flex', gap: 6 }}>
            <PrimaryBtn onClick={onUpdate}>Update contract</PrimaryBtn>
            <GhostBtn onClick={onHistory}>View history</GhostBtn>
          </div>
        }
      />
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <KVGrid pairs={[
          ['Provider',       'ДТЭК Київські електромережі'],
          ['In effect since','March 1, 2024'],
          ['Account number', '123456789'],
          ['Tariff type',    'Two-zone (T1 / T2)'],
        ]}/>

        {/* Tariff rates */}
        <div>
          <div style={{ fontSize: 11.5, fontWeight: 500, color: Z.mutedFg, textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 10 }}>
            Tariff rates
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { label: 'Day (T1)', rate: '4.32', unit: '₴/kWh', color: SERVICE_COLORS.electricity },
              { label: 'Night (T2)', rate: '2.16', unit: '₴/kWh', color: '#6366f1' },
            ].map(t => (
              <div key={t.label} style={{
                flex: 1, padding: '12px 14px', borderRadius: 8,
                background: t.color + '0F',
                border: `1px solid ${t.color}25`,
              }}>
                <div style={{ fontSize: 11.5, color: Z.mutedFg, marginBottom: 4 }}>{t.label}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: Z.foreground, letterSpacing: -0.4, fontFeatureSettings: '"tnum" 1' }}>
                  {t.rate} <span style={{ fontSize: 12, fontWeight: 500, color: Z.mutedFg }}>{t.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment details */}
        <div>
          <div style={{ fontSize: 11.5, fontWeight: 500, color: Z.mutedFg, textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 8 }}>
            Payment details
          </div>
          <div style={{
            padding: '10px 12px', borderRadius: 6,
            background: Z.muted, border: `1px solid ${Z.border}`,
            fontSize: 12.5, color: Z.foreground, lineHeight: 1.6,
            fontFamily: 'ui-monospace, "Cascadia Code", "Fira Code", monospace',
          }}>
            IBAN UA20 3052 9900 0002 6007 0123 4567 8<br/>
            Recipient: ДТЭК Київські електромережі<br/>
            EDRPOU: 12345678
          </div>
        </div>
      </div>
    </SCard>
  );
}

// ── Section 3: Meter card ─────────────────────────────────────
function MeterCard({ onSubmit }) {
  return (
    <SCard>
      <CardHeader
        title="Meter"
        action={
          <div style={{ display: 'flex', gap: 6 }}>
            <PrimaryBtn onClick={onSubmit}><SDI.Gauge s={13} c="#fff"/> Submit reading</PrimaryBtn>
            <GhostBtn>View meter details</GhostBtn>
          </div>
        }
      />
      <div style={{ padding: '20px 24px' }}>
        <KVGrid pairs={[
          ['Serial number', 'NIK2303-11-456789'],
          ['Type',          'Two-zone (T1 day / T2 night)'],
          ['Installed',     'January 15, 2023'],
          ['Last reading',  'October 22, 2025'],
        ]}/>

        {/* Last reading details */}
        <div style={{
          marginTop: 18, display: 'flex', gap: 10,
        }}>
          {[
            { label: 'T1 — Day', value: '8,432', unit: 'kWh', color: SERVICE_COLORS.electricity },
            { label: 'T2 — Night', value: '3,210', unit: 'kWh', color: '#6366f1' },
          ].map(r => (
            <div key={r.label} style={{
              flex: 1, padding: '10px 14px', borderRadius: 8,
              background: r.color + '0F', border: `1px solid ${r.color}25`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: 12.5, color: Z.mutedFg }}>{r.label}</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: Z.foreground, fontFeatureSettings: '"tnum" 1' }}>
                {r.value} <span style={{ fontSize: 11, fontWeight: 500, color: Z.mutedFg }}>{r.unit}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </SCard>
  );
}

// ── Section 4: Recent activity ────────────────────────────────
const ACTIVITY = [
  { type:'bill',    period:'Oct 2025', date:'Nov 10, 2025', amount: 1240.50, note:'Higher than usual — check readings' },
  { type:'payment', period:'Sep 2025', date:'Sep 28, 2025', amount:  980.00, note:'Paid Sep 28' },
  { type:'bill',    period:'Sep 2025', date:'Oct 12, 2025', amount:  980.00 },
  { type:'payment', period:'Aug 2025', date:'Sep 1, 2025',  amount:  840.00, note:'Paid Sep 1' },
  { type:'bill',    period:'Aug 2025', date:'Sep 10, 2025', amount:  840.00 },
  { type:'payment', period:'Jul 2025', date:'Aug 3, 2025',  amount:  720.00, note:'Paid Aug 3' },
];

function ActivityRow({ item, isLast }) {
  const isBill = item.type === 'bill';
  const color  = isBill ? Z.destructive : Z.success;
  const Ic     = isBill ? SDI.Receipt : SDI.Wallet;
  const icColor= isBill ? '#ef4444' : '#16a34a';
  const [hover, setHover] = useStSD(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '13px 20px',
        borderBottom: isLast ? 'none' : `1px solid ${Z.border}`,
        background: hover ? Z.subtle : 'transparent',
        transition: 'background 120ms',
        cursor: 'pointer',
      }}
    >
      <div style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        background: icColor + '15',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Ic s={15} c={icColor}/>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13.5, fontWeight: 500, color: Z.foreground }}>
          {item.period} {isBill ? 'bill' : 'payment'}
        </div>
        {item.note && (
          <div style={{ fontSize: 12, color: Z.mutedFg, marginTop: 2 }}>{item.note}</div>
        )}
      </div>
      <div style={{
        fontSize: 14, fontWeight: 600, color,
        fontFeatureSettings: '"tnum" 1',
      }}>
        {isBill ? '−' : '+'}{item.amount.toLocaleString('uk-UA', { minimumFractionDigits: 2 })} ₴
      </div>
      <SDI.ChevR s={14} c={hover ? AV.solid : Z.border}/>
    </div>
  );
}

function ActivityCard() {
  return (
    <SCard>
      <CardHeader title="Recent activity"/>
      <div>
        {ACTIVITY.map((item, i) => (
          <ActivityRow key={i} item={item} isLast={i === ACTIVITY.length - 1}/>
        ))}
      </div>
      <div style={{
        padding: '12px 20px',
        borderTop: `1px solid ${Z.border}`,
      }}>
        <a href="#" style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          fontSize: 13, fontWeight: 500, color: AV.solid, textDecoration: 'none',
        }}>
          See all activity <SDI.ArrowRight s={13} c={AV.solid}/>
        </a>
      </div>
    </SCard>
  );
}

// ── Section 5: Notes card ─────────────────────────────────────
function NotesCard() {
  return (
    <SCard>
      <div style={{
        display: 'flex', alignItems: 'flex-start',
        justifyContent: 'space-between', padding: '16px 20px 14px',
      }}>
        <span style={{ fontSize: 13.5, fontWeight: 600, color: Z.foreground }}>Notes</span>
        <IconBtn><SDI.Pencil s={13} c={Z.mutedFg}/></IconBtn>
      </div>
      <div style={{ padding: '0 20px 20px' }}>
        <p style={{
          margin: 0, fontSize: 13.5, color: Z.foreground,
          lineHeight: 1.65, whiteSpace: 'pre-wrap',
        }}>
          {"Двухзонный счётчик, льготного тарифа нет.\nВ октябре увеличился расход — возможно из-за обогревателя в ванной."}
        </p>
      </div>
    </SCard>
  );
}

// ── Quick action bar (desktop — below last section) ───────────
function QuickActions({ onSubmit }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '14px 20px',
      background: Z.card, border: `1px solid ${Z.border}`,
      borderRadius: 8, boxShadow: cardShadow,
    }}>
      <span style={{ fontSize: 13, color: Z.mutedFg, marginRight: 8 }}>Quick actions</span>
      <PrimaryBtn onClick={onSubmit} style={{ height: 36, fontSize: 13.5 }}>
        <SDI.Gauge s={14} c="#fff"/> Submit reading
      </PrimaryBtn>
      <OutlineBtn style={{ height: 36, fontSize: 13.5 }}>
        <SDI.Receipt s={13} c={Z.foreground}/> Add bill
      </OutlineBtn>
      <OutlineBtn style={{ height: 36, fontSize: 13.5 }}>
        <SDI.Wallet s={13} c={Z.foreground}/> Record payment
      </OutlineBtn>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────
function ServiceDetail({ onUpdateContract, onViewHistory, dark, reminders }) {
  const bg   = dark ? '#09090b' : Z.background;
  const fg   = dark ? '#fafafa' : Z.foreground;
  return (
    <div style={{
      fontFamily: "'Inter', system-ui, sans-serif",
      WebkitFontSmoothing: 'antialiased',
      background: bg, color: fg, minHeight: '100%',
    }}>
      <TopBar accent={AV} activeNav="Properties"/>
      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '28px 32px 56px' }}>
        <Breadcrumbs items={[
          { label: 'Home', href: '#' },
          { label: 'Home apartment', href: '#' },
          { label: 'Electricity' },
        ]}/>

        {/* Page header */}
        <div style={{
          display: 'flex', alignItems: 'flex-start',
          justifyContent: 'space-between', marginBottom: 28,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: SERVICE_COLORS.electricity + '18',
              border: `1px solid ${SERVICE_COLORS.electricity}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <SDI.Zap s={22} c={SERVICE_COLORS.electricity}/>
            </div>
            <div>
              <h1 style={{
                margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: -0.6,
                color: dark ? '#fafafa' : Z.foreground,
              }}>Electricity</h1>
              <div style={{ fontSize: 13.5, color: Z.mutedFg, marginTop: 4 }}>
                ДТЭК Київські електромережі · Home apartment
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <OutlineBtn><SDI.Pencil s={13} c={Z.foreground}/> Edit notes</OutlineBtn>
            <IconBtn><SDI.MoreH s={15} c={Z.foreground}/></IconBtn>
          </div>
        </div>

        {/* Content stack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <BalanceCard/>
          <ContractCard onUpdate={onUpdateContract} onHistory={onViewHistory}/>
          <MeterCard onSubmit={() => {}}/>
          <ActivityCard/>
          {reminders && window.RemindersCard && <window.RemindersCard variant="list"/>}
          <NotesCard/>
          <QuickActions/>
        </div>
      </div>
    </div>
  );
}

// ── Dark mode token override ──────────────────────────────────
const ZD = {
  background: '#09090b',
  foreground: '#fafafa',
  card:        '#18181b',
  cardFg:      '#fafafa',
  muted:       '#27272a',
  mutedFg:     '#71717a',
  border:      '#27272a',
  subtle:      '#18181b',
  destructive: '#f87171',
  success:     '#4ade80',
  warning:     '#fbbf24',
};

function ServiceDetailDark() {
  // Temporarily swap Z values — achieved via a wrapper that overrides CSS variables.
  // We repaint the component with dark tokens by passing them via context trick.
  return (
    <div style={{
      fontFamily: "'Inter', system-ui, sans-serif",
      WebkitFontSmoothing: 'antialiased',
      background: ZD.background, color: ZD.foreground, minHeight: '100%',
    }}>
      {/* Dark TopBar */}
      <div style={{
        height: 64, background: 'rgba(9,9,11,0.85)',
        backdropFilter: 'blur(8px)',
        borderBottom: `1px solid ${ZD.border}`,
        display: 'flex', alignItems: 'center', padding: '0 32px',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 40 }}>
          <div style={{ width: 26, height: 26, borderRadius: 6, background: AV.solid, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SDI.Zap s={15} c="#fff"/>
          </div>
          <span style={{ fontSize: 14.5, fontWeight: 600, letterSpacing: -0.1, color: ZD.foreground }}>UtilityBills</span>
        </div>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1 }}>
          {['Dashboard','Properties','Bills','Payments','Settings'].map((item, i) => {
            const active = item === 'Properties';
            return (
              <a key={item} href="#" style={{
                position: 'relative', padding: '8px 12px',
                fontSize: 13.5, fontWeight: active ? 500 : 400,
                color: active ? ZD.foreground : ZD.mutedFg,
                textDecoration: 'none', borderRadius: 6,
              }}>
                {item}
                {active && <span style={{ position: 'absolute', left: 12, right: 12, bottom: -1, height: 2, background: AV.solid, borderRadius: 2 }}/>}
              </a>
            );
          })}
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: AV.tintBg, color: AV.solid, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>AL</div>
        </div>
      </div>

      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '28px 32px 56px' }}>
        {/* Breadcrumbs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: ZD.mutedFg, marginBottom: 10 }}>
          {['Home', 'Home apartment', 'Electricity'].map((b, i) => (
            <React.Fragment key={b}>
              {i > 0 && <SDI.ChevSlash/>}
              <span style={{ color: i === 2 ? ZD.foreground : ZD.mutedFg }}>{b}</span>
            </React.Fragment>
          ))}
        </div>

        {/* Page header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: SERVICE_COLORS.electricity + '20', border: `1px solid ${SERVICE_COLORS.electricity}35`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SDI.Zap s={22} c={SERVICE_COLORS.electricity}/>
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: -0.6, color: ZD.foreground }}>Electricity</h1>
              <div style={{ fontSize: 13.5, color: ZD.mutedFg, marginTop: 4 }}>ДТЭК Київські електромережі · Home apartment</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ height: 32, padding: '0 12px', fontSize: 13, fontWeight: 500, background: ZD.card, color: ZD.foreground, border: `1px solid ${ZD.border}`, borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit' }}>Edit notes</button>
            <button style={{ width: 32, height: 32, borderRadius: 6, border: `1px solid ${ZD.border}`, background: ZD.card, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><SDI.MoreH s={15} c={ZD.mutedFg}/></button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Balance */}
          <DarkCard>
            <div style={{ padding: '24px 24px 20px' }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: ZD.mutedFg, textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 12 }}>Current balance</div>
              <div style={{ fontSize: 42, fontWeight: 700, color: ZD.destructive, letterSpacing: -1.2, fontFeatureSettings: '"tnum" 1', lineHeight: 1 }}>
                −1,240.50 <span style={{ fontSize: 22, fontWeight: 500 }}>₴</span>
              </div>
              <div style={{ fontSize: 13.5, color: ZD.mutedFg, marginTop: 8 }}>
                You owe <strong style={{ color: ZD.destructive }}>1,240.50 ₴</strong> for this service
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
                {['View all bills', 'View all payments'].map(l => (
                  <button key={l} style={{ height: 32, padding: '0 12px', fontSize: 13, fontWeight: 500, background: ZD.card, color: ZD.foreground, border: `1px solid ${ZD.border}`, borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit' }}>{l}</button>
                ))}
              </div>
            </div>
          </DarkCard>

          {/* Contract */}
          <DarkCard>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${ZD.border}` }}>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: ZD.foreground }}>Current contract</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button style={{ height: 32, padding: '0 14px', fontSize: 13, fontWeight: 500, background: AV.solid, color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit' }}>Update contract</button>
                <button style={{ height: 32, padding: '0 10px', fontSize: 13, background: 'transparent', color: ZD.mutedFg, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>View history</button>
              </div>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 32px' }}>
                {[['Provider','ДТЭК Київські електромережі'],['In effect since','March 1, 2024'],['Account number','123456789'],['Tariff type','Two-zone (T1 / T2)']].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontSize: 11.5, fontWeight: 500, color: ZD.mutedFg, textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 4 }}>{k}</div>
                    <div style={{ fontSize: 13.5, color: ZD.foreground }}>{v}</div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 11.5, fontWeight: 500, color: ZD.mutedFg, textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 10 }}>Tariff rates</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {[{label:'Day (T1)',rate:'4.32',color:SERVICE_COLORS.electricity},{label:'Night (T2)',rate:'2.16',color:'#818cf8'}].map(t => (
                    <div key={t.label} style={{ flex: 1, padding: '12px 14px', borderRadius: 8, background: t.color + '15', border: `1px solid ${t.color}30` }}>
                      <div style={{ fontSize: 11.5, color: ZD.mutedFg, marginBottom: 4 }}>{t.label}</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: ZD.foreground, fontFeatureSettings: '"tnum" 1' }}>{t.rate} <span style={{ fontSize: 12, fontWeight: 500, color: ZD.mutedFg }}>₴/kWh</span></div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11.5, fontWeight: 500, color: ZD.mutedFg, textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 8 }}>Payment details</div>
                <div style={{ padding: '10px 12px', borderRadius: 6, background: ZD.muted, border: `1px solid ${ZD.border}`, fontSize: 12.5, color: ZD.foreground, lineHeight: 1.6, fontFamily: 'ui-monospace, monospace' }}>
                  IBAN UA20 3052 9900 0002 6007 0123 4567 8<br/>Recipient: ДТЭК Київські електромережі<br/>EDRPOU: 12345678
                </div>
              </div>
            </div>
          </DarkCard>

          {/* Meter */}
          <DarkCard>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${ZD.border}` }}>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: ZD.foreground }}>Meter</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button style={{ height: 32, padding: '0 14px', fontSize: 13, fontWeight: 500, background: AV.solid, color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 5 }}><SDI.Gauge s={13} c="#fff"/> Submit reading</button>
                <button style={{ height: 32, padding: '0 10px', fontSize: 13, background: 'transparent', color: ZD.mutedFg, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>View meter details</button>
              </div>
            </div>
            <div style={{ padding: '20px 24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 32px', marginBottom: 16 }}>
                {[['Serial number','NIK2303-11-456789'],['Type','Two-zone (T1 / T2)'],['Installed','January 15, 2023'],['Last reading','October 22, 2025']].map(([k,v]) => (
                  <div key={k}>
                    <div style={{ fontSize: 11.5, fontWeight: 500, color: ZD.mutedFg, textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 4 }}>{k}</div>
                    <div style={{ fontSize: 13.5, color: ZD.foreground }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {[{label:'T1 — Day',value:'8,432',color:SERVICE_COLORS.electricity},{label:'T2 — Night',value:'3,210',color:'#818cf8'}].map(r => (
                  <div key={r.label} style={{ flex: 1, padding: '10px 14px', borderRadius: 8, background: r.color + '15', border: `1px solid ${r.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12.5, color: ZD.mutedFg }}>{r.label}</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: ZD.foreground, fontFeatureSettings: '"tnum" 1' }}>{r.value} <span style={{ fontSize: 11, color: ZD.mutedFg }}>kWh</span></span>
                  </div>
                ))}
              </div>
            </div>
          </DarkCard>

          {/* Activity */}
          <DarkCard>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${ZD.border}` }}>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: ZD.foreground }}>Recent activity</span>
            </div>
            <div>
              {[
                { type:'bill',    period:'Oct 2025', amount:1240.50, note:'Higher than usual — check readings' },
                { type:'payment', period:'Sep 2025', amount:980.00,  note:'Paid Sep 28' },
                { type:'bill',    period:'Sep 2025', amount:980.00 },
                { type:'payment', period:'Aug 2025', amount:840.00,  note:'Paid Sep 1' },
                { type:'bill',    period:'Aug 2025', amount:840.00 },
              ].map((item, i, arr) => {
                const isBill = item.type === 'bill';
                const color = isBill ? ZD.destructive : ZD.success;
                const icColor = isBill ? '#f87171' : '#4ade80';
                const Ic = isBill ? SDI.Receipt : SDI.Wallet;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 20px', borderBottom: i === arr.length-1 ? 'none' : `1px solid ${ZD.border}` }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: icColor + '20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Ic s={15} c={icColor}/>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 500, color: ZD.foreground }}>{item.period} {isBill ? 'bill' : 'payment'}</div>
                      {item.note && <div style={{ fontSize: 12, color: ZD.mutedFg, marginTop: 2 }}>{item.note}</div>}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color, fontFeatureSettings: '"tnum" 1' }}>
                      {isBill ? '−' : '+'}{item.amount.toFixed(2)} ₴
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ padding: '12px 20px', borderTop: `1px solid ${ZD.border}` }}>
              <a href="#" style={{ fontSize: 13, fontWeight: 500, color: AV.solid, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5 }}>See all activity <SDI.ArrowRight s={13} c={AV.solid}/></a>
            </div>
          </DarkCard>

          {/* Notes */}
          <DarkCard>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '16px 20px 14px' }}>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: ZD.foreground }}>Notes</span>
              <button style={{ width: 30, height: 30, borderRadius: 6, border: `1px solid ${ZD.border}`, background: ZD.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><SDI.Pencil s={13} c={ZD.mutedFg}/></button>
            </div>
            <div style={{ padding: '0 20px 20px' }}>
              <p style={{ margin: 0, fontSize: 13.5, color: ZD.foreground, lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>{"Двухзонный счётчик, льготного тарифа нет.\nВ октябре увеличился расход — возможно из-за обогревателя в ванной."}</p>
            </div>
          </DarkCard>

          {/* Quick actions */}
          <DarkCard style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 20px' }}>
            <span style={{ fontSize: 13, color: ZD.mutedFg, marginRight: 8 }}>Quick actions</span>
            <button style={{ height: 36, padding: '0 14px', fontSize: 13.5, fontWeight: 500, background: AV.solid, color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 5 }}><SDI.Gauge s={14} c="#fff"/> Submit reading</button>
            {['Add bill','Record payment'].map(l => (
              <button key={l} style={{ height: 36, padding: '0 12px', fontSize: 13.5, fontWeight: 500, background: ZD.card, color: ZD.foreground, border: `1px solid ${ZD.border}`, borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit' }}>{l}</button>
            ))}
          </DarkCard>
        </div>
      </div>
    </div>
  );
}

function DarkCard({ children, style }) {
  return (
    <div style={{
      background: ZD.card, border: `1px solid ${ZD.border}`,
      borderRadius: 8, ...style,
    }}>{children}</div>
  );
}

window.ServiceDetail = ServiceDetail;
window.ServiceDetailDark = ServiceDetailDark;
window.SDI = SDI;
window.SCard = SCard;
window.CardHeader = CardHeader;
window.OutlineBtn = OutlineBtn;
window.PrimaryBtn = PrimaryBtn;
window.GhostBtn = GhostBtn;
window.KVGrid = KVGrid;
