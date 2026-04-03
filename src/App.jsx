import React from 'react';
import GameServiceProvider from './components/GameService';
import SnakeGame from './components/SnakeGame';
import GameHeader from './components/GameHeader';
import Leaderboard from './components/Leaderboard';
import GameStats from './components/GameStats';

function App() {
  return (
    <GameServiceProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <GameHeader />
        
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 游戏区域 */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">🎮 开始游戏</h2>
                  <p className="text-gray-600">使用方向键控制，空格键暂停，吃到食物得分！</p>
                </div>
                <SnakeGame />
              </div>
            </div>

            {/* 侧边栏 */}
            <div className="space-y-6">
              <Leaderboard />
              <GameStats />
              
              {/* 连接状态 */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-xl p-6 border border-blue-200">
                <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
                  <span className="mr-2">🔗</span> 连接状态
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">游戏模式</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      本地存储
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>当前使用本地存储保存分数。</p>
                    <p className="mt-2">要启用云端排行榜：</p>
                    <ol className="list-decimal pl-5 mt-1 space-y-1">
                      <li>配置 Supabase 环境变量</li>
                      <li>创建数据库表</li>
                      <li>重启应用</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* 页脚 */}
        <footer className="mt-12 py-6 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center space-x-2">
                  <div className="text-2xl">🐍</div>
                  <div>
                    <div className="font-bold">贪吃蛇大作战</div>
                    <div className="text-sm opacity-80">React + Vite + Tailwind CSS</div>
                  </div>
                </div>
              </div>
              <div className="text-center md:text-right">
                <div className="text-sm opacity-80 mb-2">© 2026 贪吃蛇游戏</div>
                <div className="text-xs opacity-60">使用方向键 ↑ ↓ ← → 控制，空格键暂停</div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </GameServiceProvider>
  );
}

export default App;