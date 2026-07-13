export const toExternalHref = (website: string): string =>
  /^https?:\/\//i.test(website) ? website : `https://${website}`;
