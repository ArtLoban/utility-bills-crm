// Shared parts for the elevated landing canvas.
// Icons, the redrawn DARK-MODE app mockups (top-bar nav, ₴ currency,
// service-colored charts), and the glowing browser frame.
// Exports everything to window for the page files to consume.

const { useState } = React;

// ── Icon primitive ──────────────────────────────────────────────────────
function Ico({ size = 20, sw = 1.75, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}
const IcoUsers   = ({ size }) => <Ico size={size}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></Ico>;
const IcoHistory = ({ size }) => <Ico size={size}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></Ico>;
const IcoWallet  = ({ size }) => <Ico size={size}><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></Ico>;
const IcoTrend   = ({ size }) => <Ico size={size}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></Ico>;
const IcoSun     = ({ size }) => <Ico size={size}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></Ico>;
const IcoMoon    = ({ size }) => <Ico size={size}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></Ico>;
const IcoMenu    = ({ size }) => <Ico size={size}><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></Ico>;
const IcoArrow   = ({ size = 14 }) => <Ico size={size} sw={2}><path d="M5 12h14M12 5l7 7-7 7"/></Ico>;
// service icons (for feature cards)
const IcoZap     = ({ size }) => <Ico size={size}><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></Ico>;

// ── App dark-mode theme tokens (what the mockups render) ──────────────────
const AZ = {
  bg: '#09090b', card: '#18181b', cardAlt: '#141417', border: '#27272a',
  muted: '#1f1f23', mutedFg: '#71717a', fg: '#fafafa', fgSub: '#a1a1aa',
  accent: '#7c3aed', accentLight: '#a78bfa',
};
// service palette used in landing context
const SVC = { electricity: '#8b5cf6', gas: '#f59e0b', water: '#14b8a6', internet: '#3b82f6' };

// ── App top bar (shared by both mockups) ──────────────────────────────────
function AppTopBar({ active }) {
  const nav = ['Dashboard', 'Properties', 'Meters', 'Bills', 'Payments', 'Settings'];
  return (
    <div style={{ height: 52, borderBottom: `1px solid ${AZ.border}`, display: 'flex', alignItems: 'center', padding: '0 22px', gap: 26, background: AZ.bg }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <div style={{ width: 22, height: 22, background: AZ.accent, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#fff">
            <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>
          </svg>
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: AZ.fg, letterSpacing: '-0.2px', whiteSpace: 'nowrap' }}>Utility Bills CRM</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {nav.map((l) => {
          const on = l === active;
          return (
            <span key={l} style={{ fontSize: 12.5, color: on ? AZ.fg : AZ.mutedFg, fontWeight: on ? 600 : 400, padding: '5px 10px', borderRadius: 6, background: on ? AZ.muted : 'transparent' }}>{l}</span>
          );
        })}
      </div>
      <div style={{ flex: 1 }}></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 10px', border: `1px solid ${AZ.border}`, borderRadius: 7, background: AZ.card }}>
          <span style={{ fontSize: 12, color: AZ.fgSub }}>Apartment · Kyiv</span>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={AZ.mutedFg} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </div>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#3b2a63', border: `1px solid ${AZ.accent}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: AZ.accentLight }}>A</div>
      </div>
    </div>
  );
}

// ── Dashboard mockup (dark app UI) ────────────────────────────────────────
function DarkDashboardMockup() {
  const bars = [54, 41, 63, 49, 72, 58, 68, 80];
  const months = ['Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr'];
  const stats = [
    ['Total balance', '−₴4,820', 'across 3 properties', '#f87171'],
    ['Billed this month', '₴3,180', '11 services', AZ.fg],
    ['Paid this month', '₴2,640', '6 payments', AZ.fg],
    ['Properties', '3', 'all active', AZ.fg],
  ];
  const legend = [['Electricity', SVC.electricity, '42%'], ['Gas', SVC.gas, '26%'], ['Water', SVC.water, '18%'], ['Internet', SVC.internet, '14%']];
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: AZ.bg, userSelect: 'none' }}>
      <AppTopBar active="Dashboard" />
      <div style={{ padding: '24px 28px' }}>
        {/* header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 600, color: AZ.fg, letterSpacing: '-0.6px' }}>Hi, Anna</div>
            <div style={{ fontSize: 12.5, color: AZ.mutedFg, marginTop: 3 }}>Here's where every property stands this month.</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 11px', border: `1px solid ${AZ.border}`, borderRadius: 7, background: AZ.card }}>
            <span style={{ fontSize: 11.5, color: AZ.mutedFg }}>Period:</span>
            <span style={{ fontSize: 11.5, color: AZ.fgSub }}>Last 12 months</span>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={AZ.mutedFg} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>
        {/* stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 16 }}>
          {stats.map(([l, v, s, c]) => (
            <div key={l} style={{ background: AZ.card, border: `1px solid ${AZ.border}`, borderRadius: 9, padding: '14px 16px' }}>
              <div style={{ fontSize: 11, color: AZ.mutedFg, marginBottom: 8 }}>{l}</div>
              <div style={{ fontSize: 23, fontWeight: 600, color: c, lineHeight: 1, letterSpacing: '-0.6px', fontFeatureSettings: "'tnum' 1" }}>{v}</div>
              <div style={{ fontSize: 11, color: AZ.mutedFg, marginTop: 7 }}>{s}</div>
            </div>
          ))}
        </div>
        {/* charts row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          {/* pie */}
          <div style={{ background: AZ.card, border: `1px solid ${AZ.border}`, borderRadius: 9, padding: '16px 18px' }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: AZ.fg, marginBottom: 14, letterSpacing: '-0.1px' }}>Expenses by service</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
              <svg width={104} height={104} viewBox="0 0 104 104">
                {(() => {
                  const segs = [[SVC.electricity, 42], [SVC.gas, 26], [SVC.water, 18], [SVC.internet, 14]];
                  const C = 2 * Math.PI * 38; let off = 0;
                  return segs.map(([col, pct], i) => {
                    const len = (pct / 100) * C;
                    const el = <circle key={i} cx="52" cy="52" r="38" fill="none" stroke={col} strokeWidth="20"
                      strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-off} transform="rotate(-90 52 52)" />;
                    off += len; return el;
                  });
                })()}
                <circle cx="52" cy="52" r="26" fill={AZ.card}/>
                <text x="52" y="49" textAnchor="middle" fill={AZ.fg} fontSize="15" fontWeight="600" fontFamily="Inter">₴12.4k</text>
                <text x="52" y="62" textAnchor="middle" fill={AZ.mutedFg} fontSize="8.5" fontFamily="Inter">this year</text>
              </svg>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9, flex: 1 }}>
                {legend.map(([lbl, col, pct]) => (
                  <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 9, height: 9, borderRadius: 3, background: col, flexShrink: 0 }}></div>
                    <span style={{ fontSize: 11.5, color: AZ.fgSub, flex: 1 }}>{lbl}</span>
                    <span style={{ fontSize: 11.5, color: AZ.mutedFg, fontFeatureSettings: "'tnum' 1" }}>{pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* bar */}
          <div style={{ background: AZ.card, border: `1px solid ${AZ.border}`, borderRadius: 9, padding: '16px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: AZ.fg, letterSpacing: '-0.1px' }}>Monthly spend</div>
              <div style={{ display: 'flex', gap: 4 }}>
                <span style={{ fontSize: 10, color: '#fff', background: AZ.accent, padding: '3px 8px', borderRadius: 5, fontWeight: 500 }}>Expenses (₴)</span>
                <span style={{ fontSize: 10, color: AZ.mutedFg, padding: '3px 8px', borderRadius: 5 }}>Consumption</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 7, height: 76 }}>
              {bars.map((h, i) => (
                <div key={i} style={{ flex: 1, height: h, background: i === bars.length - 1 ? AZ.accent : '#34343a', borderRadius: '3px 3px 0 0' }}></div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 7, marginTop: 7 }}>
              {months.map((m, i) => <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 8.5, color: AZ.mutedFg }}>{m}</div>)}
            </div>
          </div>
        </div>
        {/* line chart */}
        <div style={{ background: AZ.card, border: `1px solid ${AZ.border}`, borderRadius: 9, padding: '16px 18px' }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: AZ.fg, marginBottom: 12, letterSpacing: '-0.1px' }}>Electricity consumption — kWh</div>
          <svg width="100%" height={86} viewBox="0 0 760 86" preserveAspectRatio="none">
            <defs>
              <linearGradient id="lu-lg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={SVC.electricity} stopOpacity="0.28"/>
                <stop offset="100%" stopColor={SVC.electricity} stopOpacity="0"/>
              </linearGradient>
            </defs>
            <polygon points="0,68 108,56 216,60 325,40 434,46 543,26 651,34 760,16 760,86 0,86" fill="url(#lu-lg)"/>
            <polyline points="0,68 108,56 216,60 325,40 434,46 543,26 651,34 760,16"
              fill="none" stroke={SVC.electricity} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round"/>
            {[0,108,216,325,434,543,651,760].map((x, i) => {
              const ys = [68,56,60,40,46,26,34,16];
              return <circle key={i} cx={x} cy={ys[i]} r="3" fill={AZ.bg} stroke={SVC.electricity} strokeWidth="2"/>;
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}

// ── Property detail mockup (dark app UI) ──────────────────────────────────
function DarkPropertyMockup() {
  const services = [
    { name: 'Electricity', provider: 'YASNO',        color: SVC.electricity, balance: '−₴1,180', due: 'Due in 3 days',  st: 'due' },
    { name: 'Gas',         provider: 'Naftogaz',      color: SVC.gas,         balance: '−₴640',   due: 'Due in 12 days', st: 'due' },
    { name: 'Cold water',  provider: 'Kyivvodokanal', color: SVC.water,       balance: '+₴90',    due: 'Overpaid',       st: 'ok' },
    { name: 'Internet',    provider: 'Kyivstar',      color: SVC.internet,    balance: '₴0',      due: 'Settled',        st: 'clear' },
  ];
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: AZ.bg, userSelect: 'none' }}>
      <AppTopBar active="Properties" />
      <div style={{ padding: '22px 28px' }}>
        {/* breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11.5, color: AZ.mutedFg, marginBottom: 14 }}>
          <span>Properties</span><span style={{ opacity: 0.5 }}>/</span><span style={{ color: AZ.fgSub, fontWeight: 500 }}>Apartment · Kyiv</span>
        </div>
        {/* page header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 600, color: AZ.fg, marginBottom: 5, letterSpacing: '-0.6px' }}>Apartment · Kyiv</div>
            <div style={{ fontSize: 12, color: AZ.mutedFg }}>Shevchenko St 14, Kyiv · <span style={{ color: AZ.accentLight }}>Owner</span></div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ padding: '7px 13px', background: AZ.card, border: `1px solid ${AZ.border}`, borderRadius: 7, fontSize: 12, color: AZ.fg, fontWeight: 500 }}>Share</div>
            <div style={{ padding: '7px 13px', background: AZ.accent, borderRadius: 7, fontSize: 12, color: '#fff', fontWeight: 500, boxShadow: '0 1px 3px rgba(124,58,237,0.4)' }}>+ Add service</div>
          </div>
        </div>
        {/* tabs */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${AZ.border}`, marginBottom: 18 }}>
          {['Overview', 'Meters', 'Sharing'].map((t, i) => (
            <div key={t} style={{
              fontSize: 12.5, fontWeight: i === 0 ? 600 : 400,
              color: i === 0 ? AZ.fg : AZ.mutedFg,
              padding: '9px 16px',
              borderBottom: i === 0 ? `2px solid ${AZ.accent}` : '2px solid transparent',
              marginBottom: -1,
            }}>{t}</div>
          ))}
        </div>
        {/* services */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {services.map(({ name, provider, color, balance, due, st }) => (
            <div key={name} style={{ background: AZ.card, border: `1px solid ${AZ.border}`, borderRadius: 9, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: color + '24', border: `1px solid ${color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color }}>
                <div style={{ width: 13, height: 13, borderRadius: 4, background: color }}></div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: AZ.fg, letterSpacing: '-0.1px' }}>{name}</div>
                <div style={{ fontSize: 11, color: AZ.mutedFg, marginTop: 2 }}>{provider}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: balance.startsWith('−') ? '#f87171' : balance.startsWith('+') ? '#4ade80' : AZ.fgSub, fontFeatureSettings: "'tnum' 1", letterSpacing: '-0.3px' }}>{balance}</div>
                  <div style={{ fontSize: 10.5, color: st === 'ok' ? '#4ade80' : AZ.mutedFg, marginTop: 2 }}>{due}</div>
                </div>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={AZ.mutedFg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Glowing browser frame ─────────────────────────────────────────────────
// `glow` adds a violet pool beneath the frame. Always renders dark app chrome.
function MockupFrame({ url, glowColor = 'rgba(124,58,237,0.32)', children }) {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* violet glow beneath */}
      <div style={{ position: 'absolute', left: '50%', bottom: -36, transform: 'translateX(-50%)', width: '78%', height: 150, background: `radial-gradient(ellipse at center, ${glowColor} 0%, transparent 70%)`, filter: 'blur(28px)', pointerEvents: 'none', zIndex: 0 }}></div>
      <div style={{ position: 'relative', zIndex: 1, borderRadius: 12, overflow: 'hidden', border: '1px solid #27272a', boxShadow: '0 24px 70px rgba(0,0,0,0.55), 0 6px 18px rgba(0,0,0,0.4)' }}>
        {/* browser chrome */}
        <div style={{ background: '#141417', borderBottom: '1px solid #27272a', padding: '0 14px', height: 38, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', gap: 7 }}>
            {['#3f3f46', '#3f3f46', '#3f3f46'].map((c, i) => <div key={i} style={{ width: 11, height: 11, borderRadius: '50%', background: c }}></div>)}
          </div>
          <div style={{ flex: 1, maxWidth: 380, margin: '0 auto', background: '#09090b', border: '1px solid #27272a', borderRadius: 7, height: 23, display: 'flex', alignItems: 'center', padding: '0 10px' }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="2" style={{ marginRight: 7, flexShrink: 0 }}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span style={{ fontSize: 10.5, color: '#52525b' }}>{url}</span>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

Object.assign(window, {
  Ico, IcoUsers, IcoHistory, IcoWallet, IcoTrend, IcoSun, IcoMoon, IcoMenu, IcoArrow, IcoZap,
  AZ, SVC, AppTopBar, DarkDashboardMockup, DarkPropertyMockup, MockupFrame,
});
