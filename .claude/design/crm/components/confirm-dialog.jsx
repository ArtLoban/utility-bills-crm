/* global React */
// ConfirmDialog — canonical destructive / warning confirmation modal
// Unifies RemoveUserModal, soft-delete, and hard-delete-property confirmations.
//
// Anatomy (top → bottom):
//   ┌─ Header ────────────────────────────────────────────┐
//   │ Title …                                          ✕  │
//   ├─ Body ──────────────────────────────────────────────┤
//   │            ┌────────────┐                           │
//   │            │   tinted   │   centered 56×56 icon      │
//   │            │    icon    │   (destructive / warning) │
//   │            └────────────┘                           │
//   │   ┌─ entityPreview ──────────────────────────────┐  │ optional
//   │   └──────────────────────────────────────────────┘  │
//   │   description (ReactNode, can contain <strong>)     │
//   │   secondaryText (muted)                             │ optional
//   │   warningText  (red 600)                            │ optional
//   │   ┌─ requireType field ──────────────────────────┐  │ optional
//   │   └──────────────────────────────────────────────┘  │
//   ├─ Footer ────────────────────────────────────────────┤
//   │  [ Cancel ]                       [ Confirm action ]│
//   └─────────────────────────────────────────────────────┘
//
// Props
// ─────
//   title           string           required
//   tone            'destructive' | 'warning' | 'info'   default 'destructive'
//   icon            ReactNode        required (rendered inside the tinted square)
//   entityPreview   ReactNode        optional context row (user / property card)
//   description     ReactNode        required main message
//   secondaryText   ReactNode        optional muted helper
//   warningText     ReactNode        optional emphasized red note
//   requireType     string           optional — when set, user must type it to confirm
//   confirmLabel    string           default 'Confirm'
//   confirmIcon     ReactNode        optional icon shown on the confirm button
//   cancelLabel     string           default 'Cancel'      pass null to hide (single-action alert)
//   closeButton     bool             default true
//   width           number           default 460
//   onConfirm, onCancel, onClose     handlers

const { useState: useStCD } = React;
const Z_CD = (window.UB && window.UB.Z) || {
  background:'#ffffff', foreground:'#09090b', card:'#ffffff',
  muted:'#f4f4f5', mutedFg:'#71717a', border:'#e4e4e7',
  subtle:'#fafafa', destructive:'#dc2626',
};

// Tone → icon tint + confirm button color
const CD_TONES = {
  destructive: {
    iconBg: '#fef2f2', iconBorder: '#fecaca', iconStroke: '#dc2626',
    confirmBg: '#dc2626', confirmHover: '#b91c1c',
  },
  warning: {
    iconBg: '#fffbeb', iconBorder: '#fde68a', iconStroke: '#d97706',
    confirmBg: '#d97706', confirmHover: '#b45309',
  },
  info: {
    iconBg: '#f5f3ff', iconBorder: '#ddd6fe', iconStroke: '#7c3aed',
    confirmBg: '#7c3aed', confirmHover: '#6d28d9',
  },
};

const CDX = (p) => (
  <svg width={p.s||15} height={p.s||15} viewBox="0 0 24 24" fill="none"
    stroke={p.c||'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18M6 6l12 12"/>
  </svg>
);
const CDCheck = (p) => (
  <svg width={p.s||16} height={p.s||16} viewBox="0 0 24 24" fill="none"
    stroke={p.c||'#10b981'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5"/>
  </svg>
);

function ConfirmDialog({
  title,
  tone = 'destructive',
  icon,
  entityPreview,
  description,
  secondaryText,
  warningText,
  requireType,
  confirmLabel = 'Confirm',
  confirmIcon,
  cancelLabel = 'Cancel',
  closeButton = true,
  width = 460,
  onConfirm, onCancel, onClose,
}) {
  const t = CD_TONES[tone] || CD_TONES.destructive;
  const [typed, setTyped] = useStCD('');
  const typeOK = !requireType || typed === requireType;

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="cd-title" style={{
      width, background: Z_CD.background,
      border: `1px solid ${Z_CD.border}`, borderRadius: 10,
      boxShadow: '0 20px 60px rgba(9,9,11,0.18), 0 4px 16px rgba(9,9,11,0.10)',
      overflow: 'hidden',
      fontFamily: "'Inter', system-ui, sans-serif",
      WebkitFontSmoothing: 'antialiased',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px', borderBottom: `1px solid ${Z_CD.border}`,
      }}>
        <h2 id="cd-title" style={{
          margin: 0, fontSize: 15, fontWeight: 600, letterSpacing: -0.2,
          color: Z_CD.foreground,
        }}>{title}</h2>
        {closeButton && (
          <button onClick={onClose || onCancel} aria-label="Close" style={{
            width: 28, height: 28, borderRadius: 6, border: 'none',
            background: 'transparent', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CDX s={15} c={Z_CD.mutedFg}/>
          </button>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '20px 24px' }}>
        {/* Tinted icon */}
        {icon && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: t.iconBg, border: `1px solid ${t.iconBorder}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: t.iconStroke,
            }}>
              {icon}
            </div>
          </div>
        )}

        {entityPreview && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 14px', borderRadius: 8,
            background: Z_CD.muted, border: `1px solid ${Z_CD.border}`,
            marginBottom: 16,
          }}>{entityPreview}</div>
        )}

        {description && (
          <p style={{
            margin: 0, fontSize: 14, color: Z_CD.foreground,
            lineHeight: 1.55, textAlign: icon ? 'center' : 'left',
          }}>{description}</p>
        )}

        {secondaryText && (
          <p style={{
            margin: '10px 0 0', fontSize: 13.5, color: Z_CD.mutedFg,
            lineHeight: 1.55, textAlign: icon ? 'center' : 'left',
          }}>{secondaryText}</p>
        )}

        {warningText && (
          <p style={{
            margin: '12px 0 0', fontSize: 13.5, fontWeight: 600,
            color: '#dc2626', lineHeight: 1.4,
            textAlign: icon ? 'center' : 'left',
          }}>{warningText}</p>
        )}

        {requireType && (
          <>
            <div style={{ height: 1, background: Z_CD.border, margin: '16px 0' }}/>
            <label style={{
              display: 'block', fontSize: 13.5, color: Z_CD.foreground, marginBottom: 8,
            }}>
              To confirm, type{' '}
              <code style={{
                fontFamily: "'JetBrains Mono','SF Mono','Fira Mono',monospace",
                fontSize: 12.5, background: Z_CD.muted,
                padding: '1px 5px', borderRadius: 4,
              }}>{requireType}</code>
              {' '}below.
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text" value={typed} onChange={(e) => setTyped(e.target.value)}
                style={{
                  width: '100%', padding: '8px 36px 8px 12px',
                  borderRadius: 6, fontSize: 14,
                  fontFamily: "'JetBrains Mono','SF Mono','Fira Mono',monospace",
                  fontWeight: 600, letterSpacing: '0.08em',
                  color: Z_CD.foreground, background: Z_CD.background,
                  border: typeOK && typed ? '1.5px solid #10b981' : `1px solid ${Z_CD.border}`,
                  boxShadow: typeOK && typed ? '0 0 0 3px rgba(16,185,129,0.15)' : 'none',
                  outline: 'none',
                }}
              />
              {typeOK && typed && (
                <div style={{
                  position: 'absolute', right: 10, top: '50%',
                  transform: 'translateY(-50%)', display: 'flex',
                }}><CDCheck s={16}/></div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: cancelLabel ? 'space-between' : 'flex-end',
        padding: '14px 24px', borderTop: `1px solid ${Z_CD.border}`,
        background: Z_CD.subtle, gap: 8,
      }}>
        {cancelLabel && (
          <button onClick={onCancel} style={{
            display: 'inline-flex', alignItems: 'center',
            height: 34, padding: '0 16px',
            fontSize: 13.5, fontWeight: 500,
            background: Z_CD.background, color: Z_CD.foreground,
            border: `1px solid ${Z_CD.border}`, borderRadius: 6,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>{cancelLabel}</button>
        )}
        <button
          onClick={onConfirm}
          disabled={!!requireType && !typeOK}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            height: 34, padding: '0 16px',
            fontSize: 13.5, fontWeight: 500, color: '#fff',
            background: t.confirmBg, border: 'none', borderRadius: 6,
            cursor: (!!requireType && !typeOK) ? 'not-allowed' : 'pointer',
            opacity: (!!requireType && !typeOK) ? 0.5 : 1,
            fontFamily: 'inherit',
          }}
        >
          {confirmIcon}
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}

window.ConfirmDialog = ConfirmDialog;
window.CD_TONES = CD_TONES;
