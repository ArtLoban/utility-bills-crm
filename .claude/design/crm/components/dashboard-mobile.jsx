/* global React */
// Dashboard — Mobile, 390 px, Light mode, Violet accent
// Requires dashboard.jsx loaded first (provides window.UB)

const { useState: useSt } = React;
const { Z, ACCENTS, SERVICE_COLORS, Icons } = window.UB;
const ACC = ACCENTS.violet;

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_M = {
  balance: {
    properties: [
      { id: 1, tree: false, name: 'Apartment on Main St', balance: -890 },
      { id: 2, tree: false, name: "Mom's apartment",      balance: -350 },
      { id: 3, tree: true,  name: 'Summer house',          balance:  350 },
    ],
  },
  pie: [
    { key: 'electricity', label: 'Electricity', value: 8420 },
    { key: 'gas',         label: 'Gas',         value: 4230 },
    { key: 'heating',     label: 'Heating',     value: 6180 },
    { key: 'coldWater',   label: 'Cold water',  value: 1840 },
    { key: 'hotWater',    label: 'Hot water',   value: 2710 },
    { key: 'internet',    label: 'Internet',    value: 3000 },
  ],
  months: ['May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr'],
  monthly: {
    electricity: [640, 620, 680, 720, 700, 660, 720, 780, 820, 760, 700, 700],
    gas:         [120, 110, 100,  90, 180, 300, 520, 640, 680, 620, 480, 380],
    heating:     [  0,   0,   0,   0, 180, 520, 820, 980,1060, 920, 620, 220],
    coldWater:   [140, 150, 160, 160, 160, 150, 150, 150, 160, 150, 150, 150],
    hotWater:    [210, 210, 220, 220, 230, 230, 240, 240, 250, 240, 230, 220],
    internet:    [250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250],
  },
};

// ─── SVG primitive ────────────────────────────────────────────────────────────
const Svg = ({ size = 16, stroke = 'currentColor', fill = 'none', sw = 1.75, children, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style}>
    {children}
  </svg>
);

// ─── Topbar ───────────────────────────────────────────────────────────────────
function MobileTopbar() {
  return (
    <div style={{
      height: 52,
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(10px)',
      borderBottom: `1px solid ${Z.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 16px',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 22, height: 22, borderRadius: 5, background: ACC.solid,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icons.LayoutDashboard size={13} stroke="#fff" />
        </div>
        <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: -0.1, color: Z.foreground }}>
          UtilityBills
        </span>
      </div>
      <button style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer' }}>
        <Svg size={18} stroke={Z.foreground} sw={2}>
          <path d="M4 6h16M4 12h16M4 18h16" />
        </Svg>
      </button>
    </div>
  );
}

// ─── Attention banner ─────────────────────────────────────────────────────────
function AttentionBanner() {
  return (
    <div style={{
      background: Z.warningSoft,
      border: `1px solid ${Z.warningBorder}`,
      borderLeft: `4px solid ${Z.warning}`,
      borderRadius: 8,
      padding: '14px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <Icons.AlertTriangle size={16} stroke={Z.warning} />
        <span style={{ fontSize: 13.5, fontWeight: 600, color: Z.foreground }}>Attention required</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ fontSize: 13, color: Z.foreground, flex: 1 }}>
            Debt: <strong style={{ color: Z.destructive }}>1,240 UAH</strong>
            <span style={{ color: Z.mutedFg }}> · 2 services</span>
          </span>
          <a href="#" style={{
            color: ACC.solid, fontSize: 12.5, fontWeight: 500,
            textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0,
          }}>
            View <Icons.ChevronRight size={12} stroke={ACC.solid} />
          </a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ fontSize: 13, color: Z.foreground, flex: 1 }}>
            Readings due <strong>Oct 25</strong>
            <span style={{ color: Z.mutedFg }}> · 3 meters</span>
          </span>
          <a href="#" style={{
            color: ACC.solid, fontSize: 12.5, fontWeight: 500,
            textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0,
          }}>
            Go <Icons.ChevronRight size={12} stroke={ACC.solid} />
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Balance card ─────────────────────────────────────────────────────────────
function BalanceSummary() {
  return (
    <div style={{
      background: Z.card, border: `1px solid ${Z.border}`,
      borderRadius: 8, boxShadow: '0 1px 2px rgba(24,24,27,0.05)',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '11px 16px',
        fontSize: 11, fontWeight: 600, color: Z.mutedFg,
        textTransform: 'uppercase', letterSpacing: 0.6,
        borderBottom: `1px solid ${Z.border}`,
      }}>Current balance</div>

      {/* Debt / overpay */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: `1px solid ${Z.border}` }}>
        <div style={{ padding: '14px 16px', borderRight: `1px solid ${Z.border}` }}>
          <div style={{ fontSize: 12, color: Z.mutedFg, marginBottom: 7 }}>Total debt</div>
          <div style={{
            fontSize: 27, fontWeight: 700, color: Z.destructive,
            letterSpacing: -0.8, fontFeatureSettings: '"tnum" 1', lineHeight: 1,
          }}>−1,240</div>
          <div style={{ fontSize: 11, color: Z.destructive, marginTop: 3, fontWeight: 500 }}>UAH</div>
          <div style={{ fontSize: 12, color: Z.mutedFg, marginTop: 5 }}>2 services</div>
        </div>
        <div style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: 12, color: Z.mutedFg, marginBottom: 7 }}>Overpayment</div>
          <div style={{
            fontSize: 27, fontWeight: 700, color: Z.success,
            letterSpacing: -0.8, fontFeatureSettings: '"tnum" 1', lineHeight: 1,
          }}>+350</div>
          <div style={{ fontSize: 11, color: Z.success, marginTop: 3, fontWeight: 500 }}>UAH</div>
          <div style={{ fontSize: 12, color: Z.mutedFg, marginTop: 5 }}>1 service</div>
        </div>
      </div>

      {/* Properties */}
      <div style={{
        padding: '10px 16px 6px',
        fontSize: 11, fontWeight: 600, color: Z.mutedFg,
        textTransform: 'uppercase', letterSpacing: 0.6,
      }}>By property</div>
      {MOCK_M.balance.properties.map((p, i) => {
        const isLast = i === MOCK_M.balance.properties.length - 1;
        const color = p.balance < 0 ? Z.destructive : Z.success;
        const sign = p.balance < 0 ? '−' : '+';
        const PropIc = p.tree ? Icons.TreePine : Icons.Home;
        return (
          <a key={p.id} href="#" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '11px 16px',
            borderBottom: isLast ? 'none' : `1px solid ${Z.border}`,
            textDecoration: 'none',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: Z.muted, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <PropIc size={16} stroke={Z.mutedFg} />
            </div>
            <div style={{
              flex: 1, minWidth: 0,
              fontSize: 13.5, fontWeight: 500, color: Z.foreground,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{p.name}</div>
            <div style={{
              fontSize: 13.5, fontWeight: 700, color,
              fontFeatureSettings: '"tnum" 1', flexShrink: 0,
            }}>
              {sign}{Math.abs(p.balance).toLocaleString()}
              <span style={{ fontSize: 11, fontWeight: 500, marginLeft: 2 }}>UAH</span>
            </div>
            <Icons.ChevronRight size={14} stroke={Z.mutedFg} />
          </a>
        );
      })}
    </div>
  );
}

// ─── Pie chart ────────────────────────────────────────────────────────────────
function PieMobile() {
  const total = MOCK_M.pie.reduce((s, d) => s + d.value, 0);
  const cx = 85, cy = 85, r = 76, ri = 48;
  let start = -Math.PI / 2;
  const arcs = MOCK_M.pie.map((d) => {
    const frac = d.value / total;
    const end = start + frac * 2 * Math.PI;
    const large = frac > 0.5 ? 1 : 0;
    const [x0, y0] = [cx + r * Math.cos(start),  cy + r * Math.sin(start)];
    const [x1, y1] = [cx + r * Math.cos(end),    cy + r * Math.sin(end)];
    const [xi1,yi1]= [cx + ri * Math.cos(end),   cy + ri * Math.sin(end)];
    const [xi0,yi0]= [cx + ri * Math.cos(start), cy + ri * Math.sin(start)];
    const path = `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} L ${xi1} ${yi1} A ${ri} ${ri} 0 ${large} 0 ${xi0} ${yi0} Z`;
    const a = { ...d, path, color: SERVICE_COLORS[d.key], pct: Math.round(frac * 100) };
    start = end;
    return a;
  });

  return (
    <div style={{
      background: Z.card, border: `1px solid ${Z.border}`,
      borderRadius: 8, boxShadow: '0 1px 2px rgba(24,24,27,0.05)',
      padding: '16px',
    }}>
      <div style={{ fontSize: 13.5, fontWeight: 600, color: Z.foreground, letterSpacing: -0.1 }}>
        Expenses by service
      </div>
      <div style={{ fontSize: 12, color: Z.mutedFg, marginTop: 2, marginBottom: 14 }}>Last 12 months</div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Donut */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <svg width="170" height="170" viewBox="0 0 170 170">
            {arcs.map(a => (
              <path key={a.key} d={a.path} fill={a.color} stroke="#fff" strokeWidth="1.5" />
            ))}
          </svg>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ fontSize: 10, color: Z.mutedFg, textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 500 }}>Total</div>
            <div style={{
              fontSize: 21, fontWeight: 700, color: Z.foreground,
              letterSpacing: -0.5, fontFeatureSettings: '"tnum" 1', lineHeight: 1.15,
            }}>{(total / 1000).toFixed(1)}k</div>
            <div style={{ fontSize: 10.5, color: Z.mutedFg }}>UAH</div>
          </div>
        </div>

        {/* Legend */}
        <ul style={{
          margin: 0, padding: 0, listStyle: 'none',
          display: 'flex', flexDirection: 'column', gap: 9, flex: 1,
        }}>
          {arcs.map(a => (
            <li key={a.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: a.color, flexShrink: 0 }} />
              <span style={{ color: Z.foreground, flex: 1, fontSize: 12.5 }}>{a.label}</span>
              <span style={{ color: Z.mutedFg, fontSize: 12, fontFeatureSettings: '"tnum" 1', fontWeight: 500 }}>
                {a.pct}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Bar chart ────────────────────────────────────────────────────────────────
function BarMobile() {
  const [hidden, setHidden] = useSt({});
  const [hoverIdx, setHoverIdx] = useSt(null);
  const keys = ['electricity', 'gas', 'heating', 'coldWater', 'hotWater', 'internet'];
  const labelFor = (k) => MOCK_M.pie.find(p => p.key === k).label;

  const data = MOCK_M.months.map((m, i) => {
    const parts = keys.map(k => ({ key: k, value: MOCK_M.monthly[k][i] }));
    const visTotal = parts.filter(p => !hidden[p.key]).reduce((s, p) => s + p.value, 0);
    return { month: m, parts, total: visTotal };
  });
  const maxTotal = Math.max(...data.map(d => d.total), 1);
  const yMax = Math.ceil(maxTotal / 500) * 500 || 500;

  const BW = 26, BG = 18, PL = 32, PR = 12, PT = 8, PB = 22, H = 168;
  const chartH = H - PT - PB;
  const totalW = PL + data.length * (BW + BG) + PR;
  const xc = (i) => PL + i * (BW + BG) + BW / 2;
  const yTicks = [0, yMax / 2, yMax];

  return (
    <div style={{
      background: Z.card, border: `1px solid ${Z.border}`,
      borderRadius: 8, boxShadow: '0 1px 2px rgba(24,24,27,0.05)',
      padding: '16px 16px 12px',
    }}>
      <div style={{ fontSize: 13.5, fontWeight: 600, color: Z.foreground, letterSpacing: -0.1 }}>
        Monthly expenses
      </div>
      <div style={{ fontSize: 12, color: Z.mutedFg, marginTop: 2 }}>Stacked by service · scroll →</div>

      <div style={{ overflowX: 'auto', marginTop: 12, marginLeft: -16, marginRight: -16, paddingLeft: 16 }}>
        <div style={{ width: totalW, position: 'relative' }}>
          <svg width={totalW} height={H} style={{ display: 'block' }}
            onMouseLeave={() => setHoverIdx(null)}>
            {/* Y gridlines */}
            {yTicks.map((t, i) => {
              const y = PT + chartH - (t / yMax) * chartH;
              return (
                <g key={i}>
                  <line x1={PL} x2={totalW - PR} y1={y} y2={y}
                    stroke={Z.border} strokeDasharray={i === 0 ? '0' : '2 3'} />
                  <text x={PL - 4} y={y + 3} fontSize="9" fill={Z.mutedFg}
                    textAnchor="end" fontFamily="inherit">
                    {t >= 1000 ? (t / 1000).toFixed(1) + 'k' : t}
                  </text>
                </g>
              );
            })}
            {/* Bars */}
            {data.map((d, i) => {
              const xcI = xc(i);
              const x = xcI - BW / 2;
              let yCursor = PT + chartH;
              const isHover = hoverIdx === i;
              return (
                <g key={i}>
                  <rect
                    x={PL + i * (BW + BG) - BG / 2} y={PT}
                    width={BW + BG} height={chartH}
                    fill="transparent"
                    onMouseEnter={() => setHoverIdx(i)}
                    onTouchStart={() => setHoverIdx(i)}
                  />
                  {d.parts.filter(p => !hidden[p.key]).map(p => {
                    const ph = (p.value / yMax) * chartH;
                    yCursor -= ph;
                    return (
                      <rect key={p.key} x={x} y={yCursor} width={BW} height={Math.max(ph, 0)}
                        fill={SERVICE_COLORS[p.key]}
                        opacity={hoverIdx == null || isHover ? 1 : 0.4}
                        style={{ transition: 'opacity 120ms', pointerEvents: 'none' }} />
                    );
                  })}
                  <text x={xcI} y={H - PB + 14} fontSize="9.5"
                    fill={isHover ? Z.foreground : Z.mutedFg}
                    fontWeight={isHover ? '600' : '400'}
                    textAnchor="middle" fontFamily="inherit"
                    style={{ pointerEvents: 'none' }}>
                    {d.month}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Tooltip */}
          {hoverIdx != null && (() => {
            const d = data[hoverIdx];
            const xcI = xc(hoverIdx);
            const items = d.parts.filter(p => !hidden[p.key]);
            const flipLeft  = xcI > totalW - 175;
            const flipRight = xcI < 130;
            return (
              <div style={{
                position: 'absolute',
                left: xcI, top: 8,
                transform: flipLeft ? 'translate(-100%, 0)' : flipRight ? 'translate(8px, 0)' : 'translate(-50%, 0)',
                background: '#18181b', color: '#fafafa',
                borderRadius: 6, padding: '8px 10px',
                minWidth: 164, fontSize: 11.5,
                boxShadow: '0 4px 16px rgba(0,0,0,0.24)',
                pointerEvents: 'none', zIndex: 5,
              }}>
                <div style={{ fontWeight: 600, marginBottom: 6, paddingBottom: 4, borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
                  {d.month} · {d.total.toLocaleString()} UAH
                </div>
                {items.map(p => (
                  <div key={p.key} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <span style={{ width: 7, height: 7, borderRadius: 2, background: SERVICE_COLORS[p.key], flexShrink: 0 }} />
                    <span style={{ color: 'rgba(250,250,250,0.75)', flex: 1 }}>{labelFor(p.key)}</span>
                    <span style={{ fontFeatureSettings: '"tnum" 1' }}>{p.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </div>

      {/* Toggleable legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 12 }}>
        {keys.map(k => {
          const off = !!hidden[k];
          return (
            <button key={k}
              onClick={() => setHidden(h => ({ ...h, [k]: !h[k] }))}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '3px 8px', fontSize: 11,
                color: off ? Z.mutedFg : Z.foreground,
                textDecoration: off ? 'line-through' : 'none',
                background: Z.subtle, border: `1px solid ${off ? Z.border : Z.border}`,
                borderRadius: 999, cursor: 'pointer', fontFamily: 'inherit',
              }}>
              <span style={{ width: 7, height: 7, borderRadius: 2, background: off ? Z.border : SERVICE_COLORS[k] }} />
              {labelFor(k)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Line chart ───────────────────────────────────────────────────────────────
function LineMobile() {
  const [mode, setMode] = useSt('expenses');
  const [service, setService] = useSt('electricity');

  const expSeries = ['electricity', 'gas', 'coldWater', 'hotWater'].map(k => ({
    key: k, label: MOCK_M.pie.find(p => p.key === k).label,
    color: SERVICE_COLORS[k], values: MOCK_M.monthly[k],
  }));
  const consumption = {
    electricity: MOCK_M.monthly.electricity.map(v => Math.round(v / 4.8)),
    gas:         MOCK_M.monthly.gas.map(v => Math.round(v / 8)),
    coldWater:   MOCK_M.monthly.coldWater.map(v => Math.round(v / 35 * 10) / 10),
    hotWater:    MOCK_M.monthly.hotWater.map(v => Math.round(v / 110 * 10) / 10),
  };
  const unit = { electricity: 'kWh', gas: 'm³', coldWater: 'm³', hotWater: 'm³' }[service];
  const series = mode === 'expenses' ? expSeries : [{
    key: service,
    label: { electricity: 'Electricity', gas: 'Gas', coldWater: 'Cold water', hotWater: 'Hot water' }[service],
    color: SERVICE_COLORS[service],
    values: consumption[service],
  }];

  const w = 680, h = 168, PL = 36, PR = 12, PT = 8, PB = 22;
  const chartH = h - PT - PB, chartW = w - PL - PR;
  const n = MOCK_M.months.length;
  const xAt = (i) => PL + (i / (n - 1)) * chartW;
  const allVals = series.flatMap(s => s.values);
  const maxVal = Math.max(...allVals);
  const yMax = Math.ceil(maxVal / 100) * 100 || 1;
  const yAt = (v) => PT + chartH - (v / yMax) * chartH;
  const yTicks = [0, yMax / 2, yMax];

  return (
    <div style={{
      background: Z.card, border: `1px solid ${Z.border}`,
      borderRadius: 8, boxShadow: '0 1px 2px rgba(24,24,27,0.05)',
      padding: '16px 16px 12px',
    }}>
      {/* Header + toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: Z.foreground, letterSpacing: -0.1 }}>
            Consumption trend
          </div>
          <div style={{ fontSize: 12, color: Z.mutedFg, marginTop: 2 }}>
            {mode === 'expenses' ? 'All services, UAH' : `${series[0].label}, ${unit}`}
          </div>
        </div>
        <div style={{
          display: 'inline-flex', padding: 2,
          background: Z.muted, border: `1px solid ${Z.border}`, borderRadius: 6, flexShrink: 0,
        }}>
          {[['expenses', '₴'], ['consumption', 'Usage']].map(([k, lbl]) => {
            const active = mode === k;
            return (
              <button key={k} onClick={() => setMode(k)} style={{
                padding: '4px 10px', fontSize: 11.5, fontWeight: active ? 600 : 400,
                border: 'none', borderRadius: 4, cursor: 'pointer',
                background: active ? Z.background : 'transparent',
                color: active ? Z.foreground : Z.mutedFg,
                boxShadow: active ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                fontFamily: 'inherit',
              }}>{lbl}</button>
            );
          })}
        </div>
      </div>

      {/* Service picker */}
      {mode === 'consumption' && (
        <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
          {[['electricity', 'Electricity'], ['gas', 'Gas'], ['coldWater', 'Cold'], ['hotWater', 'Hot']].map(([k, lbl]) => {
            const active = service === k;
            return (
              <button key={k} onClick={() => setService(k)} style={{
                padding: '4px 10px', fontSize: 12, fontWeight: active ? 600 : 400,
                borderRadius: 999, cursor: 'pointer', fontFamily: 'inherit',
                border: `1px solid ${active ? SERVICE_COLORS[k] : Z.border}`,
                background: active ? SERVICE_COLORS[k] + '22' : Z.background,
                color: active ? Z.foreground : Z.mutedFg,
              }}>{lbl}</button>
            );
          })}
        </div>
      )}

      {/* Chart — scrollable */}
      <div style={{ overflowX: 'auto', marginTop: 10, marginLeft: -16, marginRight: -16, paddingLeft: 16 }}>
        <svg width={w} height={h} style={{ display: 'block' }}>
          {yTicks.map((t, i) => {
            const y = yAt(t);
            return (
              <g key={i}>
                <line x1={PL} x2={w - PR} y1={y} y2={y}
                  stroke={Z.border} strokeDasharray={i === 0 ? '0' : '2 3'} />
                <text x={PL - 4} y={y + 3} fontSize="9" fill={Z.mutedFg}
                  textAnchor="end" fontFamily="inherit">
                  {mode === 'expenses'
                    ? (t >= 1000 ? (t / 1000).toFixed(1) + 'k' : t)
                    : (Number.isInteger(t) ? t : t.toFixed(1))}
                </text>
              </g>
            );
          })}
          {MOCK_M.months.map((m, i) => (
            <text key={m} x={xAt(i)} y={h - PB + 14} fontSize="9.5"
              fill={Z.mutedFg} textAnchor="middle" fontFamily="inherit">{m}</text>
          ))}
          {series.map(s => {
            const d = s.values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i).toFixed(2)} ${yAt(v).toFixed(2)}`).join(' ');
            return (
              <g key={s.key}>
                <path d={d} fill="none" stroke={s.color} strokeWidth="1.75"
                  strokeLinecap="round" strokeLinejoin="round" />
                {s.values.map((v, i) => (
                  <circle key={i} cx={xAt(i)} cy={yAt(v)} r={2.5}
                    fill="#fff" stroke={s.color} strokeWidth="1.5" />
                ))}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
        {series.map(s => (
          <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: Z.mutedFg }}>
            <span style={{ width: 14, height: 2, background: s.color, borderRadius: 1 }} />
            {s.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
function DashboardMobile() {
  return (
    <div data-screen-label="Dashboard · Mobile" style={{
      width: 390, margin: '0 auto',
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      fontFeatureSettings: '"cv11" 1, "ss01" 1',
      WebkitFontSmoothing: 'antialiased',
      color: Z.foreground,
      background: '#f4f4f5',
    }}>
      <MobileTopbar />

      <div style={{ padding: '20px 14px 36px', display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Greeting */}
          <div>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, letterSpacing: -0.5, color: Z.foreground }}>
              Hi, Anna
            </h2>
            <p style={{ margin: '3px 0 0', fontSize: 13, color: Z.mutedFg }}>May 2025 – Apr 2026</p>
          </div>

          <AttentionBanner />
          <BalanceSummary />

          {/* Analytics header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginTop: 6, marginBottom: 2,
          }}>
            <span style={{
              fontSize: 11.5, fontWeight: 600, color: Z.mutedFg,
              textTransform: 'uppercase', letterSpacing: 0.6,
            }}>Analytics</span>
            <span style={{ fontSize: 12, color: Z.mutedFg }}>May 2025 – Apr 2026</span>
          </div>

          <PieMobile />
          <BarMobile />
          <LineMobile />
        </div>
    </div>
  );
}

window.DashboardMobile = DashboardMobile;
