import { createClient } from '@supabase/supabase-js';

// 🔧 如何获取你的 Supabase 凭证：
// 1. 访问 https://supabase.com 并注册/登录
// 2. 创建一个新项目
// 3. 进入项目设置 → API
// 4. 复制以下两个值：
//    - Project URL (格式: https://xxxxxxxxxxxx.supabase.co)
//    - anon/public key (以 'eyJ' 开头的长字符串)

// ⚠️ 重要：使用环境变量保护你的密钥（生产环境）
// 在 .env.local 文件中添加：
// VITE_SUPABASE_URL=你的URL
// VITE_SUPABASE_ANON_KEY=你的Key

// 从环境变量读取或使用默认值（开发用）
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL_HERE';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY_HERE';

// 创建 Supabase 客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// 🎮 贪吃蛇游戏数据库表结构（需要先在 Supabase 中创建）：
/*
-- 1. 用户表
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE,
  username TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. 游戏分数表
CREATE TABLE scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  level INTEGER DEFAULT 1,
  duration INTEGER, -- 游戏时长（秒）
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 3. 启用 Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- 4. 创建策略（允许公开读取分数，但只有用户自己能删除自己的分数）
CREATE POLICY "任何人都可以查看分数" ON scores FOR SELECT USING (true);
CREATE POLICY "用户可以插入自己的分数" ON scores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "用户可以删除自己的分数" ON scores FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "用户可以查看自己的信息" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "用户可以更新自己的信息" ON users FOR UPDATE USING (auth.uid() = id);
*/

// 📊 数据库操作函数
export const gameService = {
  // 提交分数
  async submitScore(userId, score, level = 1, duration = 0) {
    try {
      const { data, error } = await supabase
        .from('scores')
        .insert([
          {
            user_id: userId,
            score,
            level,
            duration,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('提交分数失败:', error);
      return { success: false, error };
    }
  },

  // 获取排行榜（前100名）
  async getLeaderboard(limit = 100) {
    try {
      const { data, error } = await supabase
        .from('scores')
        .select(`
          score,
          level,
          duration,
          created_at,
          user:users(username, avatar_url)
        `)
        .order('score', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('获取排行榜失败:', error);
      return { success: false, error };
    }
  },

  // 获取用户历史分数
  async getUserScores(userId, limit = 20) {
    try {
      const { data, error } = await supabase
        .from('scores')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('获取用户分数失败:', error);
      return { success: false, error };
    }
  },

  // 获取用户最高分
  async getUserHighScore(userId) {
    try {
      const { data, error } = await supabase
        .from('scores')
        .select('score')
        .eq('user_id', userId)
        .order('score', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('获取用户最高分失败:', error);
      return { success: false, error };
    }
  },
};

// 🔐 用户认证函数
export const authService = {
  // 邮箱注册
  async signUp(email, password, username) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (error) throw error;
      
      // 创建用户记录
      if (data.user) {
        await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              email: data.user.email,
              username,
            },
          ]);
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('注册失败:', error);
      return { success: false, error };
    }
  },

  // 邮箱登录
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('登录失败:', error);
      return { success: false, error };
    }
  },

  // 退出登录
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('退出失败:', error);
      return { success: false, error };
    }
  },

  // 获取当前用户
  getCurrentUser() {
    return supabase.auth.getUser();
  },

  // 监听认证状态变化
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// 导出所有服务
export default {
  supabase,
  gameService,
  authService,
};