/* global React */
// Iteration 9 — Toast stack (sonner New-York). Depends on iteration9.jsx
// (window.I9, I9TopBar, I9_ACCENT, I9Icons). Includes a compact, theme-aware
// dimmed Dashboard backdrop so the bottom-right anchor position is legible.

const SVC = { electricity: '#f59e0b', gas: '#ef4444', heating: '#8b5cf6', coldWater: '#3b82f6', hotWater: '#ec4899', internet: '#14b8a6' };

// ─── Toast icons ────────────────────────────────────────────────────────────
const TIco = ({ size = 18, stroke, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke}
    strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);
const CheckCircle = (p) => <TIco {...p}><path d="M21.8 10A10 10 0 1 1 17 3.34"/><path d="m9 11 3 3L22 4"/></TIco>;
const XCircle     = (p) => <TIco {...p}><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></TIco>;
const ClockIco    = (p) => <TIco {...p}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></TIco>;

// ─── Single toast (sonner New-York) ─────────────────────────────────────────
function Toast({ theme, icon: Icon, iconColor, message, width = 356 }) {
  const z = window.I9[theme];
  return (
    <div style={{
      width, display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '14px 14px 14px 16px',
      background: z.card, border: `1px solid ${z.border}`, borderRadius: 8,
      boxShadow: theme === 'light'
        ? '0 4px 12px rgba(24,24,27,0.10), 0 2px 4px rgba(24,24,27,0.06)'
        : '0 8px 24px rgba(0,0,0,0.45)',
    }}>
      <span style={{ flexShrink: 0, marginTop: 1 }}><Icon size={18} stroke={iconColor} /></span>
      <div style={{ flex: 1, fontSize: 13.5, lineHeight: 1.45, color: z.foreground, fontWeight: 500 }}>
        {message}
      </div>
      <button style={{
        flexShrink: 0, width: 22, height: 22, marginTop: -1, marginRight: -2,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'transparent', border: 'none', borderRadius: 5, cursor: 'pointer',
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={z.mutedFg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
    </div>
  );
}

// ─── Compact dimmed Dashboard backdrop ──────────────────────────────────────
function BackdropCard({ theme, children, style }) {
  const z = window.I9[theme];
  return (
    <div style={{
      background: z.card, border: `1px solid ${z.border}`, borderRadius: 8,
      boxShadow: theme === 'light' ? '0 1px 2px rgba(24,24,27,0.05)' : 'none', ...style,
    }}>{children}</div>
  );
}

function DashboardBackdrop({ theme }) {
  const z = window.I9[theme];
  const dest = theme === 'light' ? '#dc2626' : '#f87171';
  const succ = theme === 'light' ? '#16a34a' : '#22c55e';
  const props = [
    ['Apartment on Main St', '−890 UAH', dest],
    ["Mom\u2019s apartment", '−350 UAH', dest],
    ['Summer house', '+350 UAH', succ],
  ];
  const bars = [60, 54, 62, 70, 96, 150, 188, 210, 226, 200, 150, 96];
  return (
    <div style={{ maxWidth: 1360, margin: '0 auto', padding: '32px 32px 48px' }}>
      <h2 style={{ margin: '0 0 24px', fontSize: 28, fontWeight: 600, letterSpacing: -0.6, color: z.foreground }}>Hi, Anna</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Balance */}
        <BackdropCard theme={theme} style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px 18px', borderBottom: `1px solid ${z.border}` }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: z.mutedFg, textTransform: 'uppercase', letterSpacing: 0.2 }}>Current balance</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 14 }}>
              <div>
                <div style={{ fontSize: 12.5, color: z.mutedFg, marginBottom: 6 }}>Total debt</div>
                <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: -0.8, color: dest, fontFeatureSettings: '"tnum" 1' }}>−1,240 <span style={{ fontSize: 15, fontWeight: 500 }}>UAH</span></div>
              </div>
              <div>
                <div style={{ fontSize: 12.5, color: z.mutedFg, marginBottom: 6 }}>Total overpayment</div>
                <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: -0.8, color: succ, fontFeatureSettings: '"tnum" 1' }}>+350 <span style={{ fontSize: 15, fontWeight: 500 }}>UAH</span></div>
              </div>
            </div>
          </div>
          <div>
            {props.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', borderBottom: i < 2 ? `1px solid ${z.border}` : 'none' }}>
                <div style={{ width: 30, height: 30, borderRadius: 6, background: z.muted }} />
                <div style={{ flex: 1, fontSize: 13.5, fontWeight: 500, color: z.foreground }}>{p[0]}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: p[2], fontFeatureSettings: '"tnum" 1' }}>{p[1]}</div>
              </div>
            ))}
          </div>
        </BackdropCard>
        {/* Charts row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 16 }}>
          <BackdropCard theme={theme} style={{ padding: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: z.foreground }}>Expenses by service</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 18 }}>
              <div style={{ width: 150, height: 150, borderRadius: '50%', flexShrink: 0,
                background: `conic-gradient(${SVC.electricity} 0 30%, ${SVC.heating} 30% 52%, ${SVC.gas} 52% 67%, ${SVC.internet} 67% 78%, ${SVC.hotWater} 78% 88%, ${SVC.coldWater} 88% 100%)`,
                WebkitMask: 'radial-gradient(circle 44px at center, transparent 98%, #000 100%)',
                mask: 'radial-gradient(circle 44px at center, transparent 98%, #000 100%)' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {['Electricity','Heating','Gas','Internet','Hot water','Cold water'].map((l, i) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: z.foreground }}>
                    <span style={{ width: 9, height: 9, borderRadius: 2, background: Object.values(SVC)[[0,2,1,5,4,3][i]] }} />{l}
                  </div>
                ))}
              </div>
            </div>
          </BackdropCard>
          <BackdropCard theme={theme} style={{ padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: z.foreground }}>Monthly expenses</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 240, marginTop: 16, paddingBottom: 4 }}>
              {bars.map((h, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 2 }}>
                  <div style={{ height: h * 0.42, background: SVC.heating, borderRadius: '3px 3px 0 0' }} />
                  <div style={{ height: h * 0.32, background: SVC.electricity }} />
                  <div style={{ height: h * 0.26, background: SVC.gas, borderRadius: '0 0 3px 3px' }} />
                </div>
              ))}
            </div>
          </BackdropCard>
        </div>
      </div>
    </div>
  );
}

// ─── Toast scene (dimmed dashboard + bottom-right stack) ────────────────────
function I9ToastStack({ theme = 'light', height = 760 }) {
  const z = window.I9[theme];
  return (
    <div style={{
      position: 'relative', height, overflow: 'hidden',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      fontFeatureSettings: '"cv11" 1, "ss01" 1',
      background: z.background, color: z.foreground, WebkitFontSmoothing: 'antialiased',
    }}>
      {/* Real chrome + dimmed page content */}
      <window.I9TopBar theme={theme} />
      <div style={{ opacity: 0.5, pointerEvents: 'none', filter: 'saturate(0.9)' }}>
        <DashboardBackdrop theme={theme} />
      </div>
      {/* Scrim to push content back so toasts read as foreground */}
      <div style={{ position: 'absolute', inset: '64px 0 0', background: theme === 'light' ? 'rgba(255,255,255,0.35)' : 'rgba(9,9,11,0.45)', pointerEvents: 'none' }} />

      {/* Bottom-right toast stack */}
      <div style={{ position: 'absolute', right: 24, bottom: 24, display: 'flex', flexDirection: 'column', gap: 12, zIndex: 5 }}>
        <Toast theme={theme} icon={CheckCircle} iconColor={theme === 'light' ? '#16a34a' : '#22c55e'} message="Payment recorded." />
        <Toast theme={theme} icon={XCircle} iconColor={theme === 'light' ? '#dc2626' : '#f87171'} message="Couldn't save your changes. Please try again." />
        <Toast theme={theme} icon={ClockIco} iconColor={z.mutedFg} message="Your session expired. Please sign in again." />
      </div>
    </div>
  );
}

// ─── Mobile backdrop + scene (390px) ────────────────────────────────────────
function DashboardBackdropMobile({ theme }) {
  const z = window.I9[theme];
  const dest = theme === 'light' ? '#dc2626' : '#f87171';
  const succ = theme === 'light' ? '#16a34a' : '#22c55e';
  const props = [
    ['Apartment on Main St', '−890 UAH', dest],
    ["Mom\u2019s apartment", '−350 UAH', dest],
    ['Summer house', '+350 UAH', succ],
  ];
  const bars = [60, 54, 62, 70, 96, 150, 188, 210, 226, 200, 150, 96];
  return (
    <div style={{ padding: '20px 14px 32px' }}>
      <h2 style={{ margin: '0 0 18px', fontSize: 22, fontWeight: 700, letterSpacing: -0.5, color: z.foreground }}>Hi, Anna</h2>
      <BackdropCard theme={theme} style={{ padding: 0, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ padding: '16px 18px', borderBottom: `1px solid ${z.border}` }}>
          <div style={{ fontSize: 11.5, fontWeight: 500, color: z.mutedFg, textTransform: 'uppercase', letterSpacing: 0.2 }}>Current balance</div>
          <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: -0.8, color: dest, marginTop: 8, fontFeatureSettings: '"tnum" 1' }}>−1,240 <span style={{ fontSize: 14, fontWeight: 500 }}>UAH</span></div>
        </div>
        {props.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderBottom: i < 2 ? `1px solid ${z.border}` : 'none' }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: z.muted }} />
            <div style={{ flex: 1, fontSize: 13, fontWeight: 500, color: z.foreground }}>{p[0]}</div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: p[2], fontFeatureSettings: '"tnum" 1' }}>{p[1]}</div>
          </div>
        ))}
      </BackdropCard>
      <BackdropCard theme={theme} style={{ padding: 16 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: z.foreground }}>Monthly expenses</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 150, marginTop: 14 }}>
          {bars.map((h, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 2 }}>
              <div style={{ height: h * 0.28, background: SVC.heating, borderRadius: '3px 3px 0 0' }} />
              <div style={{ height: h * 0.22, background: SVC.electricity }} />
              <div style={{ height: h * 0.18, background: SVC.gas, borderRadius: '0 0 3px 3px' }} />
            </div>
          ))}
        </div>
      </BackdropCard>
    </div>
  );
}

function I9ToastStackMobile({ theme = 'light', height = 800 }) {
  const z = window.I9[theme];
  return (
    <div style={{
      position: 'relative', width: 390, height, overflow: 'hidden',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      fontFeatureSettings: '"cv11" 1, "ss01" 1',
      background: z.background, color: z.foreground, WebkitFontSmoothing: 'antialiased',
    }}>
      <window.I9MobileTopBar theme={theme} />
      <div style={{ opacity: 0.5, pointerEvents: 'none', filter: 'saturate(0.9)' }}>
        <DashboardBackdropMobile theme={theme} />
      </div>
      <div style={{ position: 'absolute', inset: '52px 0 0', background: theme === 'light' ? 'rgba(255,255,255,0.35)' : 'rgba(9,9,11,0.45)', pointerEvents: 'none' }} />

      {/* Full-width bottom-anchored stack (sonner mobile) */}
      <div style={{ position: 'absolute', left: 16, right: 16, bottom: 16, display: 'flex', flexDirection: 'column', gap: 10, zIndex: 5 }}>
        <Toast theme={theme} width="100%" icon={CheckCircle} iconColor={theme === 'light' ? '#16a34a' : '#22c55e'} message="Payment recorded." />
        <Toast theme={theme} width="100%" icon={XCircle} iconColor={theme === 'light' ? '#dc2626' : '#f87171'} message="Couldn't save your changes. Please try again." />
        <Toast theme={theme} width="100%" icon={ClockIco} iconColor={z.mutedFg} message="Your session expired. Please sign in again." />
      </div>
    </div>
  );
}

Object.assign(window, { I9ToastStack, I9ToastStackMobile });
