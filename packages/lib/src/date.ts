/**
 * Format a timestamp or Date object to a human-readable date string
 */
export function formatDate(date: Date | number, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === "number" ? new Date(date) : date;

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return dateObj.toLocaleDateString("en-US", options || defaultOptions);
}

/**
 * Format a timestamp or Date object to a short date string (MM/DD/YYYY)
 */
export function formatDateShort(date: Date | number): string {
  const dateObj = typeof date === "number" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

/**
 * Format a timestamp or Date object to include time
 */
export function formatDateTime(date: Date | number): string {
  const dateObj = typeof date === "number" ? new Date(date) : date;
  return dateObj.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Get relative time string (e.g., "2 hours ago", "3 days ago")
 */
export function formatRelativeTime(date: Date | number): string {
  const dateObj = typeof date === "number" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSecs < 60) {
    return "just now";
  } else if (diffMins < 60) {
    return `${diffMins} ${diffMins === 1 ? "minute" : "minutes"} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
  } else if (diffWeeks < 4) {
    return `${diffWeeks} ${diffWeeks === 1 ? "week" : "weeks"} ago`;
  } else if (diffMonths < 12) {
    return `${diffMonths} ${diffMonths === 1 ? "month" : "months"} ago`;
  } else {
    return `${diffYears} ${diffYears === 1 ? "year" : "years"} ago`;
  }
}

/**
 * Format a date range
 */
export function formatDateRange(start: Date | number, end?: Date | number | null): string {
  const startStr = formatDate(start, { year: "numeric", month: "short" });

  if (!end) {
    return `${startStr} - Present`;
  }

  const endStr = formatDate(end, { year: "numeric", month: "short" });
  return `${startStr} - ${endStr}`;
}
