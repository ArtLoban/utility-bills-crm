/* global React */
// Header states — light/dark, authenticated/guest, desktop & mobile.

const { useState: _useS } = React;

// ---------- Theme tokens ----------
const TOKENS = {
  light: {
    bg:        '#ffffff',
    fg:        '#09090b',
    mutedFg:   '#71717a',
    mutedFg2:  '#52525b',
    border:    '#e4e4e7',
    borderSoft:'#f4f4f5',
    subtle:    '#fafafa',
    muted:     '#f4f4f5',
    destructive:     '#dc2626',
    destructiveSoft:'#fef2f2',
    warning:   '#f59e0b',
    overlay:   'rgba(9, 9, 11, 0.45)',
    pageBg:    '#fafafa',
    shadow:    '0 12px 32px -8px rgba(24,24,27,0.18), 0 4px 8px -4px rgba(24,24,27,0.08)',
    drawerShadow:'-12px 0 32px -8px rgba(24,24,27,0.18)',
  },
  dark: {
    bg:        '#0b0b0e',
    fg:        '#fafafa',
    mutedFg:   '#a1a1aa',
    mutedFg2:  '#d4d4d8',
    border:    '#27272a',
    borderSoft:'#1f1f23',
    subtle:    '#18181b',
    muted:     '#27272a',
    destructive:     '#f87171',
    destructiveSoft:'rgba(248, 113, 113, 0.12)',
    warning:   '#fbbf24',
    overlay:   'rgba(0, 0, 0, 0.6)',
    pageBg:    '#09090b',
    shadow:    '0 16px 40px -8px rgba(0,0,0,0.6), 0 4px 12px -4px rgba(0,0,0,0.4)',
    drawerShadow:'-16px 0 40px -8px rgba(0,0,0,0.6)',
  },
};

const ACCENT = {
  light: {
    solid:      '#7c3aed',
    tintBg:     '#f5f3ff',
    tintBorder: '#ede9fe',
    underline:  '#7c3aed',
    onSolid:    '#ffffff',
  },
  dark: {
    solid:      '#8b5cf6',
    tintBg:     'rgba(139, 92, 246, 0.16)',
    tintBorder: 'rgba(139, 92, 246, 0.32)',
    underline:  '#a78bfa',
    onSolid:    '#ffffff',
  },
};

const T = (theme) => ({ ...TOKENS[theme], ...ACCENT[theme], theme });

// ---------- Icon primitive ----------
function HIcon({ size = 18, stroke = 'currentColor', sw = 1.75, children, style, fill = 'none' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
      stroke={stroke} strokeWidth={sw}
      strokeLinecap="round" strokeLinejoin="round" style={style}>
      {children}
    </svg>
  );
}

const HI = {
  Zap: (p) => <HIcon {...p}><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" fill={p.fill || 'none'}/></HIcon>,
  Globe: (p) => <HIcon {...p}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></HIcon>,
  Sun: (p) => <HIcon {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></HIcon>,
  Moon: (p) => <HIcon {...p}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></HIcon>,
  Settings: (p) => <HIcon {...p}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></HIcon>,
  Shield: (p) => <HIcon {...p}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></HIcon>,
  LogOut: (p) => <HIcon {...p}><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/></HIcon>,
  LogIn: (p) => <HIcon {...p}><path d="m10 17 5-5-5-5"/><path d="M15 12H3"/><path d="M9 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H9"/></HIcon>,
  Check: (p) => <HIcon {...p}><path d="M20 6 9 17l-5-5"/></HIcon>,
  Menu: (p) => <HIcon {...p}><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></HIcon>,
  X: (p) => <HIcon {...p}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></HIcon>,
  ChevronRight: (p) => <HIcon {...p}><path d="m9 18 6-6-6-6"/></HIcon>,
  ChevronLeft: (p) => <HIcon {...p}><path d="m15 18-6-6 6-6"/></HIcon>,
  ChevronDown: (p) => <HIcon {...p}><path d="m6 9 6 6 6-6"/></HIcon>,
  UserPlus: (p) => <HIcon {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></HIcon>,
};

// ---------- Flag SVGs ----------
const HFlags = {
  EN: ({ size = 20 }) => (
    <svg width={size} height={size * 0.7} viewBox="0 0 20 14"
      style={{ borderRadius: 2, flexShrink: 0, display: 'block', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)' }}>
      <rect width="20" height="14" fill="#012169"/>
      <path d="M0,0 L20,14 M20,0 L0,14" stroke="#fff" strokeWidth="2.4"/>
      <path d="M0,0 L20,14 M20,0 L0,14" stroke="#C8102E" strokeWidth="1.2"/>
      <rect x="8.5" width="3" height="14" fill="#fff"/>
      <rect y="5.5" width="20" height="3" fill="#fff"/>
      <rect x="9" width="2" height="14" fill="#C8102E"/>
      <rect y="6" width="20" height="2" fill="#C8102E"/>
    </svg>
  ),
  UA: ({ size = 20 }) => (
    <svg width={size} height={size * 0.7} viewBox="0 0 20 14"
      style={{ borderRadius: 2, flexShrink: 0, display: 'block', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)' }}>
      <rect width="20" height="7" fill="#0057B7"/>
      <rect y="7" width="20" height="7" fill="#FFD700"/>
    </svg>
  ),
  RU: ({ size = 20 }) => (
    <svg width={size} height={size * 0.7} viewBox="0 0 20 14"
      style={{ borderRadius: 2, flexShrink: 0, display: 'block', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)' }}>
      <rect width="20" height="4.67" fill="#fff"/>
      <rect y="4.67" width="20" height="4.67" fill="#0039A6"/>
      <rect y="9.33" width="20" height="4.67" fill="#D52B1E"/>
    </svg>
  ),
};

const LANGS = [
  { code: 'EN', label: 'English',     Flag: HFlags.EN },
  { code: 'UA', label: 'Українська',  Flag: HFlags.UA },
  { code: 'RU', label: 'Русский',     Flag: HFlags.RU },
];

// ---------- Logo ----------
function Logo({ size = 'md', tk }) {
  const d = size === 'sm'
    ? { box: 28, icon: 16, text: 15, gap: 8 }
    : { box: 36, icon: 20, text: 18, gap: 10 };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: d.gap }}>
      <div style={{
        width: d.box, height: d.box, borderRadius: 8,
        background: tk.solid,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: tk.theme === 'dark' ? '0 1px 2px rgba(0,0,0,0.4)' : '0 1px 2px rgba(124, 58, 237, 0.25)',
      }}>
        <HI.Zap size={d.icon} stroke="#fff" fill="#fff" sw={0}/>
      </div>
      <span style={{ fontSize: d.text, fontWeight: 600, letterSpacing: -0.3, color: tk.fg }}>
        UtilityBills
      </span>
    </div>
  );
}

// ---------- Avatar ----------
function Avatar({ size = 32, initials = 'DT', tk }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: tk.tintBg, color: tk.solid,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size < 30 ? 11 : 12, fontWeight: 600,
      border: `1px solid ${tk.tintBorder}`, flexShrink: 0,
    }}>{initials}</div>
  );
}

// ---------- Buttons ----------
function ToolBtn({ children, bordered = false, active = false, tk }) {
  return (
    <button style={{
      width: 36, height: 36, borderRadius: 8,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: active ? tk.muted : tk.bg,
      border: bordered ? `1px solid ${tk.border}` : '1px solid transparent',
      cursor: 'pointer', fontFamily: 'inherit',
    }}>{children}</button>
  );
}

function SolidBtn({ children, tk, size = 'sm', onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      height: size === 'sm' ? 36 : 40, padding: '0 14px', borderRadius: 8,
      background: tk.solid, color: tk.onSolid,
      border: `1px solid ${tk.solid}`,
      fontSize: 14, fontWeight: 500, fontFamily: 'inherit',
      cursor: 'pointer',
    }}>{children}</button>
  );
}

function GhostBtn({ children, tk, size = 'sm' }) {
  return (
    <button style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      height: size === 'sm' ? 36 : 40, padding: '0 14px', borderRadius: 8,
      background: 'transparent', color: tk.fg,
      border: `1px solid ${tk.border}`,
      fontSize: 14, fontWeight: 500, fontFamily: 'inherit',
      cursor: 'pointer',
    }}>{children}</button>
  );
}

// =====================================================================
//  DESKTOP HEADER
// =====================================================================
function DesktopHeader({
  theme = 'light',
  activeNav = 'Dashboard',
  openMenu = null,
  hoveredUserItem = null,
  hoveredLang = null,
  guest = false,
  user = { name: 'Dev Test', email: 'devtest33333@gmail.com', initials: 'DT' },
}) {
  const tk = T(theme);
  const navItems = guest
    ? ['Home', 'Pricing', 'About']
    : ['Dashboard', 'Properties', 'Meters', 'Bills', 'Payments'];

  return (
    <div style={{
      height: 72, background: tk.bg,
      borderBottom: `1px solid ${tk.border}`,
      display: 'flex', alignItems: 'center',
      padding: '0 40px', position: 'relative',
    }}>
      <div style={{ marginRight: 48 }}><Logo size="md" tk={tk}/></div>

      <nav style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, height: '100%' }}>
        {navItems.map((item) => {
          const active = item === activeNav;
          return (
            <div key={item} style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
              <a href="#" style={{
                padding: '8px 4px', fontSize: 16,
                fontWeight: active ? 600 : 400,
                color: active ? tk.fg : tk.mutedFg,
                textDecoration: 'none', letterSpacing: -0.1,
              }}>{item}</a>
              {active && (
                <span style={{
                  position: 'absolute', left: 0, right: 0, bottom: -1,
                  height: 2, background: tk.underline, borderRadius: 2,
                }}/>
              )}
            </div>
          );
        })}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4, position: 'relative' }}>
        <div style={{ position: 'relative' }}>
          <ToolBtn active={openMenu === 'lang'} tk={tk}>
            <HI.Globe size={18} stroke={tk.mutedFg2}/>
          </ToolBtn>
          {openMenu === 'lang' && <LanguageDropdown hovered={hoveredLang} current="EN" tk={tk}/>}
        </div>
        <ToolBtn bordered tk={tk}>
          {theme === 'dark'
            ? <HI.Moon size={17} stroke={tk.mutedFg2}/>
            : <HI.Sun  size={17} stroke={tk.mutedFg2}/>}
        </ToolBtn>
        <div style={{ width: 1, height: 24, background: tk.border, margin: '0 12px' }}/>

        {guest ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <GhostBtn tk={tk}>
              <HI.LogIn size={16} stroke={tk.fg}/>
              Sign in
            </GhostBtn>
            <SolidBtn tk={tk}>
              Sign up
            </SolidBtn>
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 10,
              height: 40, padding: '0 6px 0 10px',
              background: openMenu === 'user' ? tk.muted : 'transparent',
              border: 'none', borderRadius: 20, cursor: 'pointer', fontFamily: 'inherit',
            }}>
              <span style={{ fontSize: 15, color: tk.fg, fontWeight: 500 }}>{user.name}</span>
              <Avatar initials={user.initials} tk={tk}/>
            </button>
            {openMenu === 'user' && <UserDropdown user={user} hovered={hoveredUserItem} tk={tk}/>}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- User dropdown ----------
function UserDropdown({ user, hovered, tk }) {
  const items = [
    { key: 'settings', label: 'Settings',    Icon: HI.Settings },
    { key: 'admin',    label: 'Admin panel', Icon: HI.Shield },
  ];
  return (
    <div style={{
      position: 'absolute', top: 'calc(100% + 8px)', right: 0,
      minWidth: 280, background: tk.bg,
      border: `1px solid ${tk.border}`, borderRadius: 12,
      boxShadow: tk.shadow, padding: 6, zIndex: 20,
    }}>
      <div style={{ padding: '14px 12px 12px' }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: tk.fg, letterSpacing: -0.1, marginBottom: 2 }}>
          {user.name}
        </div>
        <div style={{ fontSize: 13.5, color: tk.mutedFg }}>{user.email}</div>
      </div>
      <div style={{ height: 1, background: tk.borderSoft, margin: '0 -6px' }}/>
      <div style={{ padding: '6px 0' }}>
        {items.map(it => {
          const h = hovered === it.key;
          return (
            <button key={it.key} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              width: '100%', height: 40, padding: '0 12px',
              background: h ? tk.subtle : 'transparent',
              border: 'none', borderRadius: 8,
              cursor: 'pointer', fontFamily: 'inherit',
              color: tk.fg, fontSize: 14.5, textAlign: 'left',
            }}>
              <it.Icon size={18} stroke={tk.fg}/>
              {it.label}
            </button>
          );
        })}
      </div>
      <div style={{ height: 1, background: tk.borderSoft, margin: '0 -6px' }}/>
      <div style={{ padding: '6px 0' }}>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 12,
          width: '100%', height: 40, padding: '0 12px',
          background: hovered === 'signout' ? tk.destructiveSoft : 'transparent',
          border: 'none', borderRadius: 8,
          cursor: 'pointer', fontFamily: 'inherit',
          color: hovered === 'signout' ? tk.destructive : tk.fg,
          fontSize: 14.5, textAlign: 'left',
        }}>
          <HI.LogOut size={18} stroke={hovered === 'signout' ? tk.destructive : tk.fg}/>
          Sign out
        </button>
      </div>
    </div>
  );
}

// ---------- Language dropdown ----------
function LanguageDropdown({ current = 'EN', hovered, tk }) {
  return (
    <div style={{
      position: 'absolute', top: 'calc(100% + 8px)', right: -40,
      minWidth: 220, background: tk.bg,
      border: `1px solid ${tk.border}`, borderRadius: 12,
      boxShadow: tk.shadow, padding: 6, zIndex: 20,
    }}>
      <div style={{
        padding: '10px 12px 8px', fontSize: 11.5, fontWeight: 500,
        color: tk.mutedFg, letterSpacing: 0.4, textTransform: 'uppercase',
      }}>Language</div>
      {LANGS.map(l => {
        const active = l.code === current;
        const h = hovered === l.code;
        return (
          <button key={l.code} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            width: '100%', height: 40, padding: '0 12px',
            background: h ? tk.subtle : 'transparent',
            border: 'none', borderRadius: 8,
            cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
          }}>
            <l.Flag size={22}/>
            <span style={{
              fontSize: 14.5, color: tk.fg,
              fontWeight: active ? 600 : 400, flex: 1,
            }}>{l.label}</span>
            <span style={{ fontSize: 11.5, fontWeight: 600, color: tk.mutedFg, letterSpacing: 0.4 }}>
              {l.code}
            </span>
            {active && <HI.Check size={16} stroke={tk.solid}/>}
          </button>
        );
      })}
    </div>
  );
}

// =====================================================================
//  MOBILE HEADER + DRAWER
// =====================================================================
function MobileHeader({
  theme = 'light',
  state = 'closed',
  activeNav = 'Dashboard',
  guest = false,
  showPageContext = true,
  user = { name: 'Dev Test', email: 'devtest33333@gmail.com', initials: 'DT' },
}) {
  const tk = T(theme);
  const drawerOpen = state !== 'closed';

  return (
    <div style={{
      width: '100%', height: '100%',
      background: tk.bg,
      fontFamily: "'Inter', system-ui, sans-serif",
      color: tk.fg, position: 'relative', overflow: 'hidden',
    }}>
      {/* Status bar */}
      <div style={{
        height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', fontSize: 15, fontWeight: 600, color: tk.fg,
      }}>
        <span>9:41</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="18" height="11" viewBox="0 0 18 11" fill="none">
            <path d="M1 6.5 L4 9.5 L17 1.5" stroke={tk.fg} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
            <rect x="0.5" y="2.5" width="11" height="6" rx="1.5" stroke={tk.fg}/>
            <rect x="2" y="4" width="8" height="3" fill={tk.fg}/>
            <rect x="12.5" y="4" width="1.5" height="3" fill={tk.fg}/>
          </svg>
        </div>
      </div>

      {/* Topbar */}
      <div style={{
        height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px',
        borderBottom: `1px solid ${tk.border}`,
        background: tk.bg, position: 'relative', zIndex: 1,
      }}>
        <Logo size="sm" tk={tk}/>
        {guest && !drawerOpen ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button style={{
              height: 34, padding: '0 12px', borderRadius: 8,
              background: tk.solid, color: tk.onSolid,
              border: 'none', fontSize: 13.5, fontWeight: 500,
              fontFamily: 'inherit', cursor: 'pointer',
            }}>Sign in</button>
            <button style={{
              width: 40, height: 40, borderRadius: 8,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent', border: 'none', cursor: 'pointer',
            }}>
              <HI.Menu size={22} stroke={tk.fg}/>
            </button>
          </div>
        ) : (
          <button style={{
            width: 40, height: 40, borderRadius: 8,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: drawerOpen ? tk.muted : 'transparent',
            border: 'none', cursor: 'pointer',
          }}>
            <HI.Menu size={22} stroke={tk.fg}/>
          </button>
        )}
      </div>

      {/* Page context */}
      {showPageContext && (
        <div style={{ padding: '24px 16px' }}>
          {guest ? (
            <>
              <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.6, color: tk.fg, marginBottom: 8 }}>
                Manage your utility bills
              </div>
              <div style={{ fontSize: 14, color: tk.mutedFg, marginBottom: 20, lineHeight: 1.5 }}>
                Track meters, payments and debts across all your properties.
              </div>
              <button style={{
                width: '100%', height: 48, borderRadius: 10,
                background: tk.solid, color: tk.onSolid, border: 'none',
                fontSize: 15, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
              }}>Create free account</button>
            </>
          ) : (
            <>
              <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.6, color: tk.fg, marginBottom: 16 }}>
                Hi, Dev
              </div>
              <div style={{
                background: tk.bg,
                border: `1px solid ${tk.border}`,
                borderLeft: `4px solid ${tk.warning}`,
                borderRadius: 10, padding: '14px',
                display: 'flex', flexDirection: 'column', gap: 8,
              }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: tk.fg }}>Attention required</div>
                <div style={{ fontSize: 13, color: tk.fg }}>
                  Debt: <strong style={{ color: tk.destructive }}>1 240 UAH</strong>
                  <span style={{ color: tk.mutedFg }}> (2 services)</span>
                </div>
                <div style={{ fontSize: 13, color: tk.fg }}>
                  Readings by <strong>Oct 25</strong>
                  <span style={{ color: tk.mutedFg }}> (3 meters)</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {drawerOpen && <div style={{ position: 'absolute', inset: 0, background: tk.overlay, zIndex: 5 }}/>}
      {drawerOpen && <MobileDrawer state={state} activeNav={activeNav} user={user} guest={guest} tk={tk}/>}
    </div>
  );
}

function MobileDrawer({ state, activeNav, user, guest, tk }) {
  const navItems = guest
    ? [
        { label: 'Home',    Icon: (p) => <HIcon {...p}><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></HIcon> },
        { label: 'Pricing', Icon: (p) => <HIcon {...p}><circle cx="12" cy="12" r="10"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4"/><path d="M12 17h.01"/></HIcon> },
        { label: 'About',   Icon: (p) => <HIcon {...p}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></HIcon> },
      ]
    : [
        { label: 'Dashboard',  Icon: (p) => <HIcon {...p}><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></HIcon> },
        { label: 'Properties', Icon: (p) => <HIcon {...p}><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></HIcon> },
        { label: 'Meters',     Icon: (p) => <HIcon {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></HIcon> },
        { label: 'Bills',      Icon: (p) => <HIcon {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8"/><path d="M8 17h5"/></HIcon> },
        { label: 'Payments',   Icon: (p) => <HIcon {...p}><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M2 10h20"/><path d="M6 14h4"/></HIcon> },
      ];

  const showLangPanel = state === 'lang';

  return (
    <div style={{
      position: 'absolute', top: 0, right: 0, bottom: 0, width: 320,
      background: tk.bg, borderLeft: `1px solid ${tk.border}`,
      boxShadow: tk.drawerShadow, zIndex: 10,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Drawer header */}
      <div style={{
        padding: '20px 18px 16px',
        background: state === 'user' ? tk.tintBg : tk.bg,
        borderBottom: `1px solid ${tk.border}`,
        display: 'flex', alignItems: 'flex-start', gap: 12,
      }}>
        {guest ? (
          <>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: tk.muted, color: tk.mutedFg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `1px solid ${tk.border}`, flexShrink: 0,
            }}>
              <HI.UserPlus size={20} stroke={tk.mutedFg2}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: tk.fg, letterSpacing: -0.1 }}>Guest</div>
              <div style={{ fontSize: 13, color: tk.mutedFg }}>Not signed in</div>
            </div>
          </>
        ) : (
          <>
            <Avatar initials={user.initials} size={40} tk={tk}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: tk.fg, letterSpacing: -0.1 }}>{user.name}</div>
              <div style={{
                fontSize: 13, color: tk.mutedFg,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{user.email}</div>
            </div>
          </>
        )}
        <button style={{
          width: 32, height: 32, borderRadius: 8,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: 'transparent', border: 'none', cursor: 'pointer',
        }}>
          <HI.X size={20} stroke={tk.fg}/>
        </button>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {!showLangPanel && (
          <>
            <div style={{ padding: '12px 10px 8px' }}>
              {navItems.map(it => {
                const active = it.label === activeNav;
                return (
                  <a key={it.label} href="#" style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    height: 44, padding: '0 12px', borderRadius: 8,
                    textDecoration: 'none',
                    background: active ? tk.tintBg : 'transparent',
                    color: active ? tk.solid : tk.fg,
                    fontSize: 15, fontWeight: active ? 600 : 500,
                  }}>
                    <it.Icon size={20} stroke={active ? tk.solid : tk.mutedFg2}/>
                    {it.label}
                  </a>
                );
              })}
            </div>

            {/* Sign in CTA for guest */}
            {guest && (
              <div style={{ padding: '8px 18px 4px' }}>
                <button style={{
                  width: '100%', height: 44, borderRadius: 10,
                  background: tk.solid, color: tk.onSolid, border: 'none',
                  fontSize: 14.5, fontWeight: 600, fontFamily: 'inherit',
                  cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>
                  <HI.LogIn size={17} stroke={tk.onSolid}/>
                  Sign in
                </button>
                <button style={{
                  width: '100%', height: 44, borderRadius: 10,
                  background: 'transparent', color: tk.fg,
                  border: `1px solid ${tk.border}`,
                  fontSize: 14.5, fontWeight: 500, fontFamily: 'inherit',
                  cursor: 'pointer', marginTop: 8,
                }}>
                  Create account
                </button>
              </div>
            )}

            <div style={{ height: 1, background: tk.borderSoft, margin: '8px 16px' }}/>

            <div style={{ padding: '8px 10px' }}>
              <div style={{
                fontSize: 11, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase',
                color: tk.mutedFg, padding: '8px 12px 6px',
              }}>Preferences</div>

              <button style={{
                display: 'flex', alignItems: 'center', gap: 12,
                width: '100%', height: 44, padding: '0 12px',
                background: 'transparent', border: 'none', borderRadius: 8,
                cursor: 'pointer', fontFamily: 'inherit',
                color: tk.fg, fontSize: 14.5, fontWeight: 500, textAlign: 'left',
              }}>
                <HI.Globe size={20} stroke={tk.mutedFg2}/>
                <span style={{ flex: 1 }}>Language</span>
                <HFlags.EN size={20}/>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: tk.mutedFg, letterSpacing: 0.3 }}>EN</span>
                <HI.ChevronRight size={16} stroke={tk.mutedFg}/>
              </button>

              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                width: '100%', height: 44, padding: '0 12px',
                color: tk.fg, fontSize: 14.5, fontWeight: 500,
              }}>
                <HI.Sun size={20} stroke={tk.mutedFg2}/>
                <span style={{ flex: 1 }}>Theme</span>
                <div style={{
                  display: 'inline-flex', background: tk.muted,
                  border: `1px solid ${tk.border}`, borderRadius: 8, padding: 2,
                }}>
                  <div style={{
                    width: 36, height: 28, borderRadius: 6,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    background: tk.theme === 'light' ? tk.bg : 'transparent',
                    boxShadow: tk.theme === 'light' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                  }}>
                    <HI.Sun size={14} stroke={tk.theme === 'light' ? tk.fg : tk.mutedFg}/>
                  </div>
                  <div style={{
                    width: 36, height: 28, borderRadius: 6,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    background: tk.theme === 'dark' ? tk.subtle : 'transparent',
                    boxShadow: tk.theme === 'dark' ? '0 1px 2px rgba(0,0,0,0.4)' : 'none',
                  }}>
                    <HI.Moon size={14} stroke={tk.theme === 'dark' ? tk.fg : tk.mutedFg}/>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ flex: 1 }}/>

            {!guest && (
              <>
                <div style={{ height: 1, background: tk.borderSoft, margin: '0 16px' }}/>
                <div style={{ padding: '8px 10px 16px' }}>
                  <div style={{
                    fontSize: 11, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase',
                    color: tk.mutedFg, padding: '8px 12px 6px',
                  }}>Account</div>
                  <a href="#" style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    height: 44, padding: '0 12px', borderRadius: 8, textDecoration: 'none',
                    background: state === 'user' ? tk.subtle : 'transparent',
                    color: tk.fg, fontSize: 14.5, fontWeight: 500,
                  }}>
                    <HI.Settings size={20} stroke={tk.mutedFg2}/>Settings
                  </a>
                  <a href="#" style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    height: 44, padding: '0 12px', borderRadius: 8, textDecoration: 'none',
                    color: tk.fg, fontSize: 14.5, fontWeight: 500,
                  }}>
                    <HI.Shield size={20} stroke={tk.mutedFg2}/>Admin panel
                  </a>
                  <a href="#" style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    height: 44, padding: '0 12px', borderRadius: 8, textDecoration: 'none',
                    color: tk.destructive, fontSize: 14.5, fontWeight: 500,
                  }}>
                    <HI.LogOut size={20} stroke={tk.destructive}/>Sign out
                  </a>
                </div>
              </>
            )}
          </>
        )}

        {showLangPanel && (
          <div style={{ padding: '12px 10px' }}>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 6,
              height: 36, padding: '0 8px',
              background: 'transparent', border: 'none', borderRadius: 8,
              cursor: 'pointer', fontFamily: 'inherit',
              color: tk.mutedFg2, fontSize: 13.5, fontWeight: 500, marginBottom: 6,
            }}>
              <HI.ChevronLeft size={16} stroke={tk.mutedFg2}/>Back
            </button>
            <div style={{
              fontSize: 17, fontWeight: 600, letterSpacing: -0.2,
              color: tk.fg, padding: '4px 12px 12px',
            }}>Choose language</div>
            {LANGS.map(l => {
              const active = l.code === 'EN';
              return (
                <button key={l.code} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  width: '100%', height: 52, padding: '0 12px',
                  background: active ? tk.tintBg : 'transparent',
                  border: 'none', borderRadius: 10,
                  cursor: 'pointer', fontFamily: 'inherit',
                  textAlign: 'left', marginBottom: 2,
                }}>
                  <l.Flag size={28}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: active ? 600 : 500, color: tk.fg }}>
                      {l.label}
                    </div>
                    <div style={{ fontSize: 12, color: tk.mutedFg, letterSpacing: 0.3, fontWeight: 600 }}>
                      {l.code}
                    </div>
                  </div>
                  {active && (
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%', background: tk.solid,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <HI.Check size={14} stroke="#fff"/>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// =====================================================================
//  Artboard wrappers
// =====================================================================
function HeaderArtboard({ children, theme = 'light' }) {
  const tk = T(theme);
  return (
    <div style={{
      width: '100%', height: '100%',
      fontFamily: "'Inter', system-ui, sans-serif",
      background: tk.pageBg, color: tk.fg,
      WebkitFontSmoothing: 'antialiased',
      fontFeatureSettings: '"cv11" 1, "ss01" 1',
    }}>{children}</div>
  );
}

function HeaderContext({ theme = 'light', guest = false }) {
  const tk = T(theme);
  if (guest) {
    return (
      <div style={{ padding: '56px 40px', maxWidth: 1360, margin: '0 auto', textAlign: 'left' }}>
        <div style={{
          fontSize: 14, fontWeight: 500, color: tk.solid,
          letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 12,
        }}>Free during beta</div>
        <h2 style={{
          margin: 0, fontSize: 56, fontWeight: 700, letterSpacing: -1.4,
          color: tk.fg, maxWidth: 720, lineHeight: 1.05,
        }}>Utility bills, finally under control.</h2>
        <p style={{
          margin: '20px 0 0', fontSize: 17, color: tk.mutedFg,
          maxWidth: 560, lineHeight: 1.5,
        }}>Track meters, payments and debts across all your properties — in one place.</p>
      </div>
    );
  }
  return (
    <div style={{ padding: '32px 40px', maxWidth: 1360, margin: '0 auto' }}>
      <h2 style={{ margin: 0, fontSize: 32, fontWeight: 700, letterSpacing: -0.8, color: tk.fg }}>
        Hi, Dev
      </h2>
    </div>
  );
}

window.HeaderStates = { DesktopHeader, MobileHeader, HeaderArtboard, HeaderContext };
