/**
 * Client-side rate limiting utility
 * Provides basic protection against spam submissions
 */

interface RateLimitEntry {
  count: number;
  firstAttempt: number;
  lastAttempt: number;
}

const STORAGE_KEY = 'rate_limit_data';
const DEFAULT_MAX_ATTEMPTS = 5;
const DEFAULT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

/**
 * Get rate limit data from localStorage
 */
function getRateLimitData(): Record<string, RateLimitEntry> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return {};
    
    const data = JSON.parse(stored);
    
    // Clean up expired entries
    const now = Date.now();
    const cleaned: Record<string, RateLimitEntry> = {};
    
    for (const [key, entry] of Object.entries(data)) {
      const typedEntry = entry as RateLimitEntry;
      if (now - typedEntry.firstAttempt < DEFAULT_WINDOW_MS) {
        cleaned[key] = typedEntry;
      }
    }
    
    return cleaned;
  } catch {
    return {};
  }
}

/**
 * Save rate limit data to localStorage
 */
function saveRateLimitData(data: Record<string, RateLimitEntry>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Check if an action is rate limited
 * @param actionKey - Unique identifier for the action (e.g., 'contact_form')
 * @param maxAttempts - Maximum attempts allowed in the time window
 * @param windowMs - Time window in milliseconds
 * @returns Object with isLimited boolean and remaining attempts
 */
export function checkRateLimit(
  actionKey: string,
  maxAttempts: number = DEFAULT_MAX_ATTEMPTS,
  windowMs: number = DEFAULT_WINDOW_MS
): { isLimited: boolean; remainingAttempts: number; resetTime: number } {
  const data = getRateLimitData();
  const now = Date.now();
  const entry = data[actionKey];

  if (!entry) {
    return { isLimited: false, remainingAttempts: maxAttempts, resetTime: 0 };
  }

  // Check if window has expired
  if (now - entry.firstAttempt >= windowMs) {
    delete data[actionKey];
    saveRateLimitData(data);
    return { isLimited: false, remainingAttempts: maxAttempts, resetTime: 0 };
  }

  const remaining = Math.max(0, maxAttempts - entry.count);
  const resetTime = entry.firstAttempt + windowMs;

  return {
    isLimited: entry.count >= maxAttempts,
    remainingAttempts: remaining,
    resetTime,
  };
}

/**
 * Record an action attempt for rate limiting
 * @param actionKey - Unique identifier for the action
 */
export function recordAttempt(actionKey: string): void {
  const data = getRateLimitData();
  const now = Date.now();
  const entry = data[actionKey];

  if (!entry || now - entry.firstAttempt >= DEFAULT_WINDOW_MS) {
    data[actionKey] = {
      count: 1,
      firstAttempt: now,
      lastAttempt: now,
    };
  } else {
    data[actionKey] = {
      ...entry,
      count: entry.count + 1,
      lastAttempt: now,
    };
  }

  saveRateLimitData(data);
}

/**
 * Format remaining time until rate limit reset
 */
export function formatResetTime(resetTime: number): string {
  const remaining = Math.max(0, resetTime - Date.now());
  const minutes = Math.ceil(remaining / 60000);
  
  if (minutes <= 1) return 'less than a minute';
  if (minutes < 60) return `${minutes} minutes`;
  
  const hours = Math.ceil(minutes / 60);
  return hours === 1 ? '1 hour' : `${hours} hours`;
}
