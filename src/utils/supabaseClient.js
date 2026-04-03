import { createClient } from '@supabase/supabase-js';

// Supabase 配置（anon key 是公开的，可以直接写在前端代码中）
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ptgsdbyhvtipskjvfyjh.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_8gngfjSIVnYPGk_O65qXkQ_xA9NMvVR';

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

const isSupabaseConfigured = true;

export { supabase, isSupabaseConfigured };
