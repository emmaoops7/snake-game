import React from 'react';
import { GameServiceProvider } from './components/GameService';
import SnakeGame from './components/SnakeGame';
import GameHeader from './components/GameHeader';
import Leaderboard from './components/Leaderboard';
import AuthModal from './components/AuthModal';

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
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">🎮 开始游戏</h2>
                  <p className="text-gray-500 text-sm mt-1">方向键控制移动 · 空格暂停 · 吃到食物得分</p>
                </div>
                <SnakeGame />
              </div>
            </div>

            {/* 侧边栏 */}
            <div className="space-y-6">
              <Leaderboard />

              {/* 规则说明 */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">📖 游戏规则</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• <strong>↑ ↓ ← →</strong> 控制蛇移动</li>
                  <li>• 吃红色食物 +10 分</li>
                  <li>• 每 100 分游戏加速</li>
                  <li>• 撞墙或撞自己 = 游戏结束</li>
                  <li>• 分数自动保存到排行榜</li>
                </ul>
              </div>
            </div>
          </div>
        </main>

        {/* 页脚 */}
        <footer className="mt-8 py-4 bg-gray-800 text-center text-gray-400 text-sm">
          🐍 贪吃蛇大作战 · React + Tailwind CSS + Supabase
        </footer>

        {/* 登录/注册弹窗 */}
        <AuthModal type="login" />
        <AuthModal type="register" />
      </div>
    </GameServiceProvider>
  );
}

export default App;
