/* global React */
// Service detail — Electricity (MOBILE)
// 390px viewport. Matches the project's established mobile language
// (see bills-mobile.jsx): flat frame, compact app top bar, Zinc/Violet
// shadcn cards. Reuses window.UB tokens + window.SDI/SCard primitives and
// the SAME tabbed structure as the desktop page (underline tabs, DS style).

const { useState: useStSM } = React;
const { Z, ACCENTS, SERVICE_COLORS } = window.UB;
const { SDI } = window;
const AVSM = ACCENTS.violet;

const smShadow = '0 1px 2px rgba(24,24,27,0.05)';

// ── Card ──────────────────────────────────────────────────────
function SMCard({ children, style }) {
  return (
    <div style={{
      background: Z.card, border: `1px solid ${Z.border}`,
      borderRadius: 8, boxShadow: smShadow, ...style,
    }}>{children}</div>
  );
}
function SMCardHeader({ title, sub, action }) {
  return (
    <div style={{ padding: '14px 16px', borderBottom: `1px solid ${Z.border}` }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: Z.foreground, letterSpacing: -0.1 }}>{title}</div>
        {sub && <div style={{ fontSize: 12.5, color: Z.mutedFg, marginTop: 2 }}>{sub}</div>}
      </div>
      {action && <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', marginTop: 12 }}>{action}</div>}
    </div>
  );
}
const smOverline = { fontSize: 11.5, fontWeight: 500, color: Z.mutedFg, textTransform: 'uppercase', letterSpacing: 0.3 };

// ── Buttons (DS sizes, mobile can go full-width) ──────────────
function SMOutline({ children, full, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5,
      flex: full ? 1 : undefined, height: 32, padding: '0 12px', whiteSpace: 'nowrap', flexShrink: 0,
      fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
      background: Z.background, color: Z.foreground,
      border: `1px solid ${Z.border}`, borderRadius: 6, cursor: 'pointer',
    }}>{children}</button>
  );
}
function SMPrimary({ children, full, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5,
      flex: full ? 1 : undefined, height: 32, padding: '0 14px', whiteSpace: 'nowrap', flexShrink: 0,
      fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
      background: AVSM.solid, color: '#fff', border: 'none',
      borderRadius: 6, cursor: 'pointer',
    }}>{children}</button>
  );
}
function SMGhost({ children, full, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5,
      flex: full ? 1 : undefined, height: 32, padding: '0 10px', whiteSpace: 'nowrap', flexShrink: 0,
      fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
      background: 'transparent', color: Z.mutedFg,
      border: 'none', borderRadius: 6, cursor: 'pointer',
    }}>{children}</button>
  );
}

// ── KV (single column for mobile) ─────────────────────────────
function SMKV({ pairs }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {pairs.map(([k, v], i) => (
        <div key={i} style={{
          padding: '11px 0',
          borderBottom: i === pairs.length - 1 ? 'none' : `1px solid ${Z.border}`,
        }}>
          <div style={{ ...smOverline, marginBottom: 3 }}>{k}</div>
          <div style={{ fontSize: 13.5, color: Z.foreground, lineHeight: 1.4 }}>{v}</div>
        </div>
      ))}
    </div>
  );
}

// ════════════════════ Overview ════════════════════
const SM_ACTIVITY = [
  { type:'bill',    period:'Oct 2025', amount: 1240.50, note:'Higher than usual — check readings' },
  { type:'payment', period:'Sep 2025', amount:  980.00, note:'Paid Sep 28' },
  { type:'bill',    period:'Sep 2025', amount:  980.00 },
  { type:'payment', period:'Aug 2025', amount:  840.00, note:'Paid Sep 1' },
  { type:'bill',    period:'Aug 2025', amount:  840.00 },
];

function SMActivityRow({ item, isLast }) {
  const isBill = item.type === 'bill';
  const color = isBill ? Z.destructive : Z.success;
  const Ic = isBill ? SDI.Receipt : SDI.Wallet;
  const icColor = isBill ? '#ef4444' : '#16a34a';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
      borderBottom: isLast ? 'none' : `1px solid ${Z.border}`,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: icColor + '15',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Ic s={15} c={icColor}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 500, color: Z.foreground }}>
          {item.period} {isBill ? 'bill' : 'payment'}
        </div>
        {item.note && <div style={{ fontSize: 12, color: Z.mutedFg, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.note}</div>}
      </div>
      <div style={{ fontSize: 13.5, fontWeight: 600, color, fontFeatureSettings: '"tnum" 1', whiteSpace: 'nowrap', flexShrink: 0 }}>
        {isBill ? '−' : '+'}{item.amount.toLocaleString('uk-UA', { minimumFractionDigits: 2 })} ₴
      </div>
    </div>
  );
}

function SMOverview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Balance */}
      <SMCard>
        <div style={{ padding: '18px 16px 16px' }}>
          <div style={{ ...smOverline, marginBottom: 10 }}>Current balance</div>
          <div style={{
            fontSize: 36, fontWeight: 700, color: Z.destructive,
            letterSpacing: -1, fontFeatureSettings: '"tnum" 1', lineHeight: 1,
          }}>
            −1,240.50 <span style={{ fontSize: 19, fontWeight: 500 }}>₴</span>
          </div>
          <div style={{ fontSize: 13, color: Z.mutedFg, marginTop: 8 }}>
            You owe <strong style={{ color: Z.destructive, fontWeight: 600 }}>1,240.50 ₴</strong> for this service
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <SMOutline full><SDI.Receipt s={13} c={Z.foreground}/> View all bills</SMOutline>
            <SMOutline full><SDI.Wallet s={13} c={Z.foreground}/> View all payments</SMOutline>
          </div>
        </div>
      </SMCard>

      {/* Notes */}
      <SMCard>
        <SMCardHeader title="Notes"/>
        <p style={{ margin: 0, padding: '14px 16px 16px', fontSize: 13, color: Z.foreground, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
          {"Двухзонный счётчик, льготного тарифа нет.\nВ октябре увеличился расход — возможно из-за обогревателя в ванной."}
        </p>
      </SMCard>

      {/* Activity */}
      <SMCard>
        <SMCardHeader title="Recent activity"/>
        {SM_ACTIVITY.map((item, i) => (
          <SMActivityRow key={i} item={item} isLast={i === SM_ACTIVITY.length - 1}/>
        ))}
      </SMCard>
    </div>
  );
}

// ════════════════════ Contract ════════════════════
function SMContract() {
  return (
    <SMCard>
      <SMCardHeader title="Current contract" sub="The active supply agreement and tariff."
        action={<><SMPrimary><SDI.Pencil s={13} c="#fff"/> Update contract</SMPrimary><SMGhost>View history</SMGhost></>}/>
      <div style={{ padding: '4px 16px 16px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <SMKV pairs={[
          ['Provider', 'ДТЭК Київські електромережі'],
          ['In effect since', 'March 1, 2024'],
          ['Account number', '123456789'],
          ['Tariff type', 'Two-zone (T1 / T2)'],
        ]}/>

        <div>
          <div style={{ ...smOverline, marginBottom: 10 }}>Tariff rates</div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { label: 'Day (T1)', rate: '4.32', color: SERVICE_COLORS.electricity },
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
          <div style={{ ...smOverline, marginBottom: 8 }}>Payment details</div>
          <div style={{
            padding: '10px 12px', borderRadius: 6, background: Z.muted, border: `1px solid ${Z.border}`,
            fontSize: 12, color: Z.foreground, lineHeight: 1.7,
            fontFamily: 'ui-monospace, "Cascadia Code", "Fira Code", monospace', wordBreak: 'break-word',
          }}>
            IBAN UA20 3052 9900 0002 6007 0123 4567 8<br/>
            Recipient: ДТЭК Київські електромережі<br/>
            EDRPOU: 12345678
          </div>
        </div>
      </div>
    </SMCard>
  );
}

// ════════════════════ Meter ════════════════════
function SMMeter() {
  return (
    <SMCard>
      <SMCardHeader title="Meter" sub="Device on record and its most recent reading."
        action={<><SMPrimary><SDI.Gauge s={13} c="#fff"/> Submit reading</SMPrimary><SMGhost>View meter details</SMGhost></>}/>
      <div style={{ padding: '4px 16px 16px' }}>
        <SMKV pairs={[
          ['Serial number', 'NIK2303-11-456789'],
          ['Type', 'Two-zone (T1 day / T2 night)'],
          ['Installed', 'January 15, 2023'],
          ['Last reading', 'October 22, 2025'],
        ]}/>
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'T1 — Day', value: '8,432', color: SERVICE_COLORS.electricity },
            { label: 'T2 — Night', value: '3,210', color: '#6366f1' },
          ].map(r => (
            <div key={r.label} style={{
              padding: '12px 14px', borderRadius: 8,
              background: r.color + '0F', border: `1px solid ${r.color}25`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: 13, color: Z.mutedFg }}>{r.label}</span>
              <span style={{ fontSize: 17, fontWeight: 700, color: Z.foreground, fontFeatureSettings: '"tnum" 1' }}>
                {r.value} <span style={{ fontSize: 11, fontWeight: 500, color: Z.mutedFg }}>kWh</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </SMCard>
  );
}

// ════════════════════ Reminders ════════════════════
const SMBell = (p) => <svg width={p.s||16} height={p.s||16} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/></svg>;
const SMTrash = (p) => <svg width={p.s||16} height={p.s||16} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M10 11v6M14 11v6"/></svg>;

// Row icon button — mirrors reminders.jsx RowIconBtn (30×30, border, r6)
function SMRowIconBtn({ children }) {
  return (
    <button style={{
      width: 30, height: 30, borderRadius: 6, border: `1px solid ${Z.border}`,
      background: Z.background, display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', flexShrink: 0,
    }}>{children}</button>
  );
}

const SM_REMINDERS = [
  { anchor: 'On the 5th', text: 'Submit the meter reading and pay the bill.' },
  { anchor: 'On the 20th', text: 'Pay the electricity bill before the late fee kicks in.' },
  { anchor: 'On the last day', text: 'Take an end-of-month photo of the meter.' },
  { anchor: '3 days before month end', text: 'Top up the balance if it’s running low.' },
];

function SMReminders() {
  return (
    <SMCard>
      <SMCardHeader title="Reminders" sub="Repeat every month · via Telegram."
        action={<SMPrimary><SDI.Plus s={13} c="#fff"/> Add reminder</SMPrimary>}/>
      {SM_REMINDERS.map((r, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px',
          borderBottom: i === SM_REMINDERS.length - 1 ? 'none' : `1px solid ${Z.border}`,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            background: AVSM.tintBg, border: `1px solid ${AVSM.tintBorder}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <SMBell s={15} c={AVSM.solid}/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: Z.foreground, letterSpacing: -0.1 }}>{r.anchor}</div>
            <div style={{ fontSize: 12.5, color: Z.mutedFg, marginTop: 1, lineHeight: 1.4 }}>{r.text}</div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <SMRowIconBtn><SDI.Pencil s={13} c={Z.mutedFg}/></SMRowIconBtn>
            <SMRowIconBtn><SMTrash s={13} c={Z.mutedFg}/></SMRowIconBtn>
          </div>
        </div>
      ))}
    </SMCard>
  );
}

// ── Mobile top bar (matches bills-mobile.jsx) ─────────────────
function SMTopbar() {
  return (
    <div style={{
      height: 52, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)',
      borderBottom: `1px solid ${Z.border}`, display: 'flex', alignItems: 'center',
      padding: '0 16px', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 22, height: 22, borderRadius: 5, background: AVSM.solid,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/>
            <rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>
          </svg>
        </div>
        <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: -0.1, color: Z.foreground }}>UtilityBills</span>
      </div>
      <button style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={Z.foreground} strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
    </div>
  );
}

// ── Underline tab bar (desktop DS style + icons, scaled for mobile) ───
// Icons mirror the desktop tab bar (service-detail-tabs.jsx TABICONS).
const SM_TABICONS = {
  overview:  (p) => <svg width={p.s||14} height={p.s||14} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>,
  contract:  (p) => <svg width={p.s||14} height={p.s||14} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z"/><path d="M16 8H8M16 12H8M12 16H8"/></svg>,
  meter:     (p) => <svg width={p.s||14} height={p.s||14} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>,
  reminders: (p) => <svg width={p.s||14} height={p.s||14} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/></svg>,
};
const SM_TABS = [
  { id: 'overview', label: 'Overview', icon: SM_TABICONS.overview },
  { id: 'contract', label: 'Contract', icon: SM_TABICONS.contract },
  { id: 'meter', label: 'Meter', icon: SM_TABICONS.meter },
  { id: 'reminders', label: 'Reminders', icon: SM_TABICONS.reminders },
];

function SMTabBar({ tab, setTab }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      borderBottom: `1px solid ${Z.border}`, marginBottom: 16,
      overflowX: 'hidden',
    }}>
      {SM_TABS.map(t => {
        const active = t.id === tab;
        const Ic = t.icon;
        return (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 4,
            height: 38, padding: '0 2px', flexShrink: 0,
            background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            fontSize: 13.5, fontWeight: active ? 600 : 500,
            color: active ? Z.foreground : Z.mutedFg,
          }}>
            <Ic s={14} c={active ? AVSM.solid : Z.mutedFg}/>
            {t.label}
            {active && <span style={{
              position: 'absolute', left: 0, right: 0, bottom: -1, height: 2,
              borderRadius: 2, background: AVSM.solid,
            }}/>}
          </button>
        );
      })}
    </div>
  );
}

// ── Main mobile page ──────────────────────────────────────────
function ServiceDetailMobile({ initialTab = 'overview' }) {
  const [tab, setTab] = useStSM(initialTab);
  return (
    <div style={{
      minHeight: '100%', background: Z.subtle, color: Z.foreground,
      fontFamily: "'Inter', system-ui, sans-serif", WebkitFontSmoothing: 'antialiased',
    }}>
      <SMTopbar/>

      <div style={{ padding: '16px 14px 32px' }}>
        {/* Breadcrumb / back */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12.5, color: Z.mutedFg, marginBottom: 12 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={Z.mutedFg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          <a href="#" style={{ color: Z.mutedFg, textDecoration: 'none' }}>Home apartment</a>
        </div>

        {/* Page header — identity on top, actions below (column on mobile) */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 9, flexShrink: 0,
              background: SERVICE_COLORS.electricity + '18', border: `1px solid ${SERVICE_COLORS.electricity}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <SDI.Zap s={20} c={SERVICE_COLORS.electricity}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: -0.5, color: Z.foreground }}>Electricity</h1>
              <div style={{ fontSize: 12.5, color: Z.mutedFg, marginTop: 3, lineHeight: 1.45 }}>ДТЭК Київські електромережі · Home apartment</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8, marginTop: 12 }}>
            <SMOutline><SDI.Pencil s={13} c={Z.foreground}/> Edit notes</SMOutline>
            <button style={{
              width: 32, height: 32, borderRadius: 6, border: `1px solid ${Z.border}`, background: Z.background,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
            }}><SDI.MoreH s={15} c={Z.foreground}/></button>
          </div>
        </div>

        {/* Tabs */}
        <SMTabBar tab={tab} setTab={setTab}/>

        {/* Content */}
        {tab === 'overview'  && <SMOverview/>}
        {tab === 'contract'  && <SMContract/>}
        {tab === 'meter'     && <SMMeter/>}
        {tab === 'reminders' && <SMReminders/>}
      </div>
    </div>
  );
}

window.ServiceDetailMobile = ServiceDetailMobile;
