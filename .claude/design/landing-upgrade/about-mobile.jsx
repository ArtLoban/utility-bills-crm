// About — mobile (single-column). Reuses MobileHeader, aboutProse, aboutLinks,
// LZ/DZ, IcoArrow from the shared global scope.

function AboutMobilePage({ theme }) {
  const dark = theme === 'dark';
  const t = dark ? DZ : LZ;
  return (
    <div className={`lu-root ${dark ? 'lu-dark' : 'lu-light'}`} style={{ background: t.bg, color: t.fg, fontFamily: 'Inter, system-ui, sans-serif', WebkitFontSmoothing: 'antialiased' }}>
      <MobileHeader t={t} dark={dark} />

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '56px 0 56px' }}>
        <div style={{ position: 'absolute', top: -90, right: -120, width: 460, height: 420, background: `radial-gradient(ellipse at 70% 30%, ${dark ? 'rgba(139,92,246,0.30)' : 'rgba(124,58,237,0.18)'} 0%, transparent 62%)`, pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', top: 30, right: 40, width: 300, height: 280, background: `radial-gradient(ellipse at center, ${dark ? 'rgba(91,33,182,0.34)' : 'rgba(91,33,182,0.12)'} 0%, transparent 66%)`, pointerEvents: 'none' }}></div>
        <div style={{ position: 'relative', padding: '0 20px' }}>
          <h1 style={{ fontSize: 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: '-0.03em', color: t.fg, marginBottom: 18, textWrap: 'pretty' }}>Hi, I'm Art.</h1>
          <p style={{ fontSize: 18, lineHeight: 1.5, color: t.fg, fontWeight: 400, marginBottom: 7 }}>Frontend developer. React, TypeScript, complex UIs.</p>
          <p style={{ fontSize: 15, color: t.mutedFg }}>Working remotely, based in Ukraine.</p>
        </div>
      </section>

      {/* What I work with */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '56px 0', background: t.bg, borderTop: `1px solid ${t.border}` }}>
        <div style={{ position: 'absolute', bottom: -110, left: -120, width: 440, height: 380, background: `radial-gradient(ellipse at 30% 70%, ${dark ? 'rgba(139,92,246,0.22)' : 'rgba(124,58,237,0.12)'} 0%, transparent 64%)`, pointerEvents: 'none' }}></div>
        <div style={{ position: 'relative', padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {aboutProse.map((para, i) => (
            <p key={i} style={{ fontSize: i === 0 ? 18 : 16, lineHeight: 1.75, color: i === 0 ? t.fg : t.sub, fontWeight: i === 0 ? 500 : 400, textWrap: 'pretty' }}>{para}</p>
          ))}
        </div>
      </section>

      {/* Links */}
      <section style={{ padding: '56px 0', background: t.bg, borderTop: `1px solid ${t.border}` }}>
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 24 }}>
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
      </section>

      {/* Footer — stacked */}
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

Object.assign(window, { AboutMobilePage });
