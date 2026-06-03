// Project page — elevated (light + dark). Technical deep-dive.
// Amplified hero glow, subtle service-color accents on architecture cards,
// schema tree on a dark editor-style panel (the contrast moment), GitHub CTA.
// Reuses Ico, IcoUsers, IcoArrow, SVC, LZ/DZ, PubHeader, LandingFooter.

const IcoGithub = ({ size }) => <Ico size={size}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></Ico>;
const IcoLayers = ({ size }) => <Ico size={size}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></Ico>;
const IcoDB     = ({ size }) => <Ico size={size}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/></Ico>;
const IcoCode   = ({ size }) => <Ico size={size}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></Ico>;
const IcoShield = ({ size }) => <Ico size={size}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></Ico>;
const IcoScale  = ({ size }) => <Ico size={size}><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10M12 3v18M3 7h2c2 0 4-1 6-2s4-2 6-2h2"/></Ico>;

const PR_frontendChips = ['Next.js','TypeScript','Tailwind v4','shadcn/ui','Radix','TanStack Table','React Hook Form','Zod','Recharts','next-intl','next-themes','sonner'];
const PR_backendChips  = ['Next.js Server Components & Actions','PostgreSQL','Drizzle ORM','drizzle-zod','Auth.js v5','pino','Sentry'];

const PR_archCards = [
  { Icon: IcoLayers, color: SVC.electricity, title: 'Next.js full-stack with RSC',
    body: <>One codebase, no separate API layer. Server Components fetch from the database directly; Server Actions handle mutations with typed validation. No type duplication, no CORS, no version skew between services.</> },
  { Icon: IcoDB, color: SVC.water, title: 'PostgreSQL with temporal data',
    body: <>Tariffs, account numbers, payment details — anything that changes over time — is stored with <code>validFrom</code> / <code>validTo</code> intervals using half-open semantics <code>[start, end)</code>. Past months recompute correctly using whichever rate was valid then.</> },
  { Icon: IcoCode, color: SVC.internet, title: 'Drizzle ORM, not Prisma',
    body: <>Drizzle keeps SQL visible — schema-as-TypeScript, but queries that read like SQL. Better fit for the learning goal, better fit for serverless connection patterns, and <code>drizzle-zod</code> removes a whole class of schema/validation duplication.</> },
  { Icon: IcoShield, color: SVC.gas, title: 'Auth.js with database sessions',
    body: <>Sliding expiration, immediate revocation, and a "Remember me" 30-day cap that forces conscious re-authentication. The OAuth flow is delegated to the library; sessions live in the database where revoking them takes one row update.</> },
  { Icon: IcoScale, color: SVC.electricity, title: 'Ledger-style accounting',
    body: <>Bills and payments are independent records. There is no "this payment pays that bill" relationship — balance is derived from <code>sum(bills) − sum(payments)</code>. Matches how households actually think about their utilities and stays correct when amounts don't line up perfectly.</> },
  { Icon: IcoUsers, color: SVC.water, title: 'Multi-tenant from day one',
    body: <>Every entity carries an owner reference. Every query filters by access through typed helpers like <code>accessibleProperties(userId)</code>. Multi-tenancy is in the data model, not bolted on later — and that decision shapes auth, sharing, soft-delete, and admin all at once.</> },
];

const PR_schemaLines = [
  'User',
  '├── PropertyAccess (role: owner / editor / viewer)',
  '└── Property',
  '    ├── Service (electricity, gas, water, …)',
  '    │   ├── Contract (provider, period)',
  '    │   │   ├── Tariff (rates over time)',
  '    │   │   ├── AccountNumber (over time)',
  '    │   │   └── PaymentDetails (over time)',
  '    │   ├── Bill (period, amount)',
  '    │   └── Payment (date, amount)',
  '    └── Meter (physical device)',
  '        └── Reading (date, value(s))',
];

const PR_status = [
  { lead: 'Where it is now.', rest: ' The app is in active development. Architecture is finalized, the data model is implemented, the UI is being built screen by screen. The first real user — the author\u2019s wife — is testing flows as they ship.' },
  { lead: 'v1 (in progress).', rest: ' Public landing, authenticated CRM, multi-user sharing, admin section with landing CMS, three languages, light/dark theme.' },
  { lead: 'Beyond v1.', rest: ' File storage (Google Drive), Telegram notifications, custom services, export, OCR for scanned bills, provider integrations. Roadmap detail in the README.' },
  { lead: 'Hosted on', rest: ' Vercel (app) and Neon (database).' },
];

const PR_links = [
  { label: 'GitHub', caption: 'full source, README, decision log.' },
  { label: 'Live demo', caption: 'view-only, with sample data.' },
  { label: 'About me', caption: 'who built this.' },
];

// editor-panel renderer for the schema tree — syntax-tinted on dark.
function SchemaPanel() {
  const mono = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";
  const renderLine = (line, i) => {
    const m = line.match(/^([\s│├└─]*)([A-Za-z]+)?(.*)$/);
    const prefix = m ? m[1] : '';
    const name = m ? (m[2] || '') : line;
    const rest = m ? m[3] : '';
    return (
      <div key={i} style={{ whiteSpace: 'pre', lineHeight: 1.85 }}>
        <span style={{ color: '#3f3f46' }}>{prefix}</span>
        <span style={{ color: '#e4e4e7', fontWeight: 600 }}>{name}</span>
        <span style={{ color: '#71717a' }}>{rest}</span>
      </div>
    );
  };
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 760 }}>
      {/* violet glow beneath */}
      <div style={{ position: 'absolute', left: '50%', bottom: -32, transform: 'translateX(-50%)', width: '72%', height: 130, background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.34) 0%, transparent 70%)', filter: 'blur(26px)', pointerEvents: 'none', zIndex: 0 }}></div>
      <div style={{ position: 'relative', zIndex: 1, borderRadius: 12, overflow: 'hidden', border: '1px solid #27272a', boxShadow: '0 24px 70px rgba(0,0,0,0.5), 0 6px 18px rgba(0,0,0,0.4)', background: '#0d0d11' }}>
        {/* editor title bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 42, padding: '0 16px', background: '#141417', borderBottom: '1px solid #27272a' }}>
          <div style={{ display: 'flex', gap: 7 }}>
            {['#3f3f46', '#3f3f46', '#3f3f46'].map((c, i) => <div key={i} style={{ width: 11, height: 11, borderRadius: '50%', background: c }}></div>)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginLeft: 4 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/></svg>
            <span style={{ fontSize: 12, color: '#a1a1aa', fontFamily: mono }}>data-model.txt</span>
          </div>
        </div>
        {/* body */}
        <div style={{ display: 'flex', fontFamily: mono, fontSize: 13.5 }}>
          {/* gutter */}
          <div style={{ padding: '20px 0', background: '#0b0b0e', borderRight: '1px solid #1f1f23', textAlign: 'right', userSelect: 'none' }}>
            {PR_schemaLines.map((_, i) => (
              <div key={i} style={{ lineHeight: 1.85, color: '#3f3f46', padding: '0 14px', fontSize: 12.5 }}>{i + 1}</div>
            ))}
          </div>
          <div style={{ padding: '20px 22px', overflowX: 'auto', flex: 1 }}>
            {PR_schemaLines.map(renderLine)}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectPage({ theme }) {
  const dark = theme === 'dark';
  const t = dark ? DZ : LZ;
  const cardBg = dark ? t.card : '#ffffff';
  const chipBorder = dark ? '#3f3f46' : t.border;
  return (
    <div className={`lu-root ${dark ? 'lu-dark' : 'lu-light'}`} style={{ background: t.bg, color: t.fg, fontFamily: 'Inter, system-ui, sans-serif', WebkitFontSmoothing: 'antialiased' }}>
      <PubHeader t={t} dark={dark} active="Project" />

      {/* § 1 Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '104px 0 96px' }}>
        <div style={{ position: 'absolute', top: -160, right: -120, width: 760, height: 620, background: `radial-gradient(ellipse at 70% 30%, ${dark ? 'rgba(139,92,246,0.30)' : 'rgba(124,58,237,0.18)'} 0%, transparent 62%)`, pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', top: 40, right: 200, width: 480, height: 420, background: `radial-gradient(ellipse at center, ${dark ? 'rgba(91,33,182,0.34)' : 'rgba(91,33,182,0.12)'} 0%, transparent 66%)`, pointerEvents: 'none' }}></div>
        <div style={{ position: 'relative', maxWidth: 1100, margin: '0 auto', padding: '0 28px' }}>
          <h1 style={{ fontSize: 60, fontWeight: 600, lineHeight: 1.06, letterSpacing: '-0.035em', color: t.fg, marginBottom: 24, maxWidth: 760, textWrap: 'pretty' }}>Utility Bills CRM</h1>
          <p style={{ fontSize: 19, lineHeight: 1.65, color: t.mutedFg, maxWidth: 600, marginBottom: 34, textWrap: 'pretty' }}>
            A multi-tenant web application for utility bill tracking, built as both a real product and a senior-level engineering practice ground. The page below walks through the stack, architecture, and the decisions behind them.
          </p>
          <button style={{ fontSize: 15, fontWeight: 500, color: '#fff', padding: '11px 20px', borderRadius: 8, border: 'none', background: '#7c3aed', cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 9, boxShadow: '0 2px 8px rgba(124,58,237,0.35)' }}>
            <IcoGithub size={17} /> View on GitHub
          </button>
        </div>
      </section>

      {/* § 2 Stack at a glance */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '92px 0', background: t.bg, borderTop: `1px solid ${t.border}` }}>
        <div style={{ position: 'absolute', bottom: -160, left: -120, width: 620, height: 520, background: `radial-gradient(ellipse at 30% 70%, ${dark ? 'rgba(139,92,246,0.20)' : 'rgba(124,58,237,0.10)'} 0%, transparent 64%)`, pointerEvents: 'none' }}></div>
        <div style={{ position: 'relative', maxWidth: 1100, margin: '0 auto', padding: '0 28px' }}>
          <div style={{ fontSize: 12.5, fontWeight: 500, color: t.accentText, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 12 }}>Stack</div>
          <h2 style={{ fontSize: 38, fontWeight: 600, letterSpacing: '-0.025em', color: t.fg, marginBottom: 40, lineHeight: 1.12 }}>At a glance</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
            {[['Frontend', PR_frontendChips], ['Backend', PR_backendChips]].map(([heading, chips]) => (
              <div key={heading}>
                <div style={{ fontSize: 13, fontWeight: 600, color: t.fg, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 18 }}>{heading}</div>
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

      {/* § 3 Architecture highlights — service-color accents */}
      <section style={{ padding: '92px 0', background: t.bg, borderTop: `1px solid ${t.border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 28px' }}>
          <div style={{ fontSize: 12.5, fontWeight: 500, color: t.accentText, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 12 }}>Architecture</div>
          <h2 style={{ fontSize: 38, fontWeight: 600, letterSpacing: '-0.025em', color: t.fg, marginBottom: 40, lineHeight: 1.12 }}>Six decisions worth explaining</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            {PR_archCards.map(({ Icon, color, title, body }) => (
              <div key={title} className="lu-card" style={{ background: cardBg, border: `1px solid ${t.border}`, borderRadius: 12, padding: '26px', boxShadow: dark ? 'none' : '0 1px 2px rgba(0,0,0,0.04)' }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: color + (dark ? '24' : '18'), border: `1px solid ${color}${dark ? '4d' : '33'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, marginBottom: 18 }}>
                  <Icon size={20} />
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: t.fg, marginBottom: 11, letterSpacing: '-0.2px' }}>{title}</div>
                <p className="lu-arch-body" style={{ fontSize: 14, lineHeight: 1.7, color: t.mutedFg, textWrap: 'pretty' }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* § 4 Schema — dark editor panel on a gray band (contrast moment) */}
      <section style={{ background: '#5b5b60', padding: '92px 0', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 28px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '100%', maxWidth: 760, marginBottom: 28 }}>
            <div style={{ fontSize: 12.5, fontWeight: 500, color: '#cbb6f5', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 10 }}>Data model</div>
            <h2 style={{ fontSize: 34, fontWeight: 600, letterSpacing: '-0.02em', color: '#ffffff', lineHeight: 1.12 }}>One tree, every entity</h2>
          </div>
          <SchemaPanel />
          <p style={{ fontSize: 14, lineHeight: 1.65, color: '#e4e4e7', maxWidth: 760, marginTop: 28, textWrap: 'pretty' }}>
            Full schema in the GitHub repository — Drizzle definitions, exclusion constraints, indexes, the lot.
          </p>
        </div>
      </section>

      {/* § 5 Status */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '92px 0', background: t.bg }}>
        <div style={{ position: 'absolute', top: -120, right: -120, width: 560, height: 480, background: `radial-gradient(ellipse at 70% 30%, ${dark ? 'rgba(139,92,246,0.20)' : 'rgba(124,58,237,0.10)'} 0%, transparent 64%)`, pointerEvents: 'none' }}></div>
        <div style={{ position: 'relative', maxWidth: 1100, margin: '0 auto', padding: '0 28px' }}>
          <h2 style={{ fontSize: 34, fontWeight: 600, letterSpacing: '-0.02em', color: t.fg, marginBottom: 32, lineHeight: 1.12 }}>Status</h2>
          <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 20 }}>
            {PR_status.map(({ lead, rest }) => (
              <p key={lead} style={{ fontSize: 15.5, lineHeight: 1.75, color: t.mutedFg, textWrap: 'pretty' }}>
                <strong style={{ color: t.fg, fontWeight: 600 }}>{lead}</strong>{rest}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* § 6 Links */}
      <section style={{ padding: '92px 0', background: t.bg, borderTop: `1px solid ${t.border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 28px' }}>
          <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 26 }}>
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
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}

Object.assign(window, { ProjectPage });
