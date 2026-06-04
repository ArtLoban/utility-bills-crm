export const getInitials = (name: string | null, email: string | null): string => {
  if (name) {
    const parts = name.trim().split(" ");
    const first = parts[0]?.charAt(0) ?? "";
    const last = parts[parts.length - 1]?.charAt(0) ?? "";
    return (parts.length >= 2 ? first + last : first).toUpperCase();
  }
  return email ? email.charAt(0).toUpperCase() : "U";
};
