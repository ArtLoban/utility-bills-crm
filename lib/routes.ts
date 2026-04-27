export const ROUTES = {
  home: "/",
  login: "/login",
  dashboard: "/dashboard",
  properties: "/properties",
  bills: "/bills",
  payments: "/payments",
  settings: "/settings",
  admin: {
    root: "/art-admin",
    properties: "/art-admin/properties",
    users: "/art-admin/users",
    landing: "/art-admin/landing",
  },
} as const;
