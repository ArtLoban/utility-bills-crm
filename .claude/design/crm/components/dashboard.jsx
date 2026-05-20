/* global React */
// Dashboard — shadcn/ui New York, Zinc base, Inter, Light mode, Full-data state.
// Accent is a prop so the same component can render in 3 artboards.

const { useState, useMemo } = React;

// ---------- Accent presets (shadcn-aligned hues) ----------
// Using oklch for the foreground/subtle tints so each accent feels consistent.
const ACCENTS = {
  indigo: {
    name: 'Indigo',
    // shadcn new-york indigo primary ~ oklch(0.585 0.233 277) -> hex approx
    solid: '#4f46e5',
    solidHover: '#4338ca',
    ring: 'rgba(79, 70, 229, 0.35)',
    tintBg: '#eef2ff',
    tintBorder: '#e0e7ff',
    foreground: '#ffffff',
    underline: '#4f46e5',
  },
  violet: {
    name: 'Violet',
    solid: '#7c3aed',
    solidHover: '#6d28d9',
    ring: 'rgba(124, 58, 237, 0.35)',
    tintBg: '#f5f3ff',
    tintBorder: '#ede9fe',
    foreground: '#ffffff',
    underline: '#7c3aed',
  },
  teal: {
    name: 'Teal',
    solid: '#0d9488',
    solidHover: '#0f766e',
    ring: 'rgba(13, 148, 136, 0.35)',
    tintBg: '#f0fdfa',
    tintBorder: '#ccfbf1',
    foreground: '#ffffff',
    underline: '#0d9488',
  },
};

// ---------- Zinc tokens (shadcn new-york, light) ----------
const Z = {
  background: '#ffffff',
  foreground: '#09090b',      // zinc-950
  card: '#ffffff',
  cardFg: '#09090b',
  muted: '#f4f4f5',           // zinc-100
  mutedFg: '#71717a',          // zinc-500
  border: '#e4e4e7',           // zinc-200
  input: '#e4e4e7',
  subtle: '#fafafa',           // zinc-50
  accentBg: '#f4f4f5',         // zinc-100 (for hover)
  destructive: '#dc2626',
  destructiveSoft: '#fef2f2',
  success: '#16a34a',
  warning: '#f59e0b',
  warningSoft: '#fffbeb',
  warningBorder: '#fde68a',
};

// Service color mapping — same across all three charts, muted to sit well next to any accent.
// Chosen for color-blind distinguishability and a "dataviz" feel, not rainbow.
const SERVICE_COLORS = {
  electricity: '#f59e0b', // amber
  gas:         '#ef4444', // red
  coldWater:   '#3b82f6', // blue
  hotWater:    '#ec4899', // pink
  heating:     '#8b5cf6', // violet (neutral within a violet accent it's fine — muted)
  internet:    '#14b8a6', // teal
};

// ---------- Icons (lucide-style inline SVG, stroke 1.75) ----------
const Icon = ({ d, size = 16, stroke = 'currentColor', fill = 'none', style, children }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24"
    fill={fill} stroke={stroke} strokeWidth={1.75}
    strokeLinecap="round" strokeLinejoin="round"
    style={style}
  >
    {d ? <path d={d} /> : children}
  </svg>
);

const Icons = {
  AlertTriangle: (p) => (
    <Icon size={p.size} stroke={p.stroke}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" /><path d="M12 17h.01" />
    </Icon>
  ),
  ChevronRight: (p) => <Icon d="m9 18 6-6-6-6" size={p.size} stroke={p.stroke} />,
  ChevronDown: (p) => <Icon d="m6 9 6 6 6-6" size={p.size} stroke={p.stroke} />,
  Home: (p) => (
    <Icon size={p.size} stroke={p.stroke}>
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </Icon>
  ),
  TreePine: (p) => (
    <Icon size={p.size} stroke={p.stroke}>
      <path d="m17 14 3 3.3a1 1 0 0 1-.7 1.7H4.7a1 1 0 0 1-.7-1.7L7 14h-.3a1 1 0 0 1-.7-1.7L9 9h-.2A1 1 0 0 1 8 7.3L12 3l4 4.3a1 1 0 0 1-.8 1.7H15l3 3.3a1 1 0 0 1-.7 1.7H17Z"/>
      <path d="M12 22v-3"/>
    </Icon>
  ),
  Globe: (p) => (
    <Icon size={p.size} stroke={p.stroke}>
      <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>
    </Icon>
  ),
  Moon: (p) => (
    <Icon d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" size={p.size} stroke={p.stroke} />
  ),
  Zap: (p) => <Icon d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" size={p.size} stroke={p.stroke}/>,
  Flame: (p) => (
    <Icon size={p.size} stroke={p.stroke}>
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
    </Icon>
  ),
  Droplets: (p) => (
    <Icon size={p.size} stroke={p.stroke}>
      <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/>
      <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/>
    </Icon>
  ),
  Wifi: (p) => (
    <Icon size={p.size} stroke={p.stroke}>
      <path d="M12 20h.01"/><path d="M2 8.82a15 15 0 0 1 20 0"/>
      <path d="M5 12.859a10 10 0 0 1 14 0"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/>
    </Icon>
  ),
  Thermometer: (p) => (
    <Icon size={p.size} stroke={p.stroke}>
      <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/>
    </Icon>
  ),
  LayoutDashboard: (p) => (
    <Icon size={p.size} stroke={p.stroke}>
      <rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/>
      <rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>
    </Icon>
  ),
};

const SERVICE_ICONS = {
  electricity: Icons.Zap,
  gas: Icons.Flame,
  coldWater: Icons.Droplets,
  hotWater: Icons.Droplets,
  heating: Icons.Thermometer,
  internet: Icons.Wifi,
};

// ---------- Mock data ----------
const MOCK = {
  user: { name: 'Anna', email: 'anna@example.com', initials: 'AL' },
  attention: {
    totalDebt: 1240,
    debtServices: 2,
    readingsDue: 3,
    dueDate: 'Oct 25',
  },
  balance: {
    debt: -1240,
    debtServices: 2,
    overpay: 350,
    overpayServices: 1,
    properties: [
      { id: 1, icon: 'Home',     name: 'Apartment on Main St', balance: -890 },
      { id: 2, icon: 'Home',     name: 'Mom\u2019s apartment',  balance: -350 },
      { id: 3, icon: 'TreePine', name: 'Summer house',          balance: 350 },
    ],
  },
  // Pie — expenses by service (UAH, last 12m)
  pie: [
    { key: 'electricity', label: 'Electricity', value: 8420 },
    { key: 'gas',         label: 'Gas',         value: 4230 },
    { key: 'heating',     label: 'Heating',     value: 6180 },
    { key: 'coldWater',   label: 'Cold water',  value: 1840 },
    { key: 'hotWater',    label: 'Hot water',   value: 2710 },
    { key: 'internet',    label: 'Internet',    value: 3000 },
  ],
  // Stacked bar — 12 months
  months: ['May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr'],
  // Per-service monthly UAH (realistic seasonality)
  monthly: {
    electricity: [640, 620, 680, 720, 700, 660, 720, 780, 820, 760, 700, 700],
    gas:         [120, 110, 100,  90, 180, 300, 520, 640, 680, 620, 480, 380],
    heating:     [  0,   0,   0,   0, 180, 520, 820, 980,1060, 920, 620, 220],
    coldWater:   [140, 150, 160, 160, 160, 150, 150, 150, 160, 150, 150, 150],
    hotWater:    [210, 210, 220, 220, 230, 230, 240, 240, 250, 240, 230, 220],
    internet:    [250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250],
  },
};

// ---------- Building blocks ----------
const fmtUAH = (n) => {
  const sign = n < 0 ? '-' : n > 0 ? '+' : '';
  const val = Math.abs(n).toLocaleString('en-US');
  return `${sign}${val} UAH`;
};

function Card({ children, style, className, interactive }) {
  const [hover, setHover] = useState(false);
  const baseShadow = '0 1px 2px 0 rgba(24, 24, 27, 0.05)';
  const hoverShadow = '0 4px 8px -2px rgba(24, 24, 27, 0.08), 0 2px 4px -2px rgba(24, 24, 27, 0.05)';
  return (
    <div
      className={className}
      onMouseEnter={interactive ? () => setHover(true) : undefined}
      onMouseLeave={interactive ? () => setHover(false) : undefined}
      style={{
        background: Z.card,
        border: `1px solid ${Z.border}`,
        borderRadius: 8,
        boxShadow: interactive && hover ? hoverShadow : baseShadow,
        transition: 'box-shadow 150ms ease',
        ...style,
      }}
    >{children}</div>
  );
}

function Button({ children, variant = 'default', size = 'sm', accent, onClick, style }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    height: size === 'sm' ? 32 : 36,
    padding: size === 'sm' ? '0 12px' : '0 16px',
    borderRadius: 6,
    fontSize: 13, fontWeight: 500,
    fontFamily: 'inherit',
    cursor: 'pointer',
    transition: 'background 120ms, border-color 120ms',
    whiteSpace: 'nowrap',
  };
  if (variant === 'default') {
    return <button onClick={onClick} style={{
      ...base,
      background: accent.solid, color: accent.foreground, border: `1px solid ${accent.solid}`,
      ...style,
    }}>{children}</button>;
  }
  if (variant === 'outline') {
    return <button onClick={onClick} style={{
      ...base,
      background: Z.background, color: Z.foreground, border: `1px solid ${Z.border}`,
      ...style,
    }}>{children}</button>;
  }
  if (variant === 'ghost') {
    return <button onClick={onClick} style={{
      ...base,
      background: 'transparent', color: Z.foreground, border: '1px solid transparent',
      ...style,
    }}>{children}</button>;
  }
}

// shadcn-style select trigger (static, not functional)
function Select({ label, value, style }) {
  return (
    <button style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 8, height: 32, padding: '0 10px 0 12px',
      background: Z.background, color: Z.foreground,
      border: `1px solid ${Z.border}`, borderRadius: 6,
      fontSize: 13, fontFamily: 'inherit', cursor: 'pointer', minWidth: 120,
      ...style,
    }}>
      {label && <span style={{ color: Z.mutedFg }}>{label}:</span>}
      <span style={{ color: Z.foreground, fontWeight: 500, flex: 1, textAlign: 'left' }}>{value}</span>
      <Icons.ChevronDown size={14} stroke={Z.mutedFg} />
    </button>
  );
}

// ---------- Top bar ----------
function TopBar({ accent, activeNav = 'Dashboard' }) {
  const navItems = ['Dashboard', 'Properties', 'Bills', 'Payments', 'Settings'];
  return (
    <div style={{
      height: 64,
      background: 'rgba(255,255,255,0.8)',
      backdropFilter: 'blur(8px)',
      borderBottom: `1px solid ${Z.border}`,
      display: 'flex', alignItems: 'center',
      padding: '0 32px',
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 40 }}>
        <div style={{
          width: 26, height: 26, borderRadius: 6,
          background: accent.solid,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff',
        }}>
          <Icons.LayoutDashboard size={15} stroke="#fff" />
        </div>
        <span style={{ fontSize: 14.5, fontWeight: 600, letterSpacing: -0.1, color: Z.foreground }}>
          UtilityBills
        </span>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1 }}>
        {navItems.map((item, i) => {
          const active = item === activeNav;
          return (
            <a key={item} href="#" style={{
              position: 'relative',
              padding: '8px 12px',
              fontSize: 13.5,
              fontWeight: active ? 500 : 400,
              color: active ? Z.foreground : Z.mutedFg,
              textDecoration: 'none',
              borderRadius: 6,
            }}>
              {item}
              {active && (
                <span style={{
                  position: 'absolute', left: 12, right: 12, bottom: -1,
                  height: 2, background: accent.solid, borderRadius: 2,
                }}/>
              )}
            </a>
          );
        })}
      </nav>

      {/* Right cluster */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <button style={iconBtnStyle}><Icons.Globe size={16} stroke={Z.mutedFg} /></button>
        <button style={iconBtnStyle}><Icons.Moon size={16} stroke={Z.mutedFg} /></button>
        <div style={{ width: 1, height: 20, background: Z.border, margin: '0 8px' }}/>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 8,
          height: 36, padding: '0 4px 0 8px',
          background: 'transparent', border: 'none', borderRadius: 18, cursor: 'pointer',
        }}>
          <span style={{ fontSize: 13, color: Z.foreground, fontWeight: 500 }}>Anna</span>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: accent.tintBg,
            color: accent.solid,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 600,
            border: `1px solid ${accent.tintBorder}`,
          }}>AL</div>
        </button>
      </div>
    </div>
  );
}
const iconBtnStyle = {
  width: 32, height: 32, borderRadius: 6,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'transparent', border: 'none', cursor: 'pointer',
};

// ---------- Attention block ----------
function AttentionBlock({ accent }) {
  return (
    <Card style={{
      borderLeft: `4px solid ${Z.warning}`,
      padding: '20px 24px',
      display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Icons.AlertTriangle size={18} stroke={Z.warning} />
        <h3 style={{ margin: 0, fontSize: 14.5, fontWeight: 600, color: Z.foreground, letterSpacing: -0.1 }}>
          Attention required
        </h3>
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <li style={{ display: 'flex', alignItems: 'baseline', gap: 10, fontSize: 13.5, color: Z.foreground }}>
          <span style={{ color: Z.mutedFg, width: 8 }}>•</span>
          <span style={{ flex: 1 }}>
            Debt: <strong style={{ color: Z.destructive, fontWeight: 600 }}>1,240 UAH</strong>
            <span style={{ color: Z.mutedFg }}> total (2 services)</span>
          </span>
          <a href="#" style={{
            color: accent.solid, fontSize: 13, fontWeight: 500,
            textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 2,
          }}>View details <Icons.ChevronRight size={14} stroke={accent.solid}/></a>
        </li>
        <li style={{ display: 'flex', alignItems: 'baseline', gap: 10, fontSize: 13.5, color: Z.foreground }}>
          <span style={{ color: Z.mutedFg, width: 8 }}>•</span>
          <span style={{ flex: 1 }}>
            Submit readings by <strong style={{ fontWeight: 600 }}>Oct 25</strong>
            <span style={{ color: Z.mutedFg }}> (3 meters)</span>
          </span>
          <a href="#" style={{
            color: accent.solid, fontSize: 13, fontWeight: 500,
            textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 2,
          }}>Go to meters <Icons.ChevronRight size={14} stroke={accent.solid}/></a>
        </li>
      </ul>
    </Card>
  );
}

// ---------- Balance block ----------
function BalanceBlock({ accent }) {
  const PropIcon = ({ name, size = 16 }) => {
    const Ic = Icons[name] || Icons.Home;
    return <Ic size={size} stroke={Z.mutedFg} />;
  };
  return (
    <Card style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${Z.border}` }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: Z.mutedFg, letterSpacing: 0.2, textTransform: 'uppercase' }}>
          Current balance
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 14 }}>
          <div>
            <div style={{ fontSize: 12.5, color: Z.mutedFg, marginBottom: 6 }}>Total debt</div>
            <div style={{
              fontSize: 30, fontWeight: 600, letterSpacing: -0.8,
              color: Z.destructive, fontFeatureSettings: '"tnum" 1',
              lineHeight: 1,
            }}>
              −1,240 <span style={{ fontSize: 15, color: Z.destructive, fontWeight: 500, letterSpacing: -0.2 }}>UAH</span>
            </div>
            <div style={{ fontSize: 12.5, color: Z.mutedFg, marginTop: 6 }}>across 2 services</div>
          </div>
          <div>
            <div style={{ fontSize: 12.5, color: Z.mutedFg, marginBottom: 6 }}>Total overpayment</div>
            <div style={{
              fontSize: 30, fontWeight: 600, letterSpacing: -0.8,
              color: Z.success, fontFeatureSettings: '"tnum" 1',
              lineHeight: 1,
            }}>
              +350 <span style={{ fontSize: 15, color: Z.success, fontWeight: 500, letterSpacing: -0.2 }}>UAH</span>
            </div>
            <div style={{ fontSize: 12.5, color: Z.mutedFg, marginTop: 6 }}>across 1 service</div>
          </div>
        </div>
      </div>

      <div>
        <div style={{
          padding: '12px 24px 8px',
          fontSize: 11.5, fontWeight: 500,
          color: Z.mutedFg, letterSpacing: 0.2, textTransform: 'uppercase',
        }}>By property</div>
        <div>
          {MOCK.balance.properties.map((p, i) => {
            const isLast = i === MOCK.balance.properties.length - 1;
            const color = p.balance < 0 ? Z.destructive : p.balance > 0 ? Z.success : Z.mutedFg;
            return (
              <a key={p.id} href="#" style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 24px',
                borderBottom: isLast ? 'none' : `1px solid ${Z.border}`,
                textDecoration: 'none',
                transition: 'background 120ms',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = Z.subtle}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{
                  width: 30, height: 30, borderRadius: 6,
                  background: Z.muted,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <PropIcon name={p.icon} size={15} />
                </div>
                <div style={{ flex: 1, fontSize: 13.5, color: Z.foreground, fontWeight: 500 }}>{p.name}</div>
                <div style={{
                  fontSize: 14, fontWeight: 600, color,
                  fontFeatureSettings: '"tnum" 1',
                }}>
                  {p.balance < 0 ? '−' : '+'}{Math.abs(p.balance).toLocaleString()} UAH
                </div>
                <Icons.ChevronRight size={15} stroke={Z.mutedFg} />
              </a>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

// ---------- Charts section ----------
function ChartsSection({ accent }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Filters bar — inline horizontal */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 12px',
        background: Z.background,
        border: `1px solid ${Z.border}`,
        borderRadius: 8,
      }}>
        <span style={{ fontSize: 12.5, color: Z.mutedFg, marginRight: 4, paddingLeft: 4 }}>Filter</span>
        <Select label="Period" value="Last 12 months" style={{ minWidth: 180 }}/>
        <Select label="Property" value="All properties" style={{ minWidth: 160 }}/>
        <Select label="Service" value="All services" style={{ minWidth: 150 }}/>
        <div style={{ flex: 1 }}/>
        <span style={{ fontSize: 12, color: Z.mutedFg }}>May 2025 – Apr 2026</span>
      </div>

      {/* Top row: Pie + Stacked bar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 16 }}>
        <PieCard accent={accent} />
        <StackedBarCard accent={accent} />
      </div>

      {/* Bottom: line */}
      <LineCard accent={accent} />
    </div>
  );
}

// ---- Pie ----
function PieCard({ accent }) {
  const total = MOCK.pie.reduce((s, d) => s + d.value, 0);
  const cx = 110, cy = 110, r = 100, rInner = 62;
  let start = -Math.PI / 2;
  const arcs = MOCK.pie.map((d) => {
    const frac = d.value / total;
    const end = start + frac * Math.PI * 2;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(start), y0 = cy + r * Math.sin(start);
    const x1 = cx + r * Math.cos(end),   y1 = cy + r * Math.sin(end);
    const xi1 = cx + rInner * Math.cos(end),   yi1 = cy + rInner * Math.sin(end);
    const xi0 = cx + rInner * Math.cos(start), yi0 = cy + rInner * Math.sin(start);
    const path = `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} L ${xi1} ${yi1} A ${rInner} ${rInner} 0 ${large} 0 ${xi0} ${yi0} Z`;
    const a = { ...d, path, color: SERVICE_COLORS[d.key], pct: Math.round(frac * 100) };
    start = end;
    return a;
  });
  return (
    <Card style={{ padding: 24 }}>
      <div>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: Z.foreground, letterSpacing: -0.1 }}>
          Expenses by service
        </h3>
        <p style={{ margin: '2px 0 0', fontSize: 12, color: Z.mutedFg }}>Last 12 months</p>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '220px 1fr',
        gap: 24,
        alignItems: 'center',
        marginTop: 20,
        paddingLeft: 4, paddingRight: 4,
      }}>
        <div style={{ position: 'relative', width: 220, height: 220 }}>
          <svg width="220" height="220" viewBox="0 0 220 220">
            {arcs.map((a) => (
              <path key={a.key} d={a.path} fill={a.color} stroke="#fff" strokeWidth="1.5"/>
            ))}
          </svg>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ fontSize: 10.5, color: Z.mutedFg, textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 500 }}>
              Total
            </div>
            <div style={{
              fontSize: 24, fontWeight: 600, color: Z.foreground,
              letterSpacing: -0.5, fontFeatureSettings: '"tnum" 1',
              marginTop: 2,
            }}>
              {total.toLocaleString()}
            </div>
            <div style={{ fontSize: 11, color: Z.mutedFg, marginTop: 1 }}>UAH</div>
          </div>
        </div>
        <ul style={{
          margin: 0, padding: 0, listStyle: 'none',
          display: 'flex', flexDirection: 'column',
          gap: 10,
          maxWidth: 220,
        }}>
          {arcs.map((a) => (
            <li key={a.key} style={{
              display: 'flex', alignItems: 'center',
              gap: 10, fontSize: 13,
            }}>
              <span style={{
                width: 9, height: 9, borderRadius: 2,
                background: a.color, flexShrink: 0,
              }}/>
              <span style={{ color: Z.foreground, marginRight: 10 }}>{a.label}</span>
              <span style={{
                color: Z.mutedFg, fontFeatureSettings: '"tnum" 1',
                fontSize: 12.5, marginLeft: 'auto', fontWeight: 500,
              }}>{a.pct}%</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

// ---- Stacked bar ----
function StackedBarCard({ accent }) {
  const keys = ['electricity','gas','heating','coldWater','hotWater','internet'];
  const [hidden, setHidden] = useState({});
  const [hoverIdx, setHoverIdx] = useState(null);
  const labelFor = (k) => MOCK.pie.find(p => p.key === k).label;

  const data = MOCK.months.map((m, i) => {
    const parts = keys.map(k => ({ key: k, value: MOCK.monthly[k][i] }));
    const visibleTotal = parts.filter(p => !hidden[p.key]).reduce((s, p) => s + p.value, 0);
    const fullTotal = parts.reduce((s, p) => s + p.value, 0);
    return { month: m, parts, total: visibleTotal, fullTotal };
  });
  const maxTotal = Math.max(...data.map(d => d.total), 1);
  const yMax = Math.ceil(maxTotal / 500) * 500 || 500;
  const w = 560, h = 220, padL = 38, padR = 8, padT = 8, padB = 28;
  const chartH = h - padT - padB, chartW = w - padL - padR;
  const bw = chartW / data.length;
  const barInner = bw * 0.62;
  const yTicks = [0, yMax / 4, yMax / 2, (3 * yMax) / 4, yMax];

  // Tooltip positioning (SVG coords mapped to card-relative pixels via viewBox scaling)
  const svgRef = React.useRef(null);

  return (
    <Card style={{ padding: 20, position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: Z.foreground, letterSpacing: -0.1 }}>
            Monthly expenses
          </h3>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: Z.mutedFg }}>Stacked by service, UAH</p>
        </div>
      </div>
      <div style={{ position: 'relative' }}>
        <svg
          ref={svgRef}
          width="100%" viewBox={`0 0 ${w} ${h}`}
          style={{ display: 'block', marginTop: 12 }}
          onMouseLeave={() => setHoverIdx(null)}
        >
          {/* grid */}
          {yTicks.map((t, i) => {
            const y = padT + chartH - (t / yMax) * chartH;
            return (
              <g key={i}>
                <line x1={padL} x2={w - padR} y1={y} y2={y} stroke={Z.border} strokeDasharray={i === 0 ? '0' : '2 3'} />
                <text x={padL - 6} y={y + 3} fontSize="10" fill={Z.mutedFg} textAnchor="end" fontFamily="inherit">
                  {(t / 1000).toFixed(t >= 1000 ? 1 : 0) + 'k'}
                </text>
              </g>
            );
          })}
          {/* bars */}
          {data.map((d, i) => {
            const xCenter = padL + i * bw + bw / 2;
            const x = xCenter - barInner / 2;
            let yCursor = padT + chartH;
            const isHover = hoverIdx === i;
            return (
              <g key={i}>
                {/* hit area for entire column */}
                <rect
                  x={padL + i * bw} y={padT}
                  width={bw} height={chartH}
                  fill="transparent"
                  onMouseEnter={() => setHoverIdx(i)}
                />
                {d.parts.filter(p => !hidden[p.key]).map((p) => {
                  const ph = (p.value / yMax) * chartH;
                  yCursor -= ph;
                  return (
                    <rect
                      key={p.key}
                      x={x} y={yCursor}
                      width={barInner} height={ph}
                      fill={SERVICE_COLORS[p.key]}
                      opacity={hoverIdx == null || isHover ? 1 : 0.45}
                      style={{ transition: 'opacity 120ms', pointerEvents: 'none' }}
                    />
                  );
                })}
                <text x={xCenter} y={h - padB + 14} fontSize="10.5"
                  fill={isHover ? Z.foreground : Z.mutedFg}
                  fontWeight={isHover ? 500 : 400}
                  textAnchor="middle" fontFamily="inherit"
                  style={{ pointerEvents: 'none' }}
                >
                  {d.month}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Tooltip — HTML overlay, positioned by index */}
        {hoverIdx != null && (() => {
          const d = data[hoverIdx];
          // Percent x of the svg viewBox
          const xPct = ((padL + hoverIdx * bw + bw / 2) / w) * 100;
          // Place above, flip to right if near left edge
          const alignRight = xPct < 18;
          const alignLeft = xPct > 82;
          const items = d.parts.filter(p => !hidden[p.key]);
          return (
            <div style={{
              position: 'absolute',
              left: `calc(${xPct}% + ${alignRight ? '14px' : alignLeft ? '-14px' : '0px'})`,
              top: 20,
              transform: alignRight ? 'translate(0, 0)' :
                         alignLeft  ? 'translate(-100%, 0)' :
                                      'translate(-50%, 0)',
              background: '#18181b',
              color: '#fafafa',
              borderRadius: 6,
              padding: '10px 12px',
              minWidth: 200,
              boxShadow: '0 8px 24px rgba(0,0,0,0.24)',
              pointerEvents: 'none',
              zIndex: 5,
              fontSize: 12.5,
            }}>
              <div style={{
                fontSize: 12, fontWeight: 600, color: '#fafafa',
                marginBottom: 8, paddingBottom: 6,
                borderBottom: '1px solid rgba(255,255,255,0.12)',
              }}>
                {d.month}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {items.map(p => (
                  <div key={p.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: SERVICE_COLORS[p.key], flexShrink: 0 }}/>
                    <span style={{ color: 'rgba(250,250,250,0.75)', flex: 1 }}>{labelFor(p.key)}</span>
                    <span style={{ color: '#fafafa', fontFeatureSettings: '"tnum" 1' }}>
                      {p.value.toLocaleString()} UAH
                    </span>
                  </div>
                ))}
              </div>
              <div style={{
                marginTop: 8, paddingTop: 6,
                borderTop: '1px solid rgba(255,255,255,0.12)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ color: 'rgba(250,250,250,0.75)', flex: 1 }}>Total</span>
                <span style={{ color: '#fafafa', fontWeight: 600, fontFeatureSettings: '"tnum" 1' }}>
                  {d.total.toLocaleString()} UAH
                </span>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Clickable legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
        {keys.map(k => {
          const off = !!hidden[k];
          return (
            <button
              key={k}
              onClick={() => setHidden(h => ({ ...h, [k]: !h[k] }))}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '3px 6px',
                fontSize: 11.5,
                color: off ? Z.mutedFg : Z.foreground,
                textDecoration: off ? 'line-through' : 'none',
                background: 'transparent', border: '1px solid transparent',
                borderRadius: 4, cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'color 120ms',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = Z.subtle}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{
                width: 9, height: 9, borderRadius: 2,
                background: off ? Z.border : SERVICE_COLORS[k],
                transition: 'background 120ms',
              }}/>
              {labelFor(k)}
            </button>
          );
        })}
      </div>
    </Card>
  );
}

// ---- Line chart ----
function LineCard({ accent }) {
  const [mode, setMode] = useState('expenses'); // 'expenses' | 'consumption'
  const [service, setService] = useState('electricity');

  // data
  const expensesSeries = ['electricity','gas','coldWater','hotWater'].map(k => ({
    key: k,
    label: MOCK.pie.find(p => p.key === k).label,
    color: SERVICE_COLORS[k],
    values: MOCK.monthly[k],
  }));

  // A fake consumption series (kWh or m3) — deterministic from monthly UAH
  const consumption = {
    electricity: MOCK.monthly.electricity.map(v => Math.round(v / 4.8)),     // kWh
    gas:         MOCK.monthly.gas.map(v => Math.round(v / 8)),                // m3
    coldWater:   MOCK.monthly.coldWater.map(v => Math.round(v / 35 * 10) / 10), // m3
    hotWater:    MOCK.monthly.hotWater.map(v => Math.round(v / 110 * 10) / 10), // m3
  };
  const unit = { electricity: 'kWh', gas: 'm³', coldWater: 'm³', hotWater: 'm³' }[service];

  const w = 1100, h = 240, padL = 44, padR = 20, padT = 12, padB = 28;
  const chartH = h - padT - padB, chartW = w - padL - padR;
  const n = MOCK.months.length;
  const xAt = (i) => padL + (i / (n - 1)) * chartW;

  let series;
  if (mode === 'expenses') {
    series = expensesSeries;
  } else {
    series = [{
      key: service,
      label: { electricity: 'Electricity', gas: 'Gas', coldWater: 'Cold water', hotWater: 'Hot water' }[service],
      color: SERVICE_COLORS[service],
      values: consumption[service],
    }];
  }
  const allVals = series.flatMap(s => s.values);
  const maxVal = Math.max(...allVals);
  const yMax = Math.ceil(maxVal / 100) * 100 || 1;
  const yAt = (v) => padT + chartH - (v / yMax) * chartH;
  const yTicks = [0, yMax / 4, yMax / 2, (3 * yMax) / 4, yMax];

  return (
    <Card style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 4, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: Z.foreground, letterSpacing: -0.1 }}>
            Consumption trend
          </h3>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: Z.mutedFg }}>
            {mode === 'expenses' ? 'All services, UAH' : `${series[0].label}, ${unit}`}
          </p>
        </div>

        {/* segmented toggle (shadcn Tabs-like) */}
        <div style={{
          display: 'inline-flex', padding: 3,
          background: Z.muted, border: `1px solid ${Z.border}`, borderRadius: 6,
        }}>
          {[
            { k: 'expenses',    label: 'Expenses (₴)' },
            { k: 'consumption', label: 'Consumption' },
          ].map(t => {
            const active = mode === t.k;
            return (
              <button key={t.k} onClick={() => setMode(t.k)} style={{
                padding: '5px 12px', fontSize: 12.5, fontWeight: active ? 500 : 400,
                border: 'none', borderRadius: 4, cursor: 'pointer',
                background: active ? Z.background : 'transparent',
                color: active ? Z.foreground : Z.mutedFg,
                boxShadow: active ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                fontFamily: 'inherit',
              }}>{t.label}</button>
            );
          })}
        </div>

        {mode === 'consumption' && (
          <Select label="Service" value={series[0].label} style={{ minWidth: 140 }}/>
        )}
      </div>

      <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', marginTop: 8 }}>
        {/* grid + y labels */}
        {yTicks.map((t, i) => {
          const y = yAt(t);
          return (
            <g key={i}>
              <line x1={padL} x2={w - padR} y1={y} y2={y} stroke={Z.border} strokeDasharray={i === 0 ? '0' : '2 3'} />
              <text x={padL - 8} y={y + 3} fontSize="10" fill={Z.mutedFg} textAnchor="end" fontFamily="inherit">
                {mode === 'expenses'
                  ? (t >= 1000 ? (t/1000).toFixed(1) + 'k' : t)
                  : (Number.isInteger(t) ? t : t.toFixed(1))}
              </text>
            </g>
          );
        })}
        {/* x labels */}
        {MOCK.months.map((m, i) => (
          <text key={m} x={xAt(i)} y={h - padB + 14} fontSize="10.5" fill={Z.mutedFg} textAnchor="middle" fontFamily="inherit">
            {m}
          </text>
        ))}
        {/* lines */}
        {series.map(s => {
          const d = s.values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i).toFixed(2)} ${yAt(v).toFixed(2)}`).join(' ');
          return (
            <g key={s.key}>
              <path d={d} fill="none" stroke={s.color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
              {s.values.map((v, i) => (
                <circle key={i} cx={xAt(i)} cy={yAt(v)} r={2.5} fill="#fff" stroke={s.color} strokeWidth="1.5"/>
              ))}
            </g>
          );
        })}
      </svg>
      {/* legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 4 }}>
        {series.map(s => (
          <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: Z.mutedFg }}>
            <span style={{ width: 14, height: 2, background: s.color, borderRadius: 1 }}/>
            {s.label}
          </div>
        ))}
      </div>
    </Card>
  );
}

// ---------- Main dashboard ----------
function Dashboard({ accentKey }) {
  const accent = ACCENTS[accentKey];
  return (
    <div style={{
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      fontFeatureSettings: '"cv11" 1, "ss01" 1',
      color: Z.foreground,
      background: Z.background,
      minHeight: '100%',
      WebkitFontSmoothing: 'antialiased',
    }}>
      <TopBar accent={accent} />
      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '32px 32px 48px' }}>
        {/* Page header */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{
            margin: 0, fontSize: 28, fontWeight: 600, letterSpacing: -0.6,
            color: Z.foreground,
          }}>
            Hi, Anna
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <AttentionBlock accent={accent} />
          <BalanceBlock accent={accent} />
          <ChartsSection accent={accent} />
        </div>
      </div>
    </div>
  );
}

window.Dashboard = Dashboard;
window.ACCENTS = ACCENTS;
window.UB = { Z, ACCENTS, SERVICE_COLORS, SERVICE_ICONS, Icons, Icon, TopBar, Card, Button, Select };
