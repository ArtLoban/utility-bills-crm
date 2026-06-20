/* global React */
// Service detail — Electricity (TABBED variant)
// Alternative to the long stacked page: each section + its actions live in a tab.
// Reuses window.UB primitives, window.SDI icons, window.SCard / buttons / KVGrid,
// and window.RemindersCard (reminders.jsx). Light desktop only.

const { useState: useStTab } = React;
const { Z, SERVICE_COLORS, ACCENTS, TopBar } = window.UB;
const { SDI, SCard, OutlineBtn, PrimaryBtn, GhostBtn, KVGrid } = window;
const AVT = ACCENTS.violet;

const cardShadowT = '0 1px 2px rgba(24,24,27,0.05)';

// ── Card header (title + actions) ─────────────────────────────
function TabCardHeader({ title, sub, action }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      padding: '16px 20px', borderBottom: `1px solid ${Z.border}`, gap: 12,
    }}>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: Z.foreground, letterSpacing: -0.1 }}>
          {title}
        </div>
        {sub && <div style={{ fontSize: 12.5, color: Z.mutedFg, marginTop: 2 }}>{sub}</div>}
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// TAB 1 — OVERVIEW (balance + recent activity)
// ════════════════════════════════════════════════════════════
function BalanceCardT() {
  return (
    <SCard>
      <div style={{ padding: '22px 24px 20px' }}>
        <div style={{ fontSize: 11.5, fontWeight: 500, color: Z.mutedFg, textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 12 }}>
          Current balance
        </div>
        <div style={{
          fontSize: 40, fontWeight: 700, color: Z.destructive,
          letterSpacing: -1.2, fontFeatureSettings: '"tnum" 1', lineHeight: 1,
        }}>
          −1,240.50 <span style={{ fontSize: 21, fontWeight: 500 }}>₴</span>
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

const ACTIVITY_T = [
  { type:'bill',    period:'Oct 2025', amount: 1240.50, note:'Higher than usual — check readings' },
  { type:'payment', period:'Sep 2025', amount:  980.00, note:'Paid Sep 28' },
  { type:'bill',    period:'Sep 2025', amount:  980.00 },
  { type:'payment', period:'Aug 2025', amount:  840.00, note:'Paid Sep 1' },
  { type:'bill',    period:'Aug 2025', amount:  840.00 },
  { type:'payment', period:'Jul 2025', amount:  720.00, note:'Paid Aug 3' },
];

function ActivityRowT({ item, isLast }) {
  const isBill = item.type === 'bill';
  const color  = isBill ? Z.destructive : Z.success;
  const Ic     = isBill ? SDI.Receipt : SDI.Wallet;
  const icColor= isBill ? '#ef4444' : '#16a34a';
  const [hover, setHover] = useStTab(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14, padding: '13px 20px',
        borderBottom: isLast ? 'none' : `1px solid ${Z.border}`,
        background: hover ? Z.subtle : 'transparent',
        transition: 'background 120ms', cursor: 'pointer',
      }}
    >
      <div style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: icColor + '15',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Ic s={15} c={icColor}/>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13.5, fontWeight: 500, color: Z.foreground }}>
          {item.period} {isBill ? 'bill' : 'payment'}
        </div>
        {item.note && <div style={{ fontSize: 12, color: Z.mutedFg, marginTop: 2 }}>{item.note}</div>}
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color, fontFeatureSettings: '"tnum" 1' }}>
        {isBill ? '−' : '+'}{item.amount.toLocaleString('uk-UA', { minimumFractionDigits: 2 })} ₴
      </div>
      <SDI.ChevR s={14} c={hover ? AVT.solid : Z.border}/>
    </div>
  );
}

function ActivityCardT() {
  return (
    <SCard>
      <TabCardHeader title="Recent activity"/>
      <div>
        {ACTIVITY_T.map((item, i) => (
          <ActivityRowT key={i} item={item} isLast={i === ACTIVITY_T.length - 1}/>
        ))}
      </div>
    </SCard>
  );
}

function OverviewTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: 16, alignItems: 'stretch' }}>
        <BalanceCardT/>
        <NotesCardT/>
      </div>
      <ActivityCardT/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// TAB 2 — CONTRACT
// ════════════════════════════════════════════════════════════
function ContractTab({ onUpdate, onHistory }) {
  return (
    <SCard>
      <TabCardHeader
        title="Current contract"
        sub="The active supply agreement and tariff for this service."
        action={
          <div style={{ display: 'flex', gap: 6 }}>
            <PrimaryBtn onClick={onUpdate}>Update contract</PrimaryBtn>
            <GhostBtn onClick={onHistory}>View history</GhostBtn>
          </div>
        }
      />
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <KVGrid pairs={[
          ['Provider',        'ДТЭК Київські електромережі'],
          ['In effect since', 'March 1, 2024'],
          ['Account number',  '123456789'],
          ['Tariff type',     'Two-zone (T1 / T2)'],
        ]}/>
        <div>
          <div style={{ fontSize: 11.5, fontWeight: 500, color: Z.mutedFg, textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 10 }}>
            Tariff rates
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { label: 'Day (T1)',   rate: '4.32', color: SERVICE_COLORS.electricity },
              { label: 'Night (T2)', rate: '2.16', color: '#6366f1' },
            ].map(t => (
              <div key={t.label} style={{
                flex: 1, padding: '12px 14px', borderRadius: 8,
                background: t.color + '0F', border: `1px solid ${t.color}25`,
              }}>
                <div style={{ fontSize: 11.5, color: Z.mutedFg, marginBottom: 4 }}>{t.label}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: Z.foreground, letterSpacing: -0.4, fontFeatureSettings: '"tnum" 1' }}>
                  {t.rate} <span style={{ fontSize: 12, fontWeight: 500, color: Z.mutedFg }}>₴/kWh</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11.5, fontWeight: 500, color: Z.mutedFg, textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 8 }}>
            Payment details
          </div>
          <div style={{
            padding: '10px 12px', borderRadius: 6, background: Z.muted, border: `1px solid ${Z.border}`,
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

// ════════════════════════════════════════════════════════════
// TAB 3 — METER
// ════════════════════════════════════════════════════════════
function MeterTab({ onSubmit }) {
  return (
    <SCard>
      <TabCardHeader
        title="Meter"
        sub="Device on record and its most recent reading."
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
        <div style={{ marginTop: 18, display: 'flex', gap: 10 }}>
          {[
            { label: 'T1 — Day',   value: '8,432', color: SERVICE_COLORS.electricity },
            { label: 'T2 — Night', value: '3,210', color: '#6366f1' },
          ].map(r => (
            <div key={r.label} style={{
              flex: 1, padding: '10px 14px', borderRadius: 8,
              background: r.color + '0F', border: `1px solid ${r.color}25`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: 12.5, color: Z.mutedFg }}>{r.label}</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: Z.foreground, fontFeatureSettings: '"tnum" 1' }}>
                {r.value} <span style={{ fontSize: 11, fontWeight: 500, color: Z.mutedFg }}>kWh</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </SCard>
  );
}

// ════════════════════════════════════════════════════════════
// NOTES card (sits beside Current balance on the Overview tab)
// Edit affordance lives in the page header, so no action here.
// ════════════════════════════════════════════════════════════
function NotesCardT() {
  return (
    <SCard style={{ height: '100%' }}>
      <TabCardHeader title="Notes"/>
      <div style={{ padding: '18px 20px 20px' }}>
        <p style={{ margin: 0, fontSize: 13.5, color: Z.foreground, lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>
          {"Двухзонный счётчик, льготного тарифа нет.\nВ октябре увеличился расход — возможно из-за обогревателя в ванной."}
        </p>
      </div>
    </SCard>
  );
}

// ── Tab bar ───────────────────────────────────────────────────
// Lucide-style tab icons (stroke 1.75, per DS).
const TABICONS = {
  overview:  (p) => <svg width={p.s||15} height={p.s||15} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>,
  contract:  (p) => <svg width={p.s||15} height={p.s||15} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z"/><path d="M16 8H8M16 12H8M12 16H8"/></svg>,
  meter:     (p) => <svg width={p.s||15} height={p.s||15} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>,
  reminders: (p) => <svg width={p.s||15} height={p.s||15} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/></svg>,
};

function TabButton({ label, icon: Ic, count, active, onClick }) {
  const [h, setH] = useStTab(false);
  const labelColor = active ? Z.foreground : (h ? Z.foreground : Z.mutedFg);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 7,
        padding: '0 4px', height: 40, marginRight: 22,
        background: 'transparent', border: 'none', cursor: 'pointer',
        fontFamily: 'inherit', fontSize: 13.5,
        fontWeight: active ? 600 : 500,
        color: labelColor,
        transition: 'color 120ms',
      }}
    >
      {Ic && <Ic s={15} c={active ? AVT.solid : labelColor}/>}
      {label}
      {count != null && (
        <span style={{
          minWidth: 18, height: 18, padding: '0 5px', borderRadius: 9,
          fontSize: 11, fontWeight: 600, fontFeatureSettings: '"tnum" 1',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: active ? AVT.tintBg : Z.muted,
          color: active ? AVT.solid : Z.mutedFg,
          border: `1px solid ${active ? AVT.tintBorder : Z.border}`,
        }}>{count}</span>
      )}
      {active && (
        <span style={{
          position: 'absolute', left: 0, right: 0, bottom: -1, height: 2,
          borderRadius: 2, background: AVT.solid,
        }}/>
      )}
    </button>
  );
}

// ── Main page ─────────────────────────────────────────────────
function ServiceDetailTabs({ initialTab = 'overview', onUpdateContract, onViewHistory }) {
  const [tab, setTab] = useStTab(initialTab);

  const tabs = [
    { id: 'overview',  label: 'Overview',  icon: TABICONS.overview },
    { id: 'contract',  label: 'Contract',  icon: TABICONS.contract },
    { id: 'meter',     label: 'Meter',     icon: TABICONS.meter },
    { id: 'reminders', label: 'Reminders', icon: TABICONS.reminders },
  ];

  return (
    <div style={{
      fontFamily: "'Inter', system-ui, sans-serif", WebkitFontSmoothing: 'antialiased',
      background: Z.background, color: Z.foreground, minHeight: '100%',
    }}>
      <TopBar accent={AVT} activeNav="Properties"/>
      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '28px 32px 56px' }}>
        {/* Breadcrumbs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: Z.mutedFg, marginBottom: 10 }}>
          {['Home', 'Home apartment', 'Electricity'].map((b, i) => (
            <React.Fragment key={b}>
              {i > 0 && <SDI.ChevSlash/>}
              {i < 2
                ? <a href="#" style={{ color: Z.mutedFg, textDecoration: 'none' }}>{b}</a>
                : <span style={{ color: Z.foreground }}>{b}</span>}
            </React.Fragment>
          ))}
        </div>

        {/* Page header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22 }}>
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
              <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: -0.6, color: Z.foreground }}>
                Electricity
              </h1>
              <div style={{ fontSize: 13.5, color: Z.mutedFg, marginTop: 4 }}>
                ДТЭК Київські електромережі · Home apartment
              </div>
            </div>
          </div>
          {/* Header actions — Edit notes + overflow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <OutlineBtn><SDI.Pencil s={13} c={Z.foreground}/> Edit notes</OutlineBtn>
            <button style={{
              width: 32, height: 32, borderRadius: 6, border: `1px solid ${Z.border}`,
              background: Z.background, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}><SDI.MoreH s={15} c={Z.foreground}/></button>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', alignItems: 'center', borderBottom: `1px solid ${Z.border}`, marginBottom: 24 }}>
          {tabs.map(t => (
            <TabButton key={t.id} label={t.label} icon={t.icon} count={t.count}
              active={tab === t.id} onClick={() => setTab(t.id)}/>
          ))}
        </div>

        {/* Tab content */}
        <div>
          {tab === 'overview'  && <OverviewTab/>}
          {tab === 'contract'  && <ContractTab onUpdate={onUpdateContract} onHistory={onViewHistory}/>}
          {tab === 'meter'     && <MeterTab onSubmit={() => {}}/>}
          {tab === 'reminders' && (window.RemindersCard ? <window.RemindersCard variant="list"/> : null)}
        </div>
      </div>
    </div>
  );
}

window.ServiceDetailTabs = ServiceDetailTabs;
