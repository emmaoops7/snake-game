-- 🐍 贪吃蛇游戏数据库表结构
-- 在 Supabase SQL 编辑器中运行此脚本

-- 1. 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE,
  username TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. 创建游戏分数表
CREATE TABLE IF NOT EXISTS scores (
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

-- 分数表策略
CREATE POLICY "任何人都可以查看分数" ON scores FOR SELECT USING (true);
CREATE POLICY "用户可以插入自己的分数" ON scores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "用户可以删除自己的分数" ON scores FOR DELETE USING (auth.uid() = user_id);

-- 用户表策略
CREATE POLICY "用户可以查看自己的信息" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "用户可以更新自己的信息" ON users FOR UPDATE USING (auth.uid() = id);

-- 5. 创建索引（提高查询性能）
CREATE INDEX IF NOT EXISTS idx_scores_score ON scores(score DESC);
CREATE INDEX IF NOT EXISTS idx_scores_user_id ON scores(user_id);
CREATE INDEX IF NOT EXISTS idx_scores_created_at ON scores(created_at DESC);

-- 6. 创建视图：排行榜（包含用户信息）
CREATE OR REPLACE VIEW leaderboard_view AS
SELECT 
  s.id,
  s.score,
  s.level,
  s.duration,
  s.created_at,
  u.username,
  u.avatar_url,
  RANK() OVER (ORDER BY s.score DESC) as rank
FROM scores s
LEFT JOIN users u ON s.user_id = u.id
ORDER BY s.score DESC
LIMIT 100;

-- 7. 创建函数：获取用户排名
CREATE OR REPLACE FUNCTION get_user_rank(user_uuid UUID)
RETURNS TABLE (
  user_rank BIGINT,
  user_score INTEGER,
  total_players BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH ranked_scores AS (
    SELECT 
      user_id,
      MAX(score) as max_score,
      RANK() OVER (ORDER BY MAX(score) DESC) as rank_num
    FROM scores
    GROUP BY user_id
  ),
  total_players AS (
    SELECT COUNT(DISTINCT user_id) as total FROM scores
  )
  SELECT 
    rs.rank_num,
    rs.max_score::INTEGER,
    tp.total
  FROM ranked_scores rs
  CROSS JOIN total_players tp
  WHERE rs.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- 8. 测试数据（可选）
INSERT INTO users (id, email, username) VALUES 
  ('11111111-1111-1111-1111-111111111111', 'test1@example.com', '玩家1'),
  ('22222222-2222-2222-2222-222222222222', 'test2@example.com', '玩家2')
ON CONFLICT (id) DO NOTHING;

INSERT INTO scores (user_id, score, level, duration) VALUES
  ('11111111-1111-1111-1111-111111111111', 850, 3, 120),
  ('11111111-1111-1111-1111-111111111111', 650, 2, 90),
  ('22222222-2222-2222-2222-222222222222', 920, 4, 150),
  ('22222222-2222-2222-2222-222222222222', 780, 3, 110)
ON CONFLICT DO NOTHING;

-- 9. 验证表创建成功
SELECT '✅ 表创建成功' as status;

-- 查看表结构
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name IN ('users', 'scores')
ORDER BY table_name, ordinal_position;