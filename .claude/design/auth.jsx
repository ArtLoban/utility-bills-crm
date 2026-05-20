/* global React */
// Auth screens — Login + Error, Light + Dark — Iteration 5
// No window.UB dependency for layout — fully self-contained so it renders cleanly
// at small artboard widths without app chrome.

const { useState: useStA } = React;

// ── Design tokens ─────────────────────────────────────────────
const LIGHT = {
  pageBg:    '#fafafa',
  cardBg:    '#ffffff',
  cardBorder:'#e4e4e7',
  cardShadow:'0 1px 3px rgba(24,24,27,0.07), 0 1px 2px rgba(24,24,27,0.05)',
  fg:        '#09090b',
  mutedFg:   '#71717a',
  border:    '#e4e4e7',
  muted:     '#f4f4f5',
  inputBg:   '#ffffff',
};

const DARK = {
  pageBg:    '#09090b',
  cardBg:    '#18181b',
  cardBorder:'#27272a',
  cardShadow:'none',
  fg:        '#fafafa',
  mutedFg:   '#71717a',
  border:    '#27272a',
  muted:     '#27272a',
  inputBg:   '#09090b',
};

const VIOLET = { solid: '#7c3aed', tintBg: '#f5f3ff', tintBorder: '#ede9fe' };

// ── Icons ─────────────────────────────────────────────────────
const AI = {
  Zap: (p) => (
    <svg width={p.s||18} height={p.s||18} viewBox="0 0 24 24" fill="none"
      stroke={p.c||'currentColor'} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>
    </svg>
  ),
  AlertCircle: (p) => (
    <svg width={p.s||48} height={p.s||48} viewBox="0 0 24 24" fill="none"
      stroke={p.c||'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 8v4M12 16h.01"/>
    </svg>
  ),
  ArrowLeft: (p) => (
    <svg width={p.s||13} height={p.s||13} viewBox="0 0 24 24" fill="none"
      stroke={p.c||'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7"/>
    </svg>
  ),
  ArrowRight: (p) => (
    <svg width={p.s||13} height={p.s||13} viewBox="0 0 24 24" fill="none"
      stroke={p.c||'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  ),
};

// Google "G" logo — brand element, always light bg
function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

// ── Logo mark ─────────────────────────────────────────────────
function LogoMark({ T }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
      <div style={{
        width: 28, height: 28, borderRadius: 7,
        background: VIOLET.solid,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <AI.Zap s={15} c="#fff"/>
      </div>
      <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: -0.2, color: T.fg }}>
        UtilityBills
      </span>
    </div>
  );
}

// ── Divider with "or" ─────────────────────────────────────────
function OrDivider({ T }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ flex: 1, height: 1, background: T.border }}/>
      <span style={{ fontSize: 12, color: T.mutedFg, fontWeight: 500 }}>or</span>
      <div style={{ flex: 1, height: 1, background: T.border }}/>
    </div>
  );
}

// ── Auth card wrapper ─────────────────────────────────────────
function AuthCard({ T, children }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: T.pageBg,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', system-ui, sans-serif",
      WebkitFontSmoothing: 'antialiased',
      padding: '24px 16px',
    }}>
      <div style={{
        width: '100%', maxWidth: 400,
        display: 'flex', flexDirection: 'column', gap: 0,
      }}>
        {/* Card */}
        <div style={{
          background: T.cardBg,
          border: `1px solid ${T.cardBorder}`,
          borderRadius: 10,
          boxShadow: T.cardShadow,
          padding: '32px 28px',
          display: 'flex', flexDirection: 'column', gap: 0,
        }}>
          {children}
        </div>

        {/* Outside card: Legal note */}
        <p style={{
          margin: '20px 0 0', textAlign: 'center',
          fontSize: 11.5, color: T.mutedFg, lineHeight: 1.5,
        }}>
          By signing in you agree to the{' '}
          <a href="#" style={{ color: T.mutedFg, textDecoration: 'underline' }}>Terms of Service</a>
          {' '}and{' '}
          <a href="#" style={{ color: T.mutedFg, textDecoration: 'underline' }}>Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// SCREEN 1 + 3: Login (light / dark)
// ══════════════════════════════════════════════════════════════
function LoginScreen({ dark }) {
  const T = dark ? DARK : LIGHT;
  const [remember, setRemember] = useStA(false);

  return (
    <AuthCard T={T}>
      {/* Logo */}
      <div style={{ marginBottom: 28 }}>
        <LogoMark T={T}/>
      </div>

      {/* Heading */}
      <h1 style={{
        margin: '0 0 6px', fontSize: 24, fontWeight: 700,
        letterSpacing: -0.5, color: T.fg, textAlign: 'center',
      }}>Sign in</h1>
      <p style={{
        margin: '0 0 28px', fontSize: 14, color: T.mutedFg,
        textAlign: 'center', lineHeight: 1.45,
      }}>
        Track your utility bills across properties.
      </p>

      {/* Google button — always light bg (brand element) */}
      <button style={{
        width: '100%', height: 40,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        background: dark ? '#ffffff' : VIOLET.solid,
        color: dark ? '#1f1f1f' : '#ffffff',
        border: dark ? '1px solid #dadce0' : 'none',
        borderRadius: 6, fontSize: 14, fontWeight: 600,
        cursor: 'pointer', fontFamily: 'inherit',
        marginBottom: 14,
        boxShadow: dark ? '0 1px 2px rgba(0,0,0,0.12)' : 'none',
      }}>
        <GoogleG/>
        <span style={{ color: dark ? '#1f1f1f' : '#fff' }}>Continue with Google</span>
      </button>

      {/* Remember me */}
      <label style={{
        display: 'flex', alignItems: 'center', gap: 8,
        fontSize: 13, color: T.mutedFg, cursor: 'pointer',
        marginBottom: 20,
      }}>
        <div
          onClick={() => setRemember(r => !r)}
          style={{
            width: 16, height: 16, borderRadius: 4, flexShrink: 0,
            border: `1.5px solid ${remember ? VIOLET.solid : T.border}`,
            background: remember ? VIOLET.solid : T.inputBg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 120ms',
          }}
        >
          {remember && (
            <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 6l3 3 5-5"/>
            </svg>
          )}
        </div>
        Remember me for 30 days
      </label>

      {/* Divider */}
      <OrDivider T={T}/>

      {/* Demo button */}
      <button style={{
        width: '100%', height: 38,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        background: 'transparent',
        color: T.fg,
        border: `1px solid ${T.border}`,
        borderRadius: 6, fontSize: 14, fontWeight: 500,
        cursor: 'pointer', fontFamily: 'inherit',
        marginTop: 16, marginBottom: 8,
      }}>
        Try demo <AI.ArrowRight s={13} c={T.fg}/>
      </button>
      <p style={{ margin: 0, fontSize: 12.5, color: T.mutedFg, textAlign: 'center' }}>
        View a sample workspace. No account needed.
      </p>

      {/* Back to home — inside card bottom */}
      <a href="#" style={{
        display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'center',
        marginTop: 24,
        fontSize: 13, color: T.mutedFg, textDecoration: 'none',
      }}>
        <AI.ArrowLeft s={12} c={T.mutedFg}/> Back to home
      </a>
    </AuthCard>
  );
}

// ══════════════════════════════════════════════════════════════
// SCREEN 2 + 4: Auth error (light / dark)
// ══════════════════════════════════════════════════════════════
function AuthErrorScreen({ dark }) {
  const T = dark ? DARK : LIGHT;
  const errColor = dark ? '#f87171' : '#dc2626';
  const errBg    = dark ? '#27272a' : '#fef2f2';
  const errBorder= dark ? '#3f3f46' : '#fecaca';

  return (
    <AuthCard T={T}>
      {/* Logo */}
      <div style={{ marginBottom: 28 }}>
        <LogoMark T={T}/>
      </div>

      {/* Error icon */}
      <div style={{
        display: 'flex', justifyContent: 'center', marginBottom: 20,
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16,
          background: errBg, border: `1px solid ${errBorder}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <AI.AlertCircle s={32} c={errColor}/>
        </div>
      </div>

      {/* Heading */}
      <h1 style={{
        margin: '0 0 12px', fontSize: 22, fontWeight: 700,
        letterSpacing: -0.4, color: T.fg, textAlign: 'center',
      }}>
        Sign-in didn't complete
      </h1>
      <p style={{
        margin: '0 0 28px', fontSize: 13.5, color: T.mutedFg,
        textAlign: 'center', lineHeight: 1.55,
      }}>
        Access was denied during the sign-in process. This usually happens when sign-in is canceled or permission is declined.
      </p>

      {/* Try again */}
      <button style={{
        width: '100%', height: 40,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: VIOLET.solid, color: '#fff',
        border: 'none', borderRadius: 6,
        fontSize: 14, fontWeight: 600,
        cursor: 'pointer', fontFamily: 'inherit',
        marginBottom: 16,
      }}>
        Try again
      </button>

      {/* Back to home */}
      <a href="#" style={{
        display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'center',
        fontSize: 13, color: T.mutedFg, textDecoration: 'none',
      }}>
        <AI.ArrowLeft s={12} c={T.mutedFg}/> Back to home
      </a>
    </AuthCard>
  );
}

window.LoginScreen = LoginScreen;
window.AuthErrorScreen = AuthErrorScreen;
