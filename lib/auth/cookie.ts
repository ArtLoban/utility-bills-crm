// Auth.js v5 uses a __Secure- prefix on the session cookie when AUTH_URL is HTTPS.
// This helper mirrors that logic so the /auth/demo route handler sets the same
// cookie Auth.js reads on every request.
export const getSessionCookieConfig = () => {
  const useSecureCookies = process.env.AUTH_URL?.startsWith("https://") ?? false;
  return {
    name: `${useSecureCookies ? "__Secure-" : ""}authjs.session-token`,
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      path: "/",
      secure: useSecureCookies,
    },
  };
};
