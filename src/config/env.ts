/**
 * Central Environment Configuration & Validation Module
 * Validates public client variables and flags missing configuration without exposing secrets.
 */

export interface AppEnvConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  isSupabaseConfigured: boolean;
  appUrl: string;
  isProduction: boolean;
}

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const rawAppUrl = import.meta.env.VITE_APP_URL || (typeof window !== 'undefined' ? window.location.origin : '');

// Check if variables are populated with real values rather than default template placeholders
const isValidSupabaseConfig = Boolean(
  rawSupabaseUrl &&
  rawSupabaseAnonKey &&
  !rawSupabaseUrl.includes('your-project-id.supabase.co') &&
  !rawSupabaseAnonKey.includes('your-anon-public-key') &&
  (rawSupabaseUrl.startsWith('https://') || rawSupabaseUrl.startsWith('http://'))
);

export const env: AppEnvConfig = {
  supabaseUrl: rawSupabaseUrl,
  supabaseAnonKey: rawSupabaseAnonKey,
  isSupabaseConfigured: isValidSupabaseConfig,
  appUrl: rawAppUrl,
  isProduction: import.meta.env.PROD
};

/**
 * Diagnostic helper to report environment status cleanly to developers
 */
export function getEnvironmentDiagnostics(): { valid: boolean; missing: string[]; hints: string[] } {
  const missing: string[] = [];
  const hints: string[] = [];

  if (!rawSupabaseUrl || rawSupabaseUrl.includes('your-project-id.supabase.co')) {
    missing.push('VITE_SUPABASE_URL');
  }
  if (!rawSupabaseAnonKey || rawSupabaseAnonKey.includes('your-anon-public-key')) {
    missing.push('VITE_SUPABASE_ANON_KEY');
  }

  if (missing.length > 0) {
    hints.push(
      `Please provide your Supabase project URL and anon public key in your environment (.env or Vercel Project Settings).`
    );
  }

  return {
    valid: missing.length === 0,
    missing,
    hints
  };
}
