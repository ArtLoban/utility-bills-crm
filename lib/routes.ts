export const ROUTES = {
  home: "/",
  about: "/about",
  project: "/project",
  login: "/login",
  dashboard: "/dashboard",
  properties: "/properties",
  providers: "/providers",
  bills: "/bills",
  meters: "/meters",
  payments: "/payments",
  settings: "/settings",
  admin: {
    root: "/art-admin",
    properties: "/art-admin/properties",
    users: "/art-admin/users",
    landing: "/art-admin/landing",
  },
} as const;
