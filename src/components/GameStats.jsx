import React from 'react';
import { useGameService } from './GameService';

const GameStats = () => {
  const { leaderboard, getHighScore } = useGameService();
  
  const totalPlayers = leaderboard.length;
  const totalScore = leaderboard.reduce((sum, item) => sum + (item.score || 0), 0);
  const averageScore = totalPlayers > 0 ? Math.round(totalScore / totalPlayers) : 0;
  const highScore = getHighScore();

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-xl p-6 border border-purple-200">
      <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
        <span className="mr-2">📊</span> 游戏统计
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-white rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-purple-600">{totalPlayers}</div>
          <div className="text-sm text-gray-600">总玩家</div>
        </div>
        
        <div className="text-center p-3 bg-white rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-purple-600">{highScore}</div>
          <div className="text-sm text-gray-600">最高分</div>
        </div>
        
        <div className="text-center p-3 bg-white rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-purple-600">{averageScore}</div>
          <div className="text-sm text-gray-600">平均分</div>
        </div>
        
        <div className="text-center p-3 bg-white rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-purple-600">{totalScore}</div>
          <div className="text-sm text-gray-600">总得分</div>
        </div>
      </div>
      
      <div className="mt-6">
        <h4 className="font-semibold text-purple-700 mb-2">🎯 游戏规则</h4>
        <ul className="space-y-2 text-sm text-purple-600">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>使用 <strong>↑ ↓ ← →</strong> 方向键控制</span>
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
      
      <div className="mt-6 pt-4 border-t border-purple-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">游戏版本</span>
          <span className="font-medium">v1.0.0</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-gray-600">最后更新</span>
          <span className="font-medium">刚刚</span>
        </div>
      </div>
    </div>
  );
};

export default GameStats;