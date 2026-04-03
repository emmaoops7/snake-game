import { createClient } from '@supabase/supabase-js';
import { localStorageService, mockAuthService } from './localStorageService';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 无论 Supabase 是否配置，都创建客户端（可能为 null）
const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;

// 是否配置了 Supabase（非空即算配置，实际连接在使用时验证）
const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export { supabase, isSupabaseConfigured };
