/* global React */
// Sharing tab — owner view + editor view — Iteration 4
// Reuses window.UB primitives

const { useState: useStSh } = React;
const { Z, ACCENTS, TopBar } = window.UB;
const AV = ACCENTS.violet;

// ── Icons ─────────────────────────────────────────────────────
const ShI = {
  ChevSlash: (p) => <svg width={p.s||13} height={p.s||13} viewBox="0 0 24 24" fill="none" stroke={p.c||Z.border} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>,
  ChevD:     (p) => <svg width={p.s||12} height={p.s||12} viewBox="0 0 24 24" fill="none" stroke={p.c||Z.mutedFg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>,
  MoreH:     (p) => <svg width={p.s||15} height={p.s||15} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>,
  Plus:      (p) => <svg width={p.s||14} height={p.s||14} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5v14"/></svg>,
  Info:      (p) => <svg width={p.s||15} height={p.s||15} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>,
};

// ── Avatar ────────────────────────────────────────────────────
const AVATAR_PALETTE = [
  ['#ddd6fe','#7c3aed'], // violet
  ['#bfdbfe','#1d4ed8'], // blue
  ['#bbf7d0','#15803d'], // green
  ['#fde68a','#b45309'], // amber
];

function Avatar({ name, size = 36, idx = 0 }) {
  const [bg, fg] = AVATAR_PALETTE[idx % AVATAR_PALETTE.length];
  const initials = name.split(' ').map(w => w[0]).slice(0,2).join('');
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg, color: fg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 700, flexShrink: 0, letterSpacing: -0.3,
    }}>{initials}</div>
  );
}

// ── Role badge ────────────────────────────────────────────────
function RoleBadge({ role }) {
  const styles = {
    Owner:  { bg: AV.tintBg, border: AV.tintBorder, color: AV.solid },
    Editor: { bg: '#eff6ff', border: '#bfdbfe',      color: '#1d4ed8' },
    Viewer: { bg: Z.muted,   border: Z.border,        color: Z.mutedFg },
  };
  const s = styles[role] || styles.Viewer;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 8px', borderRadius: 999,
      fontSize: 11.5, fontWeight: 600,
      background: s.bg, border: `1px solid ${s.border}`, color: s.color,
    }}>{role}</span>
  );
}

// ── Role dropdown (editable by owner for others) ──────────────
function RoleDropdown({ value }) {
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <select defaultValue={value} style={{
        appearance: 'none', WebkitAppearance: 'none',
        height: 28, padding: '0 26px 0 10px',
        fontSize: 12.5, fontWeight: 500, fontFamily: 'inherit',
        color: AV.solid,
        background: AV.tintBg,
        border: `1px solid ${AV.tintBorder}`,
        borderRadius: 6, cursor: 'pointer',
      }}>
        {['Owner','Editor','Viewer'].map(r => <option key={r}>{r}</option>)}
      </select>
      <div style={{ position: 'absolute', right: 7, pointerEvents: 'none' }}>
        <ShI.ChevD c={AV.solid}/>
      </div>
    </div>
  );
}

// ── Kebab menu ────────────────────────────────────────────────
function KebabMenu({ open, onToggle, items }) {
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={onToggle} style={{
        width: 30, height: 30, borderRadius: 6,
        border: `1px solid ${open ? Z.border : 'transparent'}`,
        background: open ? Z.muted : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
      }}>
        <ShI.MoreH c={Z.mutedFg}/>
      </button>
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 34, width: 160,
          background: Z.card, border: `1px solid ${Z.border}`,
          borderRadius: 6, boxShadow: '0 4px 16px rgba(9,9,11,0.10)',
          zIndex: 20, overflow: 'hidden',
        }}>
          {items.map((item, i) => (
            <button key={i} style={{
              display: 'block', width: '100%', padding: '9px 14px',
              textAlign: 'left', fontSize: 13, fontFamily: 'inherit',
              background: 'none', border: 'none',
              borderTop: i > 0 ? `1px solid ${Z.border}` : 'none',
              color: item.destructive ? Z.destructive : Z.foreground,
              cursor: 'pointer',
            }}>{item.label}</button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── User card ─────────────────────────────────────────────────
function UserCard({ user, isOwnerView, openMenu, setOpenMenu }) {
  const menuOpen = openMenu === user.id;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '16px 20px',
      background: Z.card,
      border: `1px solid ${Z.border}`,
      borderRadius: 8,
      boxShadow: '0 1px 2px rgba(24,24,27,0.05)',
    }}>
      <Avatar name={user.name} size={40} idx={user.avatarIdx}/>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: Z.foreground, letterSpacing: -0.1 }}>
            {user.name}
          </span>
          {user.isYou && (
            <span style={{
              fontSize: 11.5, fontWeight: 500, color: Z.mutedFg,
              padding: '1px 6px', background: Z.muted,
              borderRadius: 4, border: `1px solid ${Z.border}`,
            }}>(You)</span>
          )}
          {/* Static badge for non-editable roles */}
          {(!isOwnerView || user.isYou || user.role === 'Owner') && !(!isOwnerView && !user.isYou) && (
            <RoleBadge role={user.role}/>
          )}
        </div>
        <div style={{ fontSize: 12.5, color: Z.mutedFg, marginTop: 2 }}>{user.email}</div>
        <div style={{ fontSize: 12, color: Z.mutedFg, marginTop: 4 }}>{user.meta}</div>
      </div>

      {/* Role dropdown (owner view, for other non-owner users) */}
      {isOwnerView && !user.isYou && user.role !== 'Owner' && (
        <RoleDropdown value={user.role}/>
      )}

      {/* Static badge in editor view for other users */}
      {!isOwnerView && !user.isYou && (
        <RoleBadge role={user.role}/>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        {user.isYou && (
          <button style={{
            height: 30, padding: '0 12px', fontSize: 13, fontWeight: 500,
            background: 'transparent', color: Z.destructive,
            border: `1px solid ${Z.border}`,
            borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit',
          }}>Leave property</button>
        )}
        {isOwnerView && !user.isYou && user.role !== 'Owner' && (
          <KebabMenu
            open={menuOpen}
            onToggle={() => setOpenMenu(menuOpen ? null : user.id)}
            items={[{ label: 'Remove access', destructive: true }]}
          />
        )}
      </div>
    </div>
  );
}

// ── Breadcrumbs ───────────────────────────────────────────────
function Crumbs() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: Z.mutedFg, marginBottom: 10 }}>
      <a href="#" style={{ color: Z.mutedFg, textDecoration: 'none' }}>Home</a>
      <ShI.ChevSlash/>
      <span style={{ color: Z.foreground }}>Home apartment</span>
    </div>
  );
}

// ── Tabs strip ────────────────────────────────────────────────
function TabsStrip({ active }) {
  return (
    <div style={{
      display: 'inline-flex', padding: 3,
      background: Z.muted, border: `1px solid ${Z.border}`,
      borderRadius: 8, marginBottom: 24,
    }}>
      {['Overview','Meters','Sharing'].map(t => {
        const isActive = t === active;
        return (
          <button key={t} style={{
            padding: '6px 16px', fontSize: 13, fontWeight: isActive ? 500 : 400,
            border: 'none', borderRadius: 5, cursor: 'pointer',
            background: isActive ? Z.background : 'transparent',
            color: isActive ? Z.foreground : Z.mutedFg,
            boxShadow: isActive ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
            fontFamily: 'inherit', transition: 'background 120ms',
          }}>{t}</button>
        );
      })}
    </div>
  );
}

// ── Info banner ───────────────────────────────────────────────
function InfoBanner({ text }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '12px 16px',
      background: Z.muted, border: `1px solid ${Z.border}`,
      borderRadius: 8,
    }}>
      <ShI.Info s={15} c={Z.mutedFg}/>
      <p style={{ margin: 0, fontSize: 13, color: Z.mutedFg, lineHeight: 1.5 }}>{text}</p>
    </div>
  );
}

// ── Sharing tab shared page shell ─────────────────────────────
function PropertyPageShell({ title, subtitle, children }) {
  return (
    <div style={{
      fontFamily: "'Inter', system-ui, sans-serif",
      WebkitFontSmoothing: 'antialiased',
      background: Z.background, color: Z.foreground, minHeight: '100%',
    }}>
      <TopBar accent={AV} activeNav="Properties"/>
      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '28px 32px 56px' }}>
        <Crumbs/>
        {/* Page header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: -0.6 }}>{title}</h1>
          {subtitle && <div style={{ fontSize: 13.5, color: Z.mutedFg, marginTop: 5 }}>{subtitle}</div>}
        </div>
        <TabsStrip active="Sharing"/>
        {children}
      </div>
    </div>
  );
}

// ── OWNER VIEW ────────────────────────────────────────────────
const OWNER_USERS = [
  {
    id: 'u1', name: 'Olena Loban',       email: 'olena@example.com',
    role: 'Owner',  isYou: true,  avatarIdx: 0,
    meta: 'Joined March 1, 2024 · Property creator',
  },
  {
    id: 'u2', name: 'Artem Loban',       email: 'artem@example.com',
    role: 'Editor', isYou: false, avatarIdx: 1,
    meta: 'Added by Olena on April 12, 2024',
  },
  {
    id: 'u3', name: 'Maria Shevchenko',  email: 'maria.shevchenko@example.com',
    role: 'Viewer', isYou: false, avatarIdx: 2,
    meta: 'Added by Olena on June 8, 2024',
  },
];

function SharingTabOwner() {
  const [openMenu, setOpenMenu] = useStSh(null);
  return (
    <PropertyPageShell
      title="Home apartment"
      subtitle="Main St 15 · 5 services · Created Jan 2024"
    >
      <div onClick={() => openMenu && setOpenMenu(null)}>
        {/* Section heading */}
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600, letterSpacing: -0.2 }}>People with access</h2>
          <p style={{ margin: '4px 0 0', fontSize: 13.5, color: Z.mutedFg }}>Manage who can view or edit this property.</p>
        </div>

        {/* User cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {OWNER_USERS.map(u => (
            <UserCard
              key={u.id} user={u}
              isOwnerView={true}
              openMenu={openMenu} setOpenMenu={setOpenMenu}
            />
          ))}
        </div>

        {/* Invite button */}
        <button style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          height: 36, padding: '0 16px', fontSize: 13.5, fontWeight: 500,
          background: AV.solid, color: '#fff', border: 'none',
          borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit',
          marginBottom: 20,
        }}>
          <ShI.Plus c="#fff"/> Invite person
        </button>

        {/* Info banner */}
        <InfoBanner text="People you invite need an existing account. They will get immediate access — no email confirmation required in this version."/>
      </div>
    </PropertyPageShell>
  );
}

// ── EDITOR VIEW ───────────────────────────────────────────────
const EDITOR_USERS = [
  {
    id: 'u1', name: 'Olena Loban',       email: 'olena@example.com',
    role: 'Owner',  isYou: false, avatarIdx: 0,
    meta: 'Property creator',
  },
  {
    id: 'u2', name: 'Artem Loban',       email: 'artem@example.com',
    role: 'Editor', isYou: true,  avatarIdx: 1,
    meta: 'Added by Olena on April 12, 2024',
  },
  {
    id: 'u3', name: 'Maria Shevchenko',  email: 'maria.shevchenko@example.com',
    role: 'Viewer', isYou: false, avatarIdx: 2,
    meta: 'Added by Olena on June 8, 2024',
  },
];

function SharingTabEditor() {
  return (
    <PropertyPageShell
      title="Home apartment"
      subtitle="Main St 15 · 5 services · Created Jan 2024"
    >
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600, letterSpacing: -0.2 }}>People with access</h2>
        <p style={{ margin: '4px 0 0', fontSize: 13.5, color: Z.mutedFg }}>Manage who can view or edit this property.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {EDITOR_USERS.map(u => (
          <UserCard
            key={u.id} user={u}
            isOwnerView={false}
            openMenu={null} setOpenMenu={() => {}}
          />
        ))}
      </div>

      <InfoBanner text="Only owners can invite people and change roles."/>
    </PropertyPageShell>
  );
}

window.SharingTabOwner = SharingTabOwner;
window.SharingTabEditor = SharingTabEditor;
window.ShI = ShI;
window.Avatar = Avatar;
