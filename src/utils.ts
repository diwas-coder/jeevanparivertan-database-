/**
 * Utility functions for date calculations and formatting.
 */

/**
 * Calculates the number of days between an admit date and today.
 * Falls back to a provided number if the date is invalid or parsing fails.
 */
export function getDaysAdmitted(admitDateStr: string, fallbackDays: number = 1): number {
  if (!admitDateStr) return fallbackDays;
  try {
    const parsedAdmit = Date.parse(admitDateStr);
    if (isNaN(parsedAdmit)) {
      return fallbackDays;
    }
    const admitDate = new Date(parsedAdmit);
    const today = new Date();
    
    // Clear times to calculate exact day differences
    const start = new Date(admitDate.getFullYear(), admitDate.getMonth(), admitDate.getDate());
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays < 0 ? 0 : diffDays;
  } catch (error) {
    return fallbackDays;
  }
}

/**
 * Converts a parseable date string to HTML5 date input format (YYYY-MM-DD).
 */
export function formatDateToInput(dateStr: string): string {
  try {
    const parsed = Date.parse(dateStr);
    if (isNaN(parsed)) {
      return new Date().toISOString().split('T')[0];
    }
    const d = new Date(parsed);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

/**
 * Converts an HTML5 date input string (YYYY-MM-DD) to long format (e.g. "October 14, 2025").
 */
export function formatDateToLongString(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      return dateStr;
    }
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}
