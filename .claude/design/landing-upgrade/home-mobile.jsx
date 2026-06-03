// Home — mobile (single-column reflow). Reuses tokens (LZ/DZ), homeFeatures,
// LogoMark, MockupFrame and the dark app mockups from the other JSX files
// (shared global lexical scope). Desktop app mockups are scaled to the phone
// width via `zoom` so they read as crisp scaled screenshots.

function MobileHeader({ t, dark }) {
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: t.headerBg, borderBottom: `1px solid ${t.border}` }}>
      <div style={{ padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: 56, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <LogoMark />
            <span style={{ fontSize: 14.5, fontWeight: 600, color: t.fg, letterSpacing: '-0.2px' }}>Utility Bills CRM</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${t.border}`, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.mutedFg }}>
              {dark ? <IcoMoon size={16} /> : <IcoSun size={16} />}
            </button>
            <button style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${t.border}`, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.fg }}>
              <IcoMenu size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

// scaled mockup: render the desktop app UI at MOCK_W then zoom to the column.
function MobileMockup({ url, glowColor, children }) {
  const MOCK_W = 820, COL_W = 350;
  return (
    <div style={{ width: MOCK_W, zoom: COL_W / MOCK_W }}>
      <MockupFrame url={url} glowColor={glowColor}>{children}</MockupFrame>
    </div>
  );
}

function MobileBand({ children }) {
  return (
    <section style={{ background: '#5b5b60', padding: '56px 0', overflow: 'hidden' }}>
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {children}
      </div>
    </section>
  );
}

function HomeMobilePage({ theme }) {
  const dark = theme === 'dark';
  const t = dark ? DZ : LZ;
  const cardBg = dark ? t.card : '#ffffff';
  return (
    <div className={`lu-root ${dark ? 'lu-dark' : 'lu-light'}`} style={{ background: t.bg, color: t.fg, fontFamily: 'Inter, system-ui, sans-serif', WebkitFontSmoothing: 'antialiased' }}>
      <MobileHeader t={t} dark={dark} />

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '52px 0 64px' }}>
        <div style={{ position: 'absolute', top: -90, right: -120, width: 460, height: 420, background: `radial-gradient(ellipse at 70% 30%, ${dark ? 'rgba(139,92,246,0.30)' : 'rgba(124,58,237,0.18)'} 0%, transparent 62%)`, pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', top: 30, right: 40, width: 300, height: 280, background: `radial-gradient(ellipse at center, ${dark ? 'rgba(91,33,182,0.34)' : 'rgba(91,33,182,0.12)'} 0%, transparent 66%)`, pointerEvents: 'none' }}></div>
        <div style={{ position: 'relative', padding: '0 20px' }}>
          <div style={{ display: 'flex', width: 'fit-content', alignItems: 'center', gap: 7, whiteSpace: 'nowrap', fontSize: 12.5, fontWeight: 500, color: t.accentText, background: t.ebBg, border: `1px solid ${t.ebBorder}`, borderRadius: 999, marginBottom: 22, padding: '5px 13px 6px' }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="0.5" y="0.5" width="4" height="4" rx="0.75" fill={t.accentText} />
              <rect x="7.5" y="0.5" width="4" height="4" rx="0.75" fill={t.accentText} opacity="0.5" />
              <rect x="0.5" y="7.5" width="4" height="4" rx="0.75" fill={t.accentText} opacity="0.5" />
              <rect x="7.5" y="7.5" width="4" height="4" rx="0.75" fill={t.accentText} opacity="0.3" />
            </svg>
            Portfolio project
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: '-0.03em', color: t.fg, marginBottom: 22, textWrap: 'pretty' }}>Utility Bills CRM</h1>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: t.mutedFg, textWrap: 'pretty' }}>
            A multi-tenant web application for tracking utility bills across multiple properties — apartments, houses, summer homes. Log meter readings, record bills and payments, see balances and consumption analytics over time.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.65, color: t.mutedFg, marginTop: 16, opacity: 0.85 }}>
            Built as a portfolio piece and a real product. The first user is the author's wife, who's been tracking two apartments in a paper notebook for years.
          </p>
        </div>
      </section>

      {/* Dashboard mockup band */}
      <MobileBand>
        <MobileMockup url="app.utilitybills.dev/dashboard"><DarkDashboardMockup /></MobileMockup>
        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <p style={{ fontSize: 14, lineHeight: 1.65, color: '#e4e4e7', textWrap: 'pretty' }}>
            <strong style={{ color: '#fafafa', fontWeight: 600 }}>Dashboard.</strong> Balance summary across all properties, expense breakdown by service, monthly trends, and consumption analytics with switchable money/units view.
          </p>
        </div>
      </MobileBand>

      {/* Features — single column */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '64px 0', background: t.bg }}>
        <div style={{ position: 'absolute', bottom: -110, left: -120, width: 460, height: 400, background: `radial-gradient(ellipse at 30% 70%, ${dark ? 'rgba(139,92,246,0.26)' : 'rgba(124,58,237,0.16)'} 0%, transparent 62%)`, pointerEvents: 'none' }}></div>
        <div style={{ position: 'relative', padding: '0 20px' }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 12.5, fontWeight: 500, color: t.accentText, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 12 }}>Features</div>
            <h2 style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em', color: t.fg, lineHeight: 1.15, textWrap: 'pretty' }}>Built around how households actually work</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {homeFeatures.map(({ Icon, color, title, body }) => (
              <div key={title} className="lu-card" style={{ background: cardBg, border: `1px solid ${t.border}`, borderRadius: 12, padding: '24px', boxShadow: dark ? 'none' : '0 1px 2px rgba(0,0,0,0.04)' }}>
                <div style={{ width: 44, height: 44, borderRadius: 11, background: color + (dark ? '24' : '18'), border: `1px solid ${color}${dark ? '4d' : '33'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, marginBottom: 16 }}>
                  <Icon size={22} />
                </div>
                <div style={{ fontSize: 16.5, fontWeight: 600, color: t.fg, marginBottom: 9, letterSpacing: '-0.2px' }}>{title}</div>
                <p style={{ fontSize: 14.5, lineHeight: 1.65, color: t.mutedFg, textWrap: 'pretty' }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Property mockup band */}
      <MobileBand>
        <MobileMockup url="app.utilitybills.dev/properties/1" glowColor="rgba(124,58,237,0.28)"><DarkPropertyMockup /></MobileMockup>
        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <p style={{ fontSize: 14, lineHeight: 1.65, color: '#e4e4e7', textWrap: 'pretty' }}>
            <strong style={{ color: '#fafafa', fontWeight: 600 }}>Property detail.</strong> Each property holds its own services with full contract history — provider changes, tariff changes, account number changes, all preserved.
          </p>
        </div>
      </MobileBand>

      {/* Tech */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '64px 0', background: t.bg }}>
        <div style={{ position: 'absolute', bottom: -110, left: -120, width: 440, height: 380, background: `radial-gradient(ellipse at 30% 70%, ${dark ? 'rgba(139,92,246,0.26)' : 'rgba(124,58,237,0.16)'} 0%, transparent 62%)`, pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', top: -90, right: -120, width: 440, height: 380, background: `radial-gradient(ellipse at 70% 30%, ${dark ? 'rgba(139,92,246,0.26)' : 'rgba(124,58,237,0.16)'} 0%, transparent 62%)`, pointerEvents: 'none' }}></div>
        <div style={{ position: 'relative', padding: '0 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 12.5, fontWeight: 500, color: t.accentText, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 12 }}>Stack</div>
          <h2 style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', color: t.fg, marginBottom: 20, lineHeight: 1.15 }}>How it's built</h2>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: t.mutedFg }}>
            Built with <strong style={{ color: t.fg, fontWeight: 500 }}>Next.js</strong>, <strong style={{ color: t.fg, fontWeight: 500 }}>TypeScript</strong>, <strong style={{ color: t.fg, fontWeight: 500 }}>PostgreSQL</strong>, <strong style={{ color: t.fg, fontWeight: 500 }}>Drizzle ORM</strong>, <strong style={{ color: t.fg, fontWeight: 500 }}>Auth.js</strong>, <strong style={{ color: t.fg, fontWeight: 500 }}>shadcn/ui</strong>, and <strong style={{ color: t.fg, fontWeight: 500 }}>Tailwind</strong>.
          </p>
          <span className="lu-link" style={{ color: t.accentText, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 22, fontSize: 15.5, cursor: 'pointer' }}>
            Architecture deep-dive <IcoArrow size={15} />
          </span>
        </div>
      </section>

      {/* Footer — stacked, matches band */}
      <footer style={{ background: '#5b5b60' }}>
        <div style={{ padding: '32px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <span className="lu-footlink" style={{ fontSize: 14.5, color: '#e4e4e7' }}>About the developer</span>
          <span className="lu-footlink" style={{ fontSize: 14.5, color: '#e4e4e7' }}>Architecture &amp; code</span>
          <span style={{ fontSize: 13, color: '#b9b9bf' }}>© 2026 · Utility Bills CRM</span>
        </div>
      </footer>
    </div>
  );
}

Object.assign(window, { HomeMobilePage });
