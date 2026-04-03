# 🚀 Supabase 配置指南

## 第一步：创建 Supabase 项目

1. **访问** [https://supabase.com](https://supabase.com)
2. **注册/登录** 你的账户
3. **点击 "New Project"** 创建新项目
4. **填写项目信息**：
   - 项目名称：`snake-game`（或其他名称）
   - 数据库密码：记下来（重要！）
   - 地区：选择离你最近的（如 `ap-southeast-1` 新加坡）
5. **点击 "Create new project"**（等待2-3分钟创建完成）

## 第二步：获取 API 凭证

1. 进入项目后，点击左侧菜单 **Settings** → **API**
2. 复制以下两个值：

```
Project URL: https://xxxxxxxxxxxx.supabase.co
anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 第三步：配置本地环境

1. **复制环境变量文件**：
   ```bash
   cp .env.example .env.local
   ```

2. **编辑 `.env.local` 文件**，填入你的凭证：
   ```env
   VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## 第四步：创建数据库表

### 方法一：使用 SQL 编辑器（推荐）

1. 在 Supabase 左侧菜单点击 **SQL Editor**
2. 点击 **New query**
3. 复制 `supabase_schema.sql` 文件中的所有内容
4. 粘贴到编辑器中，点击 **Run**
5. 看到 "✅ 表创建成功" 表示成功

### 方法二：使用 Table Editor（可视化）

1. 点击左侧菜单 **Table Editor**
2. 点击 **Create a new table**
3. 创建 `users` 表：
   - 添加字段：`id` (uuid, primary key), `email` (text), `username` (text), `avatar_url` (text), `created_at` (timestamp)
4. 创建 `scores` 表：
   - 添加字段：`id` (uuid, primary key), `user_id` (uuid, foreign key to users.id), `score` (integer), `level` (integer), `duration` (integer), `created_at` (timestamp)

## 第五步：配置认证

1. 点击左侧菜单 **Authentication** → **Providers**
2. 确保 **Email** 已启用
3. 点击 **Settings**，配置：
   - **Site URL**: `http://localhost:5173`（开发环境）
   - **Redirect URLs**: 添加 `http://localhost:5173/**`
4. 点击 **Save**

## 第六步：测试连接

1. 启动开发服务器：
   ```bash
   npm run dev
   ```

2. 访问 `http://localhost:5173`
3. 游戏应该能正常运行
4. 尝试注册/登录功能（需要先配置环境变量）

## 🔧 故障排除

### 问题1：CORS 错误
**解决**：在 Supabase 项目设置中：
1. 点击 **Settings** → **API**
2. 在 **CORS** 部分添加：`http://localhost:5173`
3. 点击 **Save**

### 问题2：RLS 策略错误
**解决**：运行以下 SQL 重置策略：
```sql
-- 删除现有策略
DROP POLICY IF EXISTS "任何人都可以查看分数" ON scores;
DROP POLICY IF EXISTS "用户可以插入自己的分数" ON scores;
DROP POLICY IF EXISTS "用户可以删除自己的分数" ON scores;
DROP POLICY IF EXISTS "用户可以查看自己的信息" ON users;
DROP POLICY IF EXISTS "用户可以更新自己的信息" ON users;

-- 重新创建策略（使用 supabase_schema.sql 中的策略）
```

### 问题3：环境变量不生效
**解决**：
1. 确保文件名为 `.env.local`（不是 `.env`）
2. 重启开发服务器：`npm run dev`
3. 检查控制台是否有错误

## 📱 移动端配置

如果要部署到生产环境：

1. 在 Supabase **Authentication** → **URL Configuration** 中：
   - 添加你的生产域名到 **Site URL** 和 **Redirect URLs**
2. 在 **API** → **CORS** 中添加生产域名
3. 更新 `.env.production` 文件中的 URL

## 🎯 快速验证

运行以下命令测试连接：
```bash
# 检查环境变量
echo "URL: $VITE_SUPABASE_URL"
echo "Key: $VITE_SUPABASE_ANON_KEY"

# 测试 API 端点
curl -X GET "$VITE_SUPABASE_URL/rest/v1/" \
  -H "apikey: $VITE_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json"
```

如果看到 JSON 响应，说明连接成功！

## 📞 获取帮助

- Supabase 文档：https://supabase.com/docs
- Discord 社区：https://discord.supabase.com
- GitHub Issues：https://github.com/supabase/supabase/issues