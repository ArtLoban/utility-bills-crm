// About page — elevated (light + dark). Intentionally minimal (Decision #90).
// Amplified hero glow + larger greeting for consistency; sparse three-section
// structure and LinkedIn-only-style contact kept. The 4px hero bug is fixed.
// Reuses LZ/DZ, PubHeader, LogoMark, IcoArrow from the shared scope.

const aboutProse = [
  "Day-to-day: React with TypeScript, Next.js, modern data tables and visualizations, design systems.",
  "Comfortable with: state management at scale (Redux Toolkit, RTK Query), forms and validation, authentication, role-based access.",
  "Most of the last few years went into building a payment orchestration platform — a large back-office admin panel that grew to 50+ pages and a few thousand TypeScript files. This CRM is the next thing I'm building.",
];

const aboutLinks = [
  { label: 'LinkedIn', caption: 'full background, recommendations, work history.' },
  { label: 'GitHub', caption: 'code lives here.' },
  { label: 'About this project', caption: 'architecture, decisions, stack rationale.' },
];

function LandingFooter({ active }) {
  const link = (text) => <span className="lu-footlink" style={{ fontSize: 14, color: '#e4e4e7' }}>{text}</span>;
  return (
    <footer style={{ background: '#5b5b60' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28, padding: '38px 0' }}>
          {link('About the developer')}
          <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.20)' }}></div>
          {link('Architecture & code')}
          <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.20)' }}></div>
          <span style={{ fontSize: 13, color: '#b9b9bf' }}>© 2026 · Utility Bills CRM</span>
        </div>
      </div>
    </footer>
  );
}

function AboutPage({ theme }) {
  const dark = theme === 'dark';
  const t = dark ? DZ : LZ;
  return (
    <div className={`lu-root ${dark ? 'lu-dark' : 'lu-light'}`} style={{ background: t.bg, color: t.fg, fontFamily: 'Inter, system-ui, sans-serif', WebkitFontSmoothing: 'antialiased' }}>
      <PubHeader t={t} dark={dark} active="About" />

      {/* § 1 Hero — amplified glow + full-size greeting (4px bug fixed) */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '104px 0 96px' }}>
        <div style={{ position: 'absolute', top: -160, right: -120, width: 760, height: 620, background: `radial-gradient(ellipse at 70% 30%, ${dark ? 'rgba(139,92,246,0.30)' : 'rgba(124,58,237,0.18)'} 0%, transparent 62%)`, pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', top: 40, right: 200, width: 480, height: 420, background: `radial-gradient(ellipse at center, ${dark ? 'rgba(91,33,182,0.34)' : 'rgba(91,33,182,0.12)'} 0%, transparent 66%)`, pointerEvents: 'none' }}></div>
        <div style={{ position: 'relative', maxWidth: 1100, margin: '0 auto', padding: '0 28px' }}>
          <div style={{ maxWidth: 720 }}>
            <h1 style={{ fontSize: 64, fontWeight: 600, lineHeight: 1.06, letterSpacing: '-0.035em', color: t.fg, marginBottom: 22, textWrap: 'pretty' }}>Hi, I'm Art.</h1>
            <p style={{ fontSize: 20, lineHeight: 1.5, color: t.fg, fontWeight: 400, marginBottom: 8 }}>Frontend developer. React, TypeScript, complex UIs.</p>
            <p style={{ fontSize: 17, color: t.mutedFg }}>Working remotely, based in Ukraine.</p>
          </div>
        </div>
      </section>

      {/* § 2 What I work with — prose, lead first line */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '88px 0', background: t.bg, borderTop: `1px solid ${t.border}` }}>
        <div style={{ position: 'absolute', bottom: -180, left: -120, width: 680, height: 560, background: `radial-gradient(ellipse at 30% 70%, ${dark ? 'rgba(139,92,246,0.22)' : 'rgba(124,58,237,0.12)'} 0%, transparent 64%)`, pointerEvents: 'none' }}></div>
        <div style={{ position: 'relative', maxWidth: 1100, margin: '0 auto', padding: '0 28px' }}>
          <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 22 }}>
            {aboutProse.map((para, i) => (
              <p key={i} style={{ fontSize: i === 0 ? 19 : 16.5, lineHeight: 1.75, color: i === 0 ? t.fg : t.sub, fontWeight: i === 0 ? 500 : 400, textWrap: 'pretty' }}>{para}</p>
            ))}
          </div>
        </div>
      </section>

      {/* § 3 See more — links */}
      <section style={{ padding: '88px 0', background: t.bg, borderTop: `1px solid ${t.border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 28px' }}>
          <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 26 }}>
            {aboutLinks.map(({ label, caption }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span className="lu-link" style={{ fontSize: 17, fontWeight: 500, color: t.accentText, display: 'inline-flex', alignItems: 'center', gap: 7, cursor: 'pointer', width: 'fit-content' }}>
                  {label} <IcoArrow size={14} />
                </span>
                <span style={{ fontSize: 14.5, color: t.mutedFg }}>
                  <span style={{ color: dark ? '#3f3f46' : '#d4d4d8', margin: '0 4px 0 0' }}>—</span>{caption}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}

Object.assign(window, { AboutPage, LandingFooter });
