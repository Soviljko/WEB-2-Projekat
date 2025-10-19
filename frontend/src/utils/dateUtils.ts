/**
 * Simple date utility functions
 * With backend sending proper UTC dates with Z suffix, JavaScript handles conversion automatically
 */

/**
 * Formats a UTC date string for short display (e.g., "Jan 15, 2024")
 */
export const formatShortDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Formats a UTC date string with time (e.g., "January 15, 2024 at 2:30 PM")
 */
export const formatDateWithTime = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Formats a UTC date string with full month name and time
 */
export const formatUTCDate = (dateString: string, options: { includeTime?: boolean } = {}): string => {
  const formatOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  if (options.includeTime) {
    formatOptions.hour = '2-digit';
    formatOptions.minute = '2-digit';
    formatOptions.hour12 = true;
  }

  return new Date(dateString).toLocaleDateString('en-US', formatOptions);
};

/**
 * Converts a UTC date string to a Date object (for charts, comparisons, etc.)
 */
export const parseUTCDate = (dateString: string): Date => {
  return new Date(dateString);
};
