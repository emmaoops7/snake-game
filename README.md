# 🐍 贪吃蛇大作战

一个现代化的贪吃蛇游戏，带本地/云端排行榜系统。

## 🚀 在线演示

- **本地开发**: http://localhost:5174
- **GitHub 仓库**: https://github.com/emmaoops7/snake-game

## ✨ 功能特性

### 🎮 游戏功能
- 完整的贪吃蛇游戏逻辑
- 方向键控制（↑ ↓ ← →）
- 空格键暂停/继续
- 分数系统（每10分加速）
- 本地最高分存储

### 📊 排行榜系统
- **本地模式**: 使用 localStorage 保存分数
- **云端模式**: 支持 Supabase 云端数据库
- 实时排行榜更新
- 游戏统计信息

### 🎨 界面设计
- 响应式设计（手机/电脑）
- 现代化 UI（Tailwind CSS）
- 游戏状态实时显示
- 排行榜可视化

## 🛠️ 技术栈

- **前端**: React 18 + Vite
- **样式**: Tailwind CSS
- **状态管理**: React Context
- **数据存储**: 
  - 本地: localStorage
  - 云端: Supabase (PostgreSQL)
- **构建工具**: Vite

## 📦 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/emmaoops7/snake-game.git
cd snake-game
```

### 2. 安装依赖
```bash
npm install
```

### 3. 启动开发服务器
```bash
npm run dev
```

### 4. 打开浏览器
访问 http://localhost:5174

## ☁️ Supabase 配置（可选）

要启用云端功能：

### 1. 创建 Supabase 项目
1. 访问 https://supabase.com
2. 创建新项目
3. 获取 Project URL 和 anon key

### 2. 配置环境变量
复制 `.env.example` 为 `.env.local`：
```bash
cp .env.example .env.local
```

编辑 `.env.local`：
```env
VITE_SUPABASE_URL=你的项目URL
VITE_SUPABASE_ANON_KEY=你的anon key
```

### 3. 创建数据库表
在 Supabase SQL 编辑器中运行 `supabase_schema.sql`

### 4. 配置 CORS
在 Supabase 设置中添加：
- Site URL: `http://localhost:5174`
- Redirect URLs: `http://localhost:5174/**`

## 🚀 部署

### Vercel 部署（推荐）
1. 推送代码到 GitHub
2. 访问 https://vercel.com
3. 导入 GitHub 仓库
4. 配置环境变量
5. 点击 Deploy

### 构建生产版本
```bash
npm run build
```

构建文件在 `dist/` 目录

## 📁 项目结构

```
snake-game/
├── src/
│   ├── components/
│   │   ├── SnakeGame.jsx     # 游戏主组件
│   │   ├── GameService.jsx   # 游戏服务上下文
│   │   ├── GameHeader.jsx    # 导航栏
│   │   ├── Leaderboard.jsx   # 排行榜
│   │   └── GameStats.jsx     # 游戏统计
│   ├── utils/
│   │   ├── supabaseClient.js # Supabase 配置
│   │   └── localStorageService.js # 本地存储
│   ├── App.jsx              # 主应用
│   └── main.jsx             # 入口文件
├── public/                  # 静态资源
├── supabase_schema.sql     # 数据库表结构
├── .env.example            # 环境变量示例
└── package.json            # 项目配置
```

## 🎯 游戏控制

- **↑ ↓ ← →**: 控制蛇移动方向
- **空格键**: 暂停/继续游戏
- **点击开始**: 开始新游戏
- **游戏结束**: 显示分数并自动保存

## 🔧 开发说明

### 本地存储模式
- 无需配置，开箱即用
- 分数保存在浏览器 localStorage
- 支持离线游戏

### 云端模式
- 需要 Supabase 配置
- 支持多设备同步
- 真正的全球排行榜

### 自定义配置
- 修改 `tailwind.config.js` 调整样式
- 编辑游戏参数（网格大小、速度等）
- 添加新的游戏模式

## 📄 许可证

MIT License

## 🤝 贡献

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📞 联系

- GitHub: [@emmaoops7](https://github.com/emmaoops7)
- 问题反馈: [Issues](https://github.com/emmaoops7/snake-game/issues)

---

**立即开始游戏**: http://localhost:5174