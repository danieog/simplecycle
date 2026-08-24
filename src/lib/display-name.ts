/**
 * Renders a stored full name as "First L." (first name + last initial).
 * Falls back gracefully for single-word names or missing values.
 */
export function formatDisplayName(fullName: string | null | undefined): string {
  if (!fullName) return "";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const first = parts[0];
  const lastInitial = parts[parts.length - 1][0];
  return `${first} ${lastInitial}.`;
}
