export function compactWhitespace(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}
