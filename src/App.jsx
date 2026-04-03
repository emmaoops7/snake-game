import React from 'react';
import SnakeGame from './components/SnakeGame';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 导航栏 */}
      <nav className="bg-gradient-to-r from-snake-green to-emerald-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="text-3xl">🐍</div>
              <div>
                <h1 className="text-2xl font-bold">贪吃蛇大作战</h1>
                <p className="text-sm opacity-80">全球排行榜 | 实时对战</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition">
                登录
              </button>
              <button className="px-4 py-2 bg-white text-snake-green font-semibold rounded-lg hover:bg-gray-100 transition">
                注册
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 主内容 */}
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
            {/* 排行榜 */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">🏆</span> 全球排行榜
              </h3>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((rank) => (
                  <div key={rank} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 ${
                        rank === 1 ? 'bg-yellow-100 text-yellow-600' :
                        rank === 2 ? 'bg-gray-100 text-gray-600' :
                        rank === 3 ? 'bg-orange-100 text-orange-600' :
                        'bg-gray-50 text-gray-500'
                      }`}>
                        {rank}
                      </div>
                      <div>
                        <div className="font-medium">玩家{rank}</div>
                        <div className="text-sm text-gray-500">等级 {rank}</div>
                      </div>
                    </div>
                    <div className="font-bold text-snake-green">{1000 - rank * 150} 分</div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-snake-green to-emerald-500 text-white font-semibold rounded-lg hover:opacity-90 transition">
                查看完整榜单
              </button>
            </div>

            {/* 游戏说明 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-xl p-6 border border-blue-200">
              <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
                <span className="mr-2">📖</span> 游戏规则
              </h3>
              <ul className="space-y-3 text-blue-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>使用 <strong>↑ ↓ ← →</strong> 方向键控制蛇移动</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>吃到 <span className="text-red-500">红色食物</span> 得10分</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>每100分游戏速度加快</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>撞墙或撞到自己游戏结束</span>
                </li>
              </ul>
            </div>

            {/* 统计信息 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-xl p-6 border border-purple-200">
              <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
                <span className="mr-2">📊</span> 今日统计
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">1,234</div>
                  <div className="text-sm text-gray-600">在线玩家</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">5,678</div>
                  <div className="text-sm text-gray-600">总对局</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">9,876</div>
                  <div className="text-sm text-gray-600">最高分</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">12.3k</div>
                  <div className="text-sm text-gray-600">总得分</div>
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
                  <div className="text-sm opacity-80">React + Supabase 构建</div>
                </div>
              </div>
            </div>
            <div className="text-center md:text-right">
              <div className="text-sm opacity-80 mb-2">© 2026 贪吃蛇游戏. 保留所有权利.</div>
              <div className="text-xs opacity-60">使用方向键控制，享受游戏乐趣！</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;