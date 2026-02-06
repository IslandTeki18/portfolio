/**
 * Check if a string is a valid HTTP/HTTPS URL
 */
export function isValidHttpUrl(value?: string): boolean {
  if (!value || typeof value !== "string") {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Ensure a URL has a protocol, defaulting to https://
 */
export function ensureProtocol(url: string): string {
  if (!url) return url;

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `https://${url}`;
}

/**
 * Extract domain from a URL
 */
export function extractDomain(url: string): string | null {
  try {
    const urlObj = new URL(ensureProtocol(url));
    return urlObj.hostname;
  } catch {
    return null;
  }
}
