/* global React */
// Sharing modals — Invite, Last-owner protection, Remove user — Iteration 4

const { useState: useStMSh } = React;
const { Z, ACCENTS } = window.UB;
const { Avatar } = window;
const AV3 = ACCENTS.violet;

// ── Icons ─────────────────────────────────────────────────────
const MI = {
  X:          (p) => <svg width={p.s||16} height={p.s||16} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  AlertCircle:(p) => <svg width={p.s||32} height={p.s||32} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>,
  UserMinus:  (p) => <svg width={p.s||32} height={p.s||32} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 11h-6"/></svg>,
  ChevR:      (p) => <svg width={p.s||14} height={p.s||14} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>,
};

// ── Modal shell ───────────────────────────────────────────────
function MShell({ title, width = 460, children, footer }) {
  return (
    <div style={{
      width, background: Z.background,
      border: `1px solid ${Z.border}`, borderRadius: 10,
      boxShadow: '0 20px 60px rgba(9,9,11,0.18), 0 4px 16px rgba(9,9,11,0.10)',
      overflow: 'hidden',
      fontFamily: "'Inter', system-ui, sans-serif",
      WebkitFontSmoothing: 'antialiased',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px', borderBottom: `1px solid ${Z.border}`,
      }}>
        <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, letterSpacing: -0.2, color: Z.foreground }}>{title}</h2>
        <button style={{
          width: 28, height: 28, borderRadius: 6, border: 'none',
          background: 'transparent', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <MI.X s={15} c={Z.mutedFg}/>
        </button>
      </div>
      <div style={{ padding: '20px 24px' }}>{children}</div>
      {footer && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 24px', borderTop: `1px solid ${Z.border}`,
          background: Z.subtle,
        }}>{footer}</div>
      )}
    </div>
  );
}

// ── Backdrop stage ────────────────────────────────────────────
function Backdrop({ children, label }) {
  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative',
      background: '#f4f4f5',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <div style={{ position: 'absolute', inset: 0, background: '#fff', opacity: 0.5 }}>
        <div style={{ height: 64, borderBottom: `1px solid ${Z.border}`, background: 'rgba(255,255,255,0.8)' }}/>
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(9,9,11,0.4)', backdropFilter: 'blur(2px)' }}/>
      {label && (
        <div style={{
          position: 'absolute', top: 16, fontSize: 11, fontWeight: 500,
          letterSpacing: 0.6, color: 'rgba(255,255,255,0.65)',
          textTransform: 'uppercase', zIndex: 2,
        }}>{label}</div>
      )}
      <div style={{ position: 'relative', zIndex: 3, marginTop: 72 }}>{children}</div>
    </div>
  );
}

// ── Shared button styles ──────────────────────────────────────
const btnBase = {
  display: 'inline-flex', alignItems: 'center', gap: 5,
  height: 34, padding: '0 16px', fontSize: 13.5, fontWeight: 500,
  borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit',
};
const PBtn = ({ children, style }) => (
  <button style={{ ...btnBase, background: AV3.solid, color: '#fff', border: 'none', ...style }}>{children}</button>
);
const OBtn = ({ children, style }) => (
  <button style={{ ...btnBase, background: Z.background, color: Z.foreground, border: `1px solid ${Z.border}`, ...style }}>{children}</button>
);
const DBtn = ({ children, style }) => (
  <button style={{ ...btnBase, background: '#dc2626', color: '#fff', border: 'none', ...style }}>{children}</button>
);

// ── Radio option (invite modal) ───────────────────────────────
function InviteRadio({ value, selected, onSelect, label, helper }) {
  const active = selected === value;
  return (
    <div
      onClick={() => onSelect(value)}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 10,
        padding: '12px 14px', borderRadius: 8, cursor: 'pointer',
        border: `1.5px solid ${active ? AV3.solid : Z.border}`,
        background: active ? AV3.tintBg : Z.background,
        transition: 'border-color 120ms, background 120ms',
      }}
    >
      <div style={{
        width: 16, height: 16, borderRadius: '50%', flexShrink: 0, marginTop: 1,
        border: `2px solid ${active ? AV3.solid : Z.border}`,
        background: active ? AV3.solid : Z.background,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 120ms',
      }}>
        {active && <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff' }}/>}
      </div>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: Z.foreground, letterSpacing: -0.1 }}>{label}</div>
        <div style={{ fontSize: 12.5, color: Z.mutedFg, marginTop: 2 }}>{helper}</div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MODAL 1: Invite person
// ══════════════════════════════════════════════════════════════
function InviteModal() {
  const [role, setRole] = useStMSh('Editor');
  return (
    <MShell
      title="Invite person"
      footer={<><OBtn>Cancel</OBtn><PBtn>Send invite</PBtn></>}
    >
      {/* Email field */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', fontSize: 13.5, fontWeight: 500, color: Z.foreground, marginBottom: 6 }}>
          Email
        </label>
        <input
          type="email"
          placeholder="name@example.com"
          style={{
            width: '100%', height: 36, padding: '0 12px',
            fontSize: 14, fontFamily: 'inherit',
            color: Z.foreground, background: Z.background,
            border: `1px solid ${Z.border}`, borderRadius: 6,
            outline: 'none',
          }}
        />
        <div style={{ fontSize: 12.5, color: Z.mutedFg, marginTop: 6 }}>
          The person must already have an account.
        </div>
      </div>

      {/* Separator */}
      <div style={{ height: 1, background: Z.border, margin: '16px 0' }}/>

      {/* Role */}
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 500, color: Z.foreground, marginBottom: 10 }}>Role</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <InviteRadio value="Viewer" selected={role} onSelect={setRole}
            label="Viewer" helper="Can see everything, but can't make changes."/>
          <InviteRadio value="Editor" selected={role} onSelect={setRole}
            label="Editor" helper="Can add readings, bills, and payments."/>
          <InviteRadio value="Owner" selected={role} onSelect={setRole}
            label="Owner" helper="Full access, including inviting and removing others."/>
        </div>
      </div>
    </MShell>
  );
}

// ══════════════════════════════════════════════════════════════
// MODAL 2: Last-owner protection
// ══════════════════════════════════════════════════════════════
function LastOwnerModal() {
  return (
    <MShell
      title="Can't leave as the last owner"
      footer={<div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}><PBtn>Got it</PBtn></div>}
    >
      {/* Icon */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14,
          background: '#fffbeb', border: '1px solid #fde68a',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <MI.AlertCircle s={28} c="#d97706"/>
        </div>
      </div>

      {/* Main text */}
      <p style={{ margin: '0 0 12px', fontSize: 14, color: Z.foreground, lineHeight: 1.55, textAlign: 'center' }}>
        Every property needs at least one owner. You're currently the only owner of{' '}
        <strong>Home apartment</strong>.
      </p>

      {/* Guidance */}
      <p style={{ margin: '0 0 14px', fontSize: 13.5, color: Z.mutedFg, textAlign: 'center' }}>
        To leave, you can either:
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { n: '1', text: 'Promote someone else to Owner first, then leave.' },
          { n: '2', text: 'Delete the property if it\'s no longer needed.' },
        ].map(item => (
          <div key={item.n} style={{
            display: 'flex', alignItems: 'flex-start', gap: 12,
            padding: '12px 14px', borderRadius: 8,
            background: Z.muted, border: `1px solid ${Z.border}`,
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
              background: Z.border, color: Z.mutedFg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700,
            }}>{item.n}</div>
            <p style={{ margin: 0, fontSize: 13.5, color: Z.foreground, lineHeight: 1.5 }}>{item.text}</p>
          </div>
        ))}
      </div>
    </MShell>
  );
}

// ══════════════════════════════════════════════════════════════
// MODAL 3: Remove user confirmation
// ══════════════════════════════════════════════════════════════
function RemoveUserModal() {
  return (
    <MShell
      title="Remove access?"
      footer={<><OBtn>Cancel</OBtn><DBtn>Remove access</DBtn></>}
    >
      {/* Icon */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14,
          background: '#fef2f2', border: '1px solid #fecaca',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <MI.UserMinus s={28} c="#dc2626"/>
        </div>
      </div>

      {/* User preview */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 14px', borderRadius: 8,
        background: Z.muted, border: `1px solid ${Z.border}`,
        marginBottom: 16,
      }}>
        <Avatar name="Artem Loban" size={36} idx={1}/>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: Z.foreground }}>Artem Loban</div>
          <div style={{ fontSize: 12.5, color: Z.mutedFg }}>artem@example.com · Editor</div>
        </div>
      </div>

      {/* Text */}
      <p style={{ margin: '0 0 10px', fontSize: 14, color: Z.foreground, lineHeight: 1.55 }}>
        Remove <strong>Artem Loban</strong> from <strong>Home apartment</strong>?
      </p>
      <p style={{ margin: 0, fontSize: 13.5, color: Z.mutedFg, lineHeight: 1.55 }}>
        They will immediately lose access to this property and all its data. This can be undone by inviting them again.
      </p>
    </MShell>
  );
}

window.InviteModal = InviteModal;
window.LastOwnerModal = LastOwnerModal;
window.RemoveUserModal = RemoveUserModal;
window.Backdrop2 = Backdrop;
