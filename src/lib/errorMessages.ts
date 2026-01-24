/**
 * Maps technical error messages to user-friendly messages
 * Prevents exposing database schema, RLS policies, or internal system details
 */

const ERROR_PATTERNS: { pattern: RegExp; message: string }[] = [
  // Authentication errors
  { pattern: /invalid.*credentials|invalid.*password/i, message: 'Invalid email or password. Please try again.' },
  { pattern: /email.*not.*confirmed/i, message: 'Please verify your email address before signing in.' },
  { pattern: /user.*not.*found/i, message: 'Invalid email or password. Please try again.' },
  { pattern: /too.*many.*requests|rate.*limit/i, message: 'Too many attempts. Please wait a moment and try again.' },
  
  // RLS and permission errors
  { pattern: /row.*level.*security|rls/i, message: 'You do not have permission to perform this action.' },
  { pattern: /permission.*denied/i, message: 'You do not have permission to perform this action.' },
  { pattern: /unauthorized/i, message: 'Please sign in to continue.' },
  
  // Constraint violations
  { pattern: /duplicate.*key|unique.*constraint|already.*exists/i, message: 'This entry already exists. Please use a different value.' },
  { pattern: /foreign.*key.*constraint/i, message: 'This action cannot be completed due to related data.' },
  { pattern: /not.*null.*constraint/i, message: 'Please fill in all required fields.' },
  { pattern: /check.*constraint/i, message: 'The provided data does not meet the required format.' },
  
  // Network errors
  { pattern: /network.*error|fetch.*failed|connection.*refused/i, message: 'Unable to connect. Please check your internet connection.' },
  { pattern: /timeout/i, message: 'The request took too long. Please try again.' },
  
  // Generic database errors
  { pattern: /database|postgres|supabase/i, message: 'An error occurred. Please try again later.' },
];

/**
 * Converts technical error messages to user-friendly messages
 */
export function getSafeErrorMessage(error: unknown): string {
  const message = error instanceof Error 
    ? error.message 
    : typeof error === 'string' 
      ? error 
      : 'An unexpected error occurred.';

  // Check against known patterns
  for (const { pattern, message: safeMessage } of ERROR_PATTERNS) {
    if (pattern.test(message)) {
      return safeMessage;
    }
  }

  // Default safe message for unknown errors
  return 'An error occurred. Please try again.';
}

/**
 * Checks if an error is related to rate limiting
 */
export function isRateLimitError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /too.*many.*requests|rate.*limit/i.test(message);
}
