function normalizeEmail(value: string | null | undefined): string | null {
  return value?.trim().toLowerCase() || null;
}

export function isOwnerEmail(email: string | null | undefined, owner = process.env.AUTH_OWNER_EMAIL): boolean {
  const expected = normalizeEmail(owner);
  return expected !== null && normalizeEmail(email) === expected;
}
