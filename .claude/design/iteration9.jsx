/* global React */
// Iteration 9 — System states + toasts.
// Self-contained shell (light + dark) + state screens, rendered as artboards
// on the shared canvas. Mirrors the Design System app top bar exactly.

const { useState: i9useState } = React;

// ─── Tokens (Design System — Zinc) ──────────────────────────────────────────
const I9 = {
  light: {
    background: '#ffffff', foreground: '#09090b',
    card: '#ffffff', muted: '#f4f4f5', mutedFg: '#71717a',
    border: '#e4e4e7', subtle: '#fafafa',
    headerBg: 'rgba(255,255,255,0.85)',
  },
  dark: {
    background: '#09090b', foreground: '#fafafa',
    card: '#18181b', muted: '#27272a', mutedFg: '#a1a1aa',
    border: '#27272a', subtle: '#1f1f23',
    headerBg: 'rgba(11,11,14,0.85)',
  },
};
const I9_ACCENT = {
  solid: '#7c3aed', hover: '#6d28d9', foreground: '#ffffff',
  tintBgLight: '#f5f3ff', tintBorderLight: '#ede9fe',
  tintBgDark: 'rgba(124,58,237,0.16)', tintTextDark: '#a78bfa', tintBorderDark: 'rgba(124,58,237,0.32)',
};
const I9_DESTRUCTIVE = { light: '#dc2626', dark: '#f87171' };

// ─── Icon wrapper (lucide, stroke 1.75) ─────────────────────────────────────
const I9Ico = ({ size = 16, stroke = 'currentColor', children, sw = 1.75 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

// State / chrome icons
const I9Icons = {
  LayoutDashboard: (p) => (<I9Ico {...p}><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></I9Ico>),
  Globe: (p) => (<I9Ico {...p}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></I9Ico>),
  Moon: (p) => (<I9Ico {...p}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></I9Ico>),
  Sun: (p) => (<I9Ico {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></I9Ico>),
  // 404 candidates
  Compass: (p) => (<I9Ico {...p}><path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"/><circle cx="12" cy="12" r="10"/></I9Ico>),
  SearchX: (p) => (<I9Ico {...p}><path d="m13.5 8.5-5 5"/><path d="m8.5 8.5 5 5"/><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></I9Ico>),
  FileQuestion: (p) => (<I9Ico {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M10 10.3c.2-.4.5-.8.9-1a2.1 2.1 0 0 1 2.6.4c.3.4.5.8.5 1.3 0 1.3-2 2-2 2"/><path d="M12 17h.01"/></I9Ico>),
  MapPinOff: (p) => (<I9Ico {...p}><path d="M5.43 5.43A8.06 8.06 0 0 0 4 10c0 6 8 12 8 12a29.94 29.94 0 0 0 5-5"/><path d="M19.18 13.52A8.66 8.66 0 0 0 20 10a8 8 0 0 0-8-8 7.88 7.88 0 0 0-3.52.82"/><path d="M9.13 9.13A2.78 2.78 0 0 0 9 10a3 3 0 0 0 3 3 2.78 2.78 0 0 0 .87-.13"/><line x1="2" x2="22" y1="2" y2="22"/></I9Ico>),
  TriangleAlert: (p) => (<I9Ico {...p}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></I9Ico>),
};
const I9_404_ICON = {
  compass: I9Icons.Compass, searchx: I9Icons.SearchX,
  filequestion: I9Icons.FileQuestion, mappinoff: I9Icons.MapPinOff,
};

// ─── Buttons ────────────────────────────────────────────────────────────────
function I9Button({ children, variant = 'default', theme = 'light', size = 'md', block = false }) {
  const z = I9[theme];
  const [hover, setHover] = i9useState(false);
  const base = {
    display: block ? 'flex' : 'inline-flex', width: block ? '100%' : 'auto',
    alignItems: 'center', justifyContent: 'center', gap: 6,
    height: size === 'lg' ? 44 : 36, padding: size === 'lg' ? '0 22px' : '0 16px',
    borderRadius: 6,
    fontSize: size === 'lg' ? 14.5 : 13.5, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap',
    fontFamily: 'inherit', transition: 'background 120ms, border-color 120ms',
  };
  if (variant === 'default') {
    return (
      <button onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{
        ...base,
        background: hover ? I9_ACCENT.hover : I9_ACCENT.solid,
        color: I9_ACCENT.foreground,
        border: `1px solid ${hover ? I9_ACCENT.hover : I9_ACCENT.solid}`,
        boxShadow: '0 1px 3px rgba(124,58,237,0.18)',
      }}>{children}</button>
    );
  }
  // outline
  return (
    <button onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{
      ...base,
      background: hover ? z.muted : z.background,
      color: z.foreground,
      border: `1px solid ${z.border}`,
    }}>{children}</button>
  );
}

// ─── App top bar (authenticated) ────────────────────────────────────────────
function I9TopBar({ theme = 'light' }) {
  const z = I9[theme];
  const navItems = ['Dashboard', 'Properties', 'Bills', 'Payments', 'Settings'];
  const ThemeIcon = theme === 'light' ? I9Icons.Moon : I9Icons.Sun;
  const iconBtn = {
    width: 32, height: 32, borderRadius: 6,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'transparent', border: 'none', cursor: 'pointer',
  };
  return (
    <div style={{
      height: 64, flexShrink: 0,
      background: z.headerBg, backdropFilter: 'blur(8px)',
      borderBottom: `1px solid ${z.border}`,
      display: 'flex', alignItems: 'center', padding: '0 32px',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 40 }}>
        <div style={{
          width: 26, height: 26, borderRadius: 6, background: I9_ACCENT.solid,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <I9Icons.LayoutDashboard size={15} stroke="#fff" />
        </div>
        <span style={{ fontSize: 14.5, fontWeight: 600, letterSpacing: -0.1, color: z.foreground }}>UtilityBills</span>
      </div>
      {/* Nav — no item active on a 404 / error route */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1 }}>
        {navItems.map((item) => (
          <a key={item} href="#" style={{
            padding: '8px 12px', fontSize: 13.5, fontWeight: 400,
            color: z.mutedFg, textDecoration: 'none', borderRadius: 6,
          }}>{item}</a>
        ))}
      </nav>
      {/* Right cluster */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <button style={iconBtn}><I9Icons.Globe size={16} stroke={z.mutedFg} /></button>
        <button style={iconBtn}><ThemeIcon size={16} stroke={z.mutedFg} /></button>
        <div style={{ width: 1, height: 20, background: z.border, margin: '0 8px' }} />
        <button style={{
          display: 'flex', alignItems: 'center', gap: 8, height: 36,
          padding: '0 4px 0 8px', background: 'transparent', border: 'none',
          borderRadius: 18, cursor: 'pointer',
        }}>
          <span style={{ fontSize: 13, color: z.foreground, fontWeight: 500 }}>Anna</span>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: theme === 'light' ? I9_ACCENT.tintBgLight : I9_ACCENT.tintBgDark,
            color: theme === 'light' ? I9_ACCENT.solid : I9_ACCENT.tintTextDark,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 600,
            border: `1px solid ${theme === 'light' ? I9_ACCENT.tintBorderLight : I9_ACCENT.tintBorderDark}`,
          }}>AL</div>
        </button>
      </div>
    </div>
  );
}

// ─── App shell wrapper (for artboards) ──────────────────────────────────────
function I9Shell({ theme = 'light', height = 720, children }) {
  const z = I9[theme];
  return (
    <div style={{
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      fontFeatureSettings: '"cv11" 1, "ss01" 1',
      color: z.foreground, background: z.background,
      height, display: 'flex', flexDirection: 'column',
      WebkitFontSmoothing: 'antialiased', overflow: 'hidden',
    }}>
      <I9TopBar theme={theme} />
      <div style={{ flex: 1, minHeight: 0 }}>{children}</div>
    </div>
  );
}

// ─── Empty-state icon chip (matches Bills / Dashboard empty states) ─────────
// tint: 'muted' (default) | 'destructive' — destructive gives a calm error wash.
function I9EmptyIcon({ theme = 'light', tint = 'muted', children }) {
  const z = I9[theme];
  const bg = tint === 'destructive'
    ? (theme === 'light' ? '#fef2f2' : 'rgba(248,113,113,0.12)')
    : z.muted;
  return (
    <div style={{
      width: 72, height: 72, borderRadius: 16, background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>{children}</div>
  );
}

// ─── Screen: 404 / Not found ────────────────────────────────────────────────
function I9NotFound({ theme = 'light', iconKey = 'searchx', height = 720 }) {
  const z = I9[theme];
  const Icon = I9_404_ICON[iconKey] || I9Icons.SearchX;
  return (
    <I9Shell theme={theme} height={height}>
      <div style={{
        height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        padding: '32px', paddingBottom: 80,
      }}>
        <I9EmptyIcon theme={theme}>
          <Icon size={36} stroke={z.mutedFg} sw={1.5} />
        </I9EmptyIcon>
        <h2 style={{ margin: '22px 0 0', fontSize: 26, fontWeight: 600, letterSpacing: -0.5, color: z.foreground }}>
          Page not found
        </h2>
        <p style={{ margin: '10px 0 0', fontSize: 14, lineHeight: 1.6, color: z.mutedFg, maxWidth: 420 }}>
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <div style={{ marginTop: 24 }}>
          <I9Button variant="default" theme={theme}>Go home</I9Button>
        </div>
      </div>
    </I9Shell>
  );
}

// ─── Mobile top bar (390px — simplified, hamburger) ─────────────────────────
function I9MobileTopBar({ theme = 'light' }) {
  const z = I9[theme];
  return (
    <div style={{
      height: 52, flexShrink: 0,
      background: z.headerBg, backdropFilter: 'blur(8px)',
      borderBottom: `1px solid ${z.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 22, height: 22, borderRadius: 5, background: I9_ACCENT.solid,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <I9Icons.LayoutDashboard size={13} stroke="#fff" />
        </div>
        <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: -0.1, color: z.foreground }}>UtilityBills</span>
      </div>
      <button style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={z.foreground} strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
    </div>
  );
}

// ─── Screen: 404 / Not found — mobile (390px) ───────────────────────────────
function I9NotFoundMobile({ theme = 'light', iconKey = 'searchx', height = 780 }) {
  const z = I9[theme];
  const Icon = I9_404_ICON[iconKey] || I9Icons.SearchX;
  return (
    <div style={{
      width: 390, height,
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      fontFeatureSettings: '"cv11" 1, "ss01" 1',
      color: z.foreground, background: z.background,
      display: 'flex', flexDirection: 'column',
      WebkitFontSmoothing: 'antialiased', overflow: 'hidden',
    }}>
      <I9MobileTopBar theme={theme} />
      <div style={{
        flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        padding: '24px', paddingBottom: 72,
      }}>
        <I9EmptyIcon theme={theme}>
          <Icon size={36} stroke={z.mutedFg} sw={1.5} />
        </I9EmptyIcon>
        <h2 style={{ margin: '20px 0 0', fontSize: 22, fontWeight: 600, letterSpacing: -0.4, color: z.foreground }}>
          Page not found
        </h2>
        <p style={{ margin: '10px 0 0', fontSize: 14, lineHeight: 1.6, color: z.mutedFg, maxWidth: 300 }}>
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <div style={{ marginTop: 22 }}>
          <I9Button variant="default" theme={theme} size="lg">Go home</I9Button>
        </div>
      </div>
    </div>
  );
}

// ─── Screen: Fatal error (bare — no app shell / header) ─────────────────────
// A fatal error replaces the whole page, chrome included — so no top bar.
function I9FatalBody({ theme, mobile }) {
  const z = I9[theme];
  const destStroke = theme === 'light' ? I9_DESTRUCTIVE.light : I9_DESTRUCTIVE.dark;
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      padding: mobile ? '24px' : '32px',
    }}>
      <I9EmptyIcon theme={theme} tint="destructive">
        <I9Icons.TriangleAlert size={36} stroke={destStroke} sw={1.5} />
      </I9EmptyIcon>
      <h2 style={{
        margin: mobile ? '20px 0 0' : '22px 0 0',
        fontSize: mobile ? 22 : 26, fontWeight: 600,
        letterSpacing: mobile ? -0.4 : -0.5, color: z.foreground,
      }}>
        Something went wrong
      </h2>
      <p style={{ margin: '10px 0 0', fontSize: 14, lineHeight: 1.6, color: z.mutedFg, maxWidth: mobile ? 300 : 440 }}>
        We've been notified and are looking into it. Try again, or head back home.
      </p>
      <div style={{
        marginTop: mobile ? 22 : 24, display: 'flex', gap: mobile ? 10 : 12,
        justifyContent: 'center', flexDirection: mobile ? 'column-reverse' : 'row',
        width: mobile ? '100%' : 'auto', maxWidth: mobile ? 280 : 'none',
      }}>
        <I9Button variant="outline" theme={theme} size={mobile ? 'lg' : 'md'} block={mobile}>Go home</I9Button>
        <I9Button variant="default" theme={theme} size={mobile ? 'lg' : 'md'} block={mobile}>Try again</I9Button>
      </div>
    </div>
  );
}

function I9FatalError({ theme = 'light', height = 720 }) {
  const z = I9[theme];
  return (
    <div style={{
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      fontFeatureSettings: '"cv11" 1, "ss01" 1',
      color: z.foreground, background: z.background,
      height, WebkitFontSmoothing: 'antialiased', overflow: 'hidden',
    }}>
      <I9FatalBody theme={theme} mobile={false} />
    </div>
  );
}

function I9FatalErrorMobile({ theme = 'light', height = 780 }) {
  const z = I9[theme];
  return (
    <div style={{
      width: 390, height,
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      fontFeatureSettings: '"cv11" 1, "ss01" 1',
      color: z.foreground, background: z.background,
      WebkitFontSmoothing: 'antialiased', overflow: 'hidden',
    }}>
      <I9FatalBody theme={theme} mobile={true} />
    </div>
  );
}

Object.assign(window, {
  I9, I9_ACCENT, I9_DESTRUCTIVE, I9Icons, I9Ico,
  I9Button, I9TopBar, I9MobileTopBar, I9Shell, I9EmptyIcon,
  I9NotFound, I9NotFoundMobile, I9FatalError, I9FatalErrorMobile,
});
