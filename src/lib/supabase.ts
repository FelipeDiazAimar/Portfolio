import { createClient } from '@supabase/supabase-js';

// The following keys are public and safe to be bundled in the client code
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uxeamrctpwwyinrgnalz.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4ZWFtcmN0cHd3eWlucmduYWx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMDc5ODMsImV4cCI6MjA5MjY4Mzk4M30.8T0emtbreLPMJOuZarLXRAvPCbmEtUxaAIfCkrzc49c';

// Helper to create a proxy that prevents "undefined" property access crashes
const createSafeProxy = (obj: any) => {
  return new Proxy(obj, {
    get: (target, prop) => {
      if (prop in target) return target[prop];
      if (prop === 'auth') return { 
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null })
      };
      if (prop === 'from') return () => createSafeProxy({});
      return undefined;
    }
  });
};

let client;
try {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase keys');
  }
  client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
} catch (e) {
  console.error('Supabase client initialization failed:', e);
  client = createSafeProxy({});
}

export const supabase = client;

// Administrative client to bypass RLS (server-side only)
export const getSupabaseAdmin = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey || !supabaseUrl) return supabase;
  try {
    return createClient(supabaseUrl, serviceRoleKey);
  } catch (e) {
    return supabase;
  }
};
