// Project — mobile (single-column). Reuses MobileHeader, PR_* data, SchemaPanel,
// IcoGithub, IcoArrow, LZ/DZ from the shared global scope.

function ProjectMobilePage({ theme }) {
  const dark = theme === 'dark';
  const t = dark ? DZ : LZ;
  const cardBg = dark ? t.card : '#ffffff';
  const chipBorder = dark ? '#3f3f46' : t.border;
  const SCHEMA_W = 620, COL_W = 350;
  return (
    <div className={`lu-root ${dark ? 'lu-dark' : 'lu-light'}`} style={{ background: t.bg, color: t.fg, fontFamily: 'Inter, system-ui, sans-serif', WebkitFontSmoothing: 'antialiased' }}>
      <MobileHeader t={t} dark={dark} />

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '56px 0 56px' }}>
        <div style={{ position: 'absolute', top: -90, right: -120, width: 460, height: 420, background: `radial-gradient(ellipse at 70% 30%, ${dark ? 'rgba(139,92,246,0.30)' : 'rgba(124,58,237,0.18)'} 0%, transparent 62%)`, pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', top: 30, right: 40, width: 300, height: 280, background: `radial-gradient(ellipse at center, ${dark ? 'rgba(91,33,182,0.34)' : 'rgba(91,33,182,0.12)'} 0%, transparent 66%)`, pointerEvents: 'none' }}></div>
        <div style={{ position: 'relative', padding: '0 20px' }}>
          <h1 style={{ fontSize: 38, fontWeight: 600, lineHeight: 1.08, letterSpacing: '-0.03em', color: t.fg, marginBottom: 20, textWrap: 'pretty' }}>Utility Bills CRM</h1>
          <p style={{ fontSize: 16.5, lineHeight: 1.65, color: t.mutedFg, marginBottom: 28, textWrap: 'pretty' }}>
            A multi-tenant web application for utility bill tracking, built as both a real product and a senior-level engineering practice ground. The page below walks through the stack, architecture, and the decisions behind them.
          </p>
          <button style={{ fontSize: 15, fontWeight: 500, color: '#fff', padding: '11px 20px', borderRadius: 8, border: 'none', background: '#7c3aed', cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 9, boxShadow: '0 2px 8px rgba(124,58,237,0.35)' }}>
            <IcoGithub size={17} /> View on GitHub
          </button>
        </div>
      </section>

      {/* Stack — stacked columns */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '56px 0', background: t.bg, borderTop: `1px solid ${t.border}` }}>
        <div style={{ position: 'absolute', bottom: -110, left: -120, width: 440, height: 380, background: `radial-gradient(ellipse at 30% 70%, ${dark ? 'rgba(139,92,246,0.20)' : 'rgba(124,58,237,0.10)'} 0%, transparent 64%)`, pointerEvents: 'none' }}></div>
        <div style={{ position: 'relative', padding: '0 20px' }}>
          <div style={{ fontSize: 12.5, fontWeight: 500, color: t.accentText, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 12 }}>Stack</div>
          <h2 style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em', color: t.fg, marginBottom: 32, lineHeight: 1.15 }}>At a glance</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {[['Frontend', PR_frontendChips], ['Backend', PR_backendChips]].map(([heading, chips]) => (
              <div key={heading}>
                <div style={{ fontSize: 13, fontWeight: 600, color: t.fg, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>{heading}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
                  {chips.map((c) => (
                    <span key={c} className="lu-chip" style={{ fontSize: 13.5, color: t.sub, padding: '6px 13px', borderRadius: 7, border: `1px solid ${chipBorder}`, background: cardBg, whiteSpace: 'nowrap' }}>{c}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture — single column */}
      <section style={{ padding: '56px 0', background: t.bg, borderTop: `1px solid ${t.border}` }}>
        <div style={{ padding: '0 20px' }}>
          <div style={{ fontSize: 12.5, fontWeight: 500, color: t.accentText, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 12 }}>Architecture</div>
          <h2 style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em', color: t.fg, marginBottom: 28, lineHeight: 1.15 }}>Six decisions worth explaining</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {PR_archCards.map(({ Icon, color, title, body }) => (
              <div key={title} className="lu-card" style={{ background: cardBg, border: `1px solid ${t.border}`, borderRadius: 12, padding: '24px', boxShadow: dark ? 'none' : '0 1px 2px rgba(0,0,0,0.04)' }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: color + (dark ? '24' : '18'), border: `1px solid ${color}${dark ? '4d' : '33'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, marginBottom: 16 }}>
                  <Icon size={20} />
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: t.fg, marginBottom: 10, letterSpacing: '-0.2px' }}>{title}</div>
                <p className="lu-arch-body" style={{ fontSize: 14, lineHeight: 1.7, color: t.mutedFg, textWrap: 'pretty' }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Schema — dark editor panel scaled to phone */}
      <section style={{ background: '#5b5b60', padding: '56px 0', overflow: 'hidden' }}>
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '100%', marginBottom: 24 }}>
            <div style={{ fontSize: 12.5, fontWeight: 500, color: '#cbb6f5', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 10 }}>Data model</div>
            <h2 style={{ fontSize: 27, fontWeight: 600, letterSpacing: '-0.02em', color: '#ffffff', lineHeight: 1.15 }}>One tree, every entity</h2>
          </div>
          <div style={{ width: SCHEMA_W, zoom: COL_W / SCHEMA_W }}>
            <SchemaPanel />
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.65, color: '#e4e4e7', marginTop: 24, textWrap: 'pretty' }}>
            Full schema in the GitHub repository — Drizzle definitions, exclusion constraints, indexes, the lot.
          </p>
        </div>
      </section>

      {/* Status */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '56px 0', background: t.bg }}>
        <div style={{ position: 'absolute', top: -90, right: -120, width: 420, height: 360, background: `radial-gradient(ellipse at 70% 30%, ${dark ? 'rgba(139,92,246,0.20)' : 'rgba(124,58,237,0.10)'} 0%, transparent 64%)`, pointerEvents: 'none' }}></div>
        <div style={{ position: 'relative', padding: '0 20px' }}>
          <h2 style={{ fontSize: 27, fontWeight: 600, letterSpacing: '-0.02em', color: t.fg, marginBottom: 26, lineHeight: 1.15 }}>Status</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {PR_status.map(({ lead, rest }) => (
              <p key={lead} style={{ fontSize: 15, lineHeight: 1.75, color: t.mutedFg, textWrap: 'pretty' }}>
                <strong style={{ color: t.fg, fontWeight: 600 }}>{lead}</strong>{rest}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Links */}
      <section style={{ padding: '56px 0', background: t.bg, borderTop: `1px solid ${t.border}` }}>
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {PR_links.map(({ label, caption }) => (
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

Object.assign(window, { ProjectMobilePage });
