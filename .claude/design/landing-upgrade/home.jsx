// Home page — elevated (light + dark). Copy & structure locked from baseline;
// visual treatment raised per the five moves. Inline-styled against theme
// tokens so light & dark coexist in one canvas document without class clashes.

const LZ = {
  bg: '#ffffff', fg: '#09090b', mutedFg: '#71717a', sub: '#52525b',
  border: '#e4e4e7', muted: '#f4f4f5', accent: '#7c3aed', accentText: '#7c3aed',
  ebBg: 'rgba(124,58,237,0.08)', ebBorder: 'rgba(124,58,237,0.20)',
  headerBg: '#ffffff'
};
const DZ = {
  bg: '#09090b', fg: '#fafafa', mutedFg: '#a1a1aa', sub: '#a1a1aa',
  border: '#27272a', card: '#18181b', muted: '#1f1f23', accent: '#7c3aed', accentText: '#a78bfa',
  ebBg: 'rgba(124,58,237,0.13)', ebBorder: 'rgba(124,58,237,0.30)',
  headerBg: '#09090b'
};

const LogoMark = () =>
<div style={{ width: 24, height: 24, background: '#7c3aed', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
    </svg>
  </div>;


function PubHeader({ t, dark, active }) {
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: t.headerBg, borderBottom: `1px solid ${t.border}` }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: 60, gap: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0 }}>
            <LogoMark />
            <span style={{ fontSize: 14.5, fontWeight: 600, color: t.fg, letterSpacing: '-0.2px' }}>Utility Bills CRM</span>
          </div>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, justifyContent: 'center' }}>
            {['Home', 'About', 'Project'].map((l) =>
            <span key={l} className="lu-navlink" style={{ fontSize: 14, color: l === active ? t.fg : t.mutedFg, fontWeight: l === active ? 500 : 400, padding: '6px 12px', borderRadius: 6 }}>{l}</span>
            )}
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <button style={{ width: 34, height: 34, borderRadius: 7, border: `1px solid ${t.border}`, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.mutedFg }}>
              {dark ? <IcoMoon size={15} /> : <IcoSun size={15} />}
            </button>
            <button className="lu-btn-ghost" style={{ fontSize: 14, fontWeight: 500, color: t.fg, padding: '8px 16px', borderRadius: 7, border: `1px solid ${t.border}`, background: 'transparent', cursor: 'pointer', fontFamily: 'inherit' }}>Sign in</button>
          </div>
        </div>
      </div>
    </header>);

}

// mockup band — neutral slab so the dark app frame reads as a product shot.
function MockupBand({ dark, children }) {
  return (
    <section style={{
      position: 'relative', background: '#5b5b60',
      padding: '108px 0', overflow: 'hidden',
    }}>
      <div style={{ position: 'relative', maxWidth: 1080, margin: '0 auto', padding: '0 28px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {children}
      </div>
    </section>);

}

function MockupCaption({ children }) {
  return (
    <div style={{ textAlign: 'center', marginTop: 44, maxWidth: 600 }}>
      <p style={{ fontSize: 14.5, lineHeight: 1.65, color: '#e4e4e7', textWrap: 'pretty' }}>{children}</p>
    </div>);

}

const homeFeatures = [
{ Icon: IcoUsers, color: SVC.electricity, title: 'Properties and people', body: 'Track multiple properties — apartments, houses, summer homes — and share access with family at owner, editor, or viewer level.' },
{ Icon: IcoHistory, color: SVC.gas, title: 'Tariffs change. History stays.', body: 'Every tariff, account number, and payment detail is stored with its validity period. Recompute past months correctly even after rates change.' },
{ Icon: IcoWallet, color: SVC.water, title: 'Bills and payments as a ledger', body: 'Bills and payments are independent records. Balance is derived. No forced "this payment pays that bill" links — just the math, the way real households do it.' },
{ Icon: IcoTrend, color: SVC.internet, title: 'From numbers to trends', body: 'Pie, stacked bar, and line charts show where money goes, how consumption shifts month to month, and whether things are getting better or worse.' }];


function HomePage({ theme }) {
  const dark = theme === 'dark';
  const t = dark ? DZ : LZ;
  const cardBg = dark ? t.card : '#ffffff';
  return (
    <div className={`lu-root ${dark ? 'lu-dark' : 'lu-light'}`} style={{ background: t.bg, color: t.fg, fontFamily: 'Inter, system-ui, sans-serif', WebkitFontSmoothing: 'antialiased' }}>
      <PubHeader t={t} dark={dark} active="Home" />

      {/* § 1 Hero — amplified glow */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '84px 0 116px' }}>
        {/* primary glow top-right */}
        <div style={{ position: 'absolute', top: -160, right: -120, width: 760, height: 620, background: `radial-gradient(ellipse at 70% 30%, ${dark ? 'rgba(139,92,246,0.30)' : 'rgba(124,58,237,0.18)'} 0%, transparent 62%)`, pointerEvents: 'none' }}></div>
        {/* deeper violet pool */}
        <div style={{ position: 'absolute', top: 40, right: 200, width: 480, height: 420, background: `radial-gradient(ellipse at center, ${dark ? 'rgba(91,33,182,0.34)' : 'rgba(91,33,182,0.12)'} 0%, transparent 66%)`, pointerEvents: 'none' }}></div>
        <div style={{ position: 'relative', maxWidth: 1100, margin: '0 auto', padding: '0 28px' }}>
          <div style={{ display: 'flex', width: 'fit-content', alignItems: 'center', gap: 7, whiteSpace: 'nowrap', fontSize: 12.5, fontWeight: 500, color: t.accentText, background: t.ebBg, border: `1px solid ${t.ebBorder}`, borderRadius: 999, marginBottom: 26, padding: "5px 13px 6px" }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="0.5" y="0.5" width="4" height="4" rx="0.75" fill={t.accentText} />
              <rect x="7.5" y="0.5" width="4" height="4" rx="0.75" fill={t.accentText} opacity="0.5" />
              <rect x="0.5" y="7.5" width="4" height="4" rx="0.75" fill={t.accentText} opacity="0.5" />
              <rect x="7.5" y="7.5" width="4" height="4" rx="0.75" fill={t.accentText} opacity="0.3" />
            </svg>
            Portfolio project
          </div>
          <h1 style={{ fontSize: 66, fontWeight: 600, lineHeight: 1.05, letterSpacing: '-0.035em', color: t.fg, marginBottom: 26, maxWidth: 820, textWrap: 'pretty' }}>Utility Bills CRM</h1>
          <p style={{ fontSize: 20, lineHeight: 1.6, color: t.mutedFg, maxWidth: 620, textWrap: 'pretty' }}>
            A multi-tenant web application for tracking utility bills across multiple properties — apartments, houses, summer homes. Log meter readings, record bills and payments, see balances and consumption analytics over time.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: t.mutedFg, maxWidth: 620, marginTop: 18, opacity: 0.85 }}>
            Built as a portfolio piece and a real product. The first user is the author's wife, who's been tracking two apartments in a paper notebook for years.
          </p>
        </div>
      </section>

      {/* § 2 Dashboard mockup — dark band */}
      <MockupBand dark={dark}>
        <div style={{ width: '100%', maxWidth: 1000 }}>
          <MockupFrame url="app.utilitybills.dev/dashboard">
            <DarkDashboardMockup />
          </MockupFrame>
        </div>
        <MockupCaption>
          <strong style={{ color: '#fafafa', fontWeight: 600 }}>Dashboard.</strong> Balance summary across all properties, expense breakdown by service, monthly trends, and consumption analytics with switchable money/units view.
        </MockupCaption>
      </MockupBand>

      {/* § 3 Feature grid */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '116px 0', background: t.bg }}>
        {/* violet glow — analogous to hero, bottom-left corner */}
        <div style={{ position: 'absolute', bottom: -180, left: -120, width: 720, height: 580, background: `radial-gradient(ellipse at 30% 70%, ${dark ? 'rgba(139,92,246,0.26)' : 'rgba(124,58,237,0.16)'} 0%, transparent 62%)`, pointerEvents: 'none' }}></div>
        <div style={{ position: 'relative', maxWidth: 1100, margin: '0 auto', padding: '0 28px' }}>
          <div style={{ marginBottom: 48, maxWidth: 620 }}>
            <div style={{ fontSize: 12.5, fontWeight: 500, color: t.accentText, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 14 }}>Features</div>
            <h2 style={{ fontSize: 42, fontWeight: 600, letterSpacing: '-0.025em', color: t.fg, lineHeight: 1.1, textWrap: 'pretty' }}>Built around how households actually work</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            {homeFeatures.map(({ Icon, color, title, body }) =>
            <div key={title} className="lu-card" style={{ background: cardBg, border: `1px solid ${t.border}`, borderRadius: 12, padding: '28px 28px 30px', boxShadow: dark ? 'none' : '0 1px 2px rgba(0,0,0,0.04)' }}>
                <div style={{ width: 46, height: 46, borderRadius: 11, background: color + (dark ? '24' : '18'), border: `1px solid ${color}${dark ? '4d' : '33'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, marginBottom: 20 }}>
                  <Icon size={23} />
                </div>
                <div style={{ fontSize: 17, fontWeight: 600, color: t.fg, marginBottom: 10, letterSpacing: '-0.2px' }}>{title}</div>
                <p style={{ fontSize: 14.5, lineHeight: 1.65, color: t.mutedFg, textWrap: 'pretty' }}>{body}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* § 4 Property mockup — dark band */}
      <MockupBand dark={dark}>
        <div style={{ width: '100%', maxWidth: 940 }}>
          <MockupFrame url="app.utilitybills.dev/properties/1" glowColor="rgba(124,58,237,0.28)">
            <DarkPropertyMockup />
          </MockupFrame>
        </div>
        <MockupCaption>
          <strong style={{ color: '#fafafa', fontWeight: 600 }}>Property detail.</strong> Each property holds its own services with full contract history — provider changes, tariff changes, account number changes, all preserved.
        </MockupCaption>
      </MockupBand>

      {/* § 5 Tech — narrow centered column */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '116px 0', background: t.bg }}>
        {/* violet glows — bottom-left + top-right corners */}
        <div style={{ position: 'absolute', bottom: -180, left: -120, width: 720, height: 580, background: `radial-gradient(ellipse at 30% 70%, ${dark ? 'rgba(139,92,246,0.26)' : 'rgba(124,58,237,0.16)'} 0%, transparent 62%)`, pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', top: -180, right: -120, width: 720, height: 580, background: `radial-gradient(ellipse at 70% 30%, ${dark ? 'rgba(139,92,246,0.26)' : 'rgba(124,58,237,0.16)'} 0%, transparent 62%)`, pointerEvents: 'none' }}></div>
        <div style={{ position: 'relative', maxWidth: 620, margin: '0 auto', padding: '0 28px', textAlign: 'center' }}>
          <div style={{ fontSize: 12.5, fontWeight: 500, color: t.accentText, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 14 }}>Stack</div>
          <h2 style={{ fontSize: 38, fontWeight: 600, letterSpacing: '-0.025em', color: t.fg, marginBottom: 24, lineHeight: 1.12 }}>How it's built</h2>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: t.mutedFg }}>
            Built with <strong style={{ color: t.fg, fontWeight: 500 }}>Next.js</strong>, <strong style={{ color: t.fg, fontWeight: 500 }}>TypeScript</strong>, <strong style={{ color: t.fg, fontWeight: 500 }}>PostgreSQL</strong>, <strong style={{ color: t.fg, fontWeight: 500 }}>Drizzle ORM</strong>, <strong style={{ color: t.fg, fontWeight: 500 }}>Auth.js</strong>, <strong style={{ color: t.fg, fontWeight: 500 }}>shadcn/ui</strong>, and <strong style={{ color: t.fg, fontWeight: 500 }}>Tailwind</strong>.
          </p>
          <span className="lu-link" style={{ color: t.accentText, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 24, fontSize: 15.5, cursor: 'pointer' }}>
            Architecture deep-dive <IcoArrow size={15} />
          </span>
        </div>
      </section>

      {/* § 6 Footer — matches the mockup band (gray bg, light text) */}
      <footer style={{ background: '#5b5b60' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28, padding: '38px 0' }}>
            <span className="lu-footlink" style={{ fontSize: 14, color: '#e4e4e7' }}>About the developer</span>
            <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.20)' }}></div>
            <span className="lu-footlink" style={{ fontSize: 14, color: '#e4e4e7' }}>Architecture &amp; code</span>
            <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.20)' }}></div>
            <span style={{ fontSize: 13, color: '#b9b9bf' }}>© 2026 · Utility Bills CRM</span>
          </div>
        </div>
      </footer>
    </div>);

}

Object.assign(window, { HomePage, LZ, DZ, PubHeader, LogoMark, MockupBand, MockupCaption });