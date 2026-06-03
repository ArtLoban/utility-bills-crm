/* global React */
// Providers screen — light + dark theme.
// Depends on: dashboard.jsx (window.UB), iteration9.jsx (window.I9TopBar).

const { useState: pvUseState, useEffect: pvUseEffect, useRef: pvUseRef } = React;
const { Z, ACCENTS, Icon, TopBar, Button } = window.UB;
const PV_ACCENT = ACCENTS.violet;

// ── Extra icons ──────────────────────────────────────────────────────────────
const PvIco = {
  Phone: (p) => (
    <Icon size={p.size || 16} stroke={p.stroke || 'currentColor'}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 12 19.79 19.79 0 0 1 1.03 3.18C1.02 2.09 1.9 1 3.03 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 18z"/>
    </Icon>
  ),
  Globe: (p) => (
    <Icon size={p.size || 16} stroke={p.stroke || 'currentColor'}>
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
      <path d="M2 12h20"/>
    </Icon>
  ),
  Pencil: (p) => (
    <Icon size={p.size || 16} stroke={p.stroke || 'currentColor'}>
      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
      <path d="m15 5 4 4"/>
    </Icon>
  ),
  Trash: (p) => (
    <Icon size={p.size || 16} stroke={p.stroke || 'currentColor'}>
      <path d="M3 6h18"/>
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
    </Icon>
  ),
  Plus: (p) => (
    <Icon size={p.size || 16} stroke={p.stroke || 'currentColor'}>
      <path d="M5 12h14M12 5v14"/>
    </Icon>
  ),
};

// ── Tokens ───────────────────────────────────────────────────────────────────
const Z_DARK = {
  background: '#09090b', foreground: '#fafafa',
  card: '#18181b',       muted: '#27272a', mutedFg: '#a1a1aa',
  border: '#27272a',     destructive: '#f87171',
};

// Accent link color is brighter in dark (violet-400)
const PV_LINK = { light: '#7c3aed', dark: '#a78bfa' };

// ── Monogram palettes ────────────────────────────────────────────────────────
const MONO_PALETTE = [
  { color: '#f59e0b', bg: 'rgba(245,158,11,0.13)' },
  { color: '#ef4444', bg: 'rgba(239,68,68,0.12)'  },
  { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  { color: '#ec4899', bg: 'rgba(236,72,153,0.12)' },
  { color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
  { color: '#14b8a6', bg: 'rgba(20,184,166,0.12)' },
];
const MONO_PALETTE_DARK = [
  { color: '#fbbf24', bg: 'rgba(245,158,11,0.20)'  },
  { color: '#f87171', bg: 'rgba(239,68,68,0.18)'   },
  { color: '#60a5fa', bg: 'rgba(59,130,246,0.18)'  },
  { color: '#f472b6', bg: 'rgba(236,72,153,0.18)'  },
  { color: '#a78bfa', bg: 'rgba(139,92,246,0.18)'  },
  { color: '#2dd4bf', bg: 'rgba(20,184,166,0.18)'  },
];

// ── Provider data (verbatim from brief) ─────────────────────────────────────
const PROVIDERS = [
  { id: 1, name: 'Kyivenergo',    phone: '+380 44 207-00-00', website: null,            services: 2, notes: null },
  { id: 2, name: 'Naftogaz',      phone: null,                website: 'naftogaz.com',  services: 1, notes: null },
  { id: 3, name: 'YASNO',         phone: '+380 44 537-11-22', website: 'yasno.com.ua',  services: 1,
    notes: 'Switched to YASNO for electricity in March 2024 after the previous provider restructured. Their app shows readings and lets you pay with no commission. Support is responsive on weekdays but slow on weekends. Account manager: Olena, ext. 214.' },
  { id: 4, name: 'Kyivvodokanal', phone: '+380 44 206-00-00', website: null,            services: 0,
    notes: 'Cold water only; hot water is billed separately by the building.' },
  { id: 5, name: 'Kyivstar',      phone: null,                website: 'kyivstar.ua',   services: 0,
    notes: 'Internet and landline bundle, 1 Gbit/s fiber. Contract auto-renews annually unless cancelled 30 days in advance. Price is locked for the first two years, then reverts to the standard rate. There was an outage in January that took four days to resolve — keep ticket number KS-99312 for reference. The router is rented, not owned, so it must be returned if we cancel. Billing date is the 5th of each month.' },
];

const NOTE_LINE_CLAMP = 3;

// ── Delete button ────────────────────────────────────────────────────────────
function DeleteBtn({ canDelete, z }) {
  const [tip, setTip] = pvUseState(false);

  const tooltipStyle = {
    position: 'absolute',
    bottom: 'calc(100% + 7px)',
    left: '50%',
    transform: 'translateX(-50%)',
    background: z.foreground,
    color: z.background,
    fontSize: 11.5, fontWeight: 500,
    whiteSpace: 'nowrap',
    padding: '4px 9px', borderRadius: 5,
    pointerEvents: 'none', zIndex: 20, lineHeight: 1.4,
  };

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => !canDelete && setTip(true)}
      onMouseLeave={() => setTip(false)}
    >
      {tip && (
        <div style={tooltipStyle}>
          In use — can&apos;t delete
          <div style={{
            position: 'absolute', top: '100%', left: '50%',
            transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '4px solid transparent',
            borderRight: '4px solid transparent',
            borderTop: `4px solid ${z.foreground}`,
          }}></div>
        </div>
      )}
      <button
        disabled={!canDelete}
        style={{
          width: 32, height: 32, borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: `1px solid ${z.border}`,
          background: z.card,
          cursor: canDelete ? 'pointer' : 'default',
          flexShrink: 0,
          opacity: canDelete ? 1 : 0.45,
          transition: 'background 120ms, opacity 120ms',
        }}
      >
        <PvIco.Trash size={14} stroke={z.destructive} />
      </button>
    </div>
  );
}

// ── Edit button ──────────────────────────────────────────────────────────────
function EditBtn({ z }) {
  const [hov, setHov] = pvUseState(false);
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 32, height: 32, borderRadius: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: `1px solid ${z.border}`,
        background: hov ? z.muted : z.card,
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'background 120ms',
      }}
    >
      <PvIco.Pencil size={14} stroke={z.foreground} />
    </button>
  );
}

// ── Provider card ────────────────────────────────────────────────────────────
function ProviderCard({ p, theme, mobile }) {
  const [expanded, setExpanded] = pvUseState(false);
  const [overflows, setOverflows] = pvUseState(false);
  const noteRef = pvUseRef(null);

  const z          = theme === 'dark' ? Z_DARK : Z;
  const palette    = theme === 'dark' ? MONO_PALETTE_DARK : MONO_PALETTE;
  const mono       = palette[(p.id - 1) % palette.length];
  const accentLink = PV_LINK[theme] || PV_LINK.light;
  const canDelete  = p.services === 0;

  // Sizes — desktop vs mobile
  const monoSize   = mobile ? 40 : 44;
  const monoRadius = mobile ? 10 : 12;
  const monoFs     = mobile ? 15 : 17;
  const cardPad    = mobile ? '14px 16px' : '18px 20px';
  const nameFs     = mobile ? 14   : 15;
  const ctactFs    = mobile ? 12   : 13;
  const usageFs    = mobile ? 12   : 12.5;
  const noteFs     = mobile ? 12.5 : 13;
  const iconSz     = mobile ? 11   : 12;

  pvUseEffect(() => {
    const el = noteRef.current;
    if (!el) return;
    const id = requestAnimationFrame(() => {
      setOverflows(el.scrollHeight > el.clientHeight + 2);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div style={{
      background: z.card,
      border: `1px solid ${z.border}`,
      borderRadius: 8,
      padding: cardPad,
      boxShadow: theme === 'dark'
        ? '0 1px 2px rgba(0,0,0,0.3)'
        : '0 1px 2px rgba(24,24,27,0.05)',
      display: 'flex', gap: mobile ? 12 : 16, alignItems: 'flex-start',
    }}>

      {/* Monogram */}
      <div style={{
        width: monoSize, height: monoSize, borderRadius: monoRadius,
        background: mono.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        fontSize: monoFs, fontWeight: 600,
        color: mono.color,
        letterSpacing: -0.3,
        userSelect: 'none',
      }}>
        {p.name[0]}
      </div>

      {/* Main block */}
      <div style={{ flex: 1, minWidth: 0 }}>

        {/* Name */}
        <div style={{
          fontSize: nameFs, fontWeight: 600, color: z.foreground,
          letterSpacing: -0.2, lineHeight: 1.3,
          marginBottom: (p.phone || p.website) ? 5 : 4,
        }}>
          {p.name}
        </div>

        {/* Contact line */}
        {(p.phone || p.website) && (
          <div style={{
            display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px 16px',
            marginBottom: 5,
          }}>
            {p.phone && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontSize: ctactFs, color: z.mutedFg, lineHeight: 1, whiteSpace: 'nowrap',
              }}>
                <PvIco.Phone size={iconSz} stroke={z.mutedFg} />
                {p.phone}
              </span>
            )}
            {p.website && (
              <a href={`https://${p.website}`} style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontSize: ctactFs, color: accentLink,
                textDecoration: 'none', lineHeight: 1, whiteSpace: 'nowrap',
              }}>
                <PvIco.Globe size={iconSz} stroke={accentLink} />
                {p.website}
              </a>
            )}
          </div>
        )}

        {/* Usage */}
        <div style={{
          fontSize: usageFs, color: z.mutedFg, lineHeight: 1,
          marginBottom: p.notes ? 9 : 0,
        }}>
          {p.services > 0
            ? `Used by ${p.services} service${p.services !== 1 ? 's' : ''}`
            : 'Not in use'}
        </div>

        {/* Notes */}
        {p.notes && (
          <div>
            <p ref={noteRef} style={{
              margin: 0, fontSize: noteFs,
              color: theme === 'dark' ? '#a1a1aa' : '#52525b',
              lineHeight: 1.55,
              display: '-webkit-box',
              WebkitLineClamp: !expanded ? NOTE_LINE_CLAMP : 'unset',
              WebkitBoxOrient: 'vertical',
              overflow: !expanded ? 'hidden' : 'visible',
              textWrap: 'pretty',
            }}>
              {p.notes}
            </p>
            {overflows && (
              <button
                onClick={() => setExpanded(!expanded)}
                style={{
                  marginTop: 5, background: 'none', border: 'none', padding: 0,
                  fontSize: 12.5, fontWeight: 500,
                  color: accentLink,
                  cursor: 'pointer', fontFamily: 'inherit', lineHeight: 1,
                }}
              >
                {expanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 6, flexShrink: 0, paddingTop: 1 }}>
        <EditBtn z={z} />
        <DeleteBtn canDelete={canDelete} z={z} />
      </div>

    </div>
  );
}

// ── Full providers screen ────────────────────────────────────────────────────
function ProvidersScreen({ theme = 'light', mobile = false }) {
  const z = theme === 'dark' ? Z_DARK : Z;
  const inUseCount = PROVIDERS.filter(p => p.services > 0).length;

  const I9TB    = window.I9TopBar;
  const I9MobTB = window.I9MobileTopBar;
  let topBar;
  if (mobile && I9MobTB) {
    topBar = <I9MobTB theme={theme} />;
  } else if (theme === 'dark' && I9TB) {
    topBar = <I9TB theme="dark" />;
  } else {
    topBar = <TopBar accent={PV_ACCENT} activeNav="Settings" />;
  }

  const contentPad = mobile ? '20px 16px 48px' : '32px 32px 56px';
  const titleFs    = mobile ? 22 : 28;
  const titleLs    = mobile ? -0.4 : -0.6;
  const subtitleFs = mobile ? 13 : 13.5;

  return (
    <div style={{
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      fontFeatureSettings: '"cv11" 1, "ss01" 1',
      color: z.foreground,
      background: z.background,
      WebkitFontSmoothing: 'antialiased',
    }}>
      {topBar}

      <div style={{ maxWidth: mobile ? 'none' : 1360, margin: '0 auto', padding: contentPad }}>

        {/* Page header */}
        <div style={{
          display: 'flex', alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 28,
        }}>
          <div>
            <h2 style={{
              margin: 0, fontSize: titleFs, fontWeight: 600,
              letterSpacing: titleLs, color: z.foreground, lineHeight: 1.15,
            }}>
              Providers
            </h2>
            <p style={{ margin: '5px 0 0', fontSize: subtitleFs, color: z.mutedFg, lineHeight: 1 }}>
              {PROVIDERS.length} providers · {inUseCount} in use
            </p>
          </div>
          <Button variant="default" accent={PV_ACCENT}>
            <PvIco.Plus size={14} stroke="#fff" />
            Add provider
          </Button>
        </div>

        {/* Card list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {PROVIDERS.map(p => <ProviderCard key={p.id} p={p} theme={theme} mobile={mobile} />)}
        </div>

      </div>
    </div>
  );
}

Object.assign(window, { ProvidersScreen });
