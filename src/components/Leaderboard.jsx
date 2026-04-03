import React, { useEffect } from 'react';
import { useGameService } from './GameService';

const Leaderboard = () => {
  const { leaderboard, loading, loadLeaderboard, isOnline } = useGameService();

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-100 to-yellow-50 border-yellow-200';
      case 2: return 'bg-gradient-to-r from-gray-100 to-gray-50 border-gray-200';
      case 3: return 'bg-gradient-to-r from-orange-100 to-orange-50 border-orange-200';
      default: return 'bg-gray-50 border-gray-100';
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return rank;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <span className="mr-2">🏆</span> 排行榜
        </h3>
        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
          {isOnline ? '云端' : '本地'}
        </span>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-snake-green mx-auto"></div>
          <p className="mt-2 text-gray-500">加载中...</p>
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-gray-500">暂无游戏记录</p>
          <p className="text-sm text-gray-400 mt-1">开始游戏创建记录吧！</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboard.slice(0, 5).map((item, index) => (
            <div 
              key={item.id || index}
              className={`flex items-center justify-between p-3 rounded-lg border ${getRankColor(index + 1)} hover:shadow-sm transition`}
            >
              <div className="flex items-center">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 ${
                  index === 0 ? 'bg-yellow-100 text-yellow-600' :
                  index === 1 ? 'bg-gray-100 text-gray-600' :
                  index === 2 ? 'bg-orange-100 text-orange-600' :
                  'bg-gray-50 text-gray-500'
                }`}>
                  {getRankIcon(index + 1)}
                </div>
                <div>
                  <div className="font-medium">
                    {item.user?.username || item.username || '匿名玩家'}
                  </div>
                  <div className="text-sm text-gray-500">
                    等级 {item.level || 1}
                    {item.duration && ` · ${Math.floor(item.duration / 60)}分${item.duration % 60}秒`}
                  </div>
                </div>
              </div>
              <div className="font-bold text-snake-green text-lg">
                {item.score} 分
              </div>
            </div>
          ))}
        </div>
      )}
      
      {leaderboard.length > 0 && (
        <button 
          onClick={() => loadLeaderboard()}
          className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-snake-green to-emerald-500 text-white font-semibold rounded-lg hover:opacity-90 transition flex items-center justify-center"
        >
          <span>刷新榜单</span>
          <span className="ml-2">🔄</span>
        </button>
      )}
      
      <div className="mt-4 text-xs text-gray-500">
        <p>榜单每5分钟自动更新</p>
        {!isOnline && (
          <p className="text-yellow-600 mt-1">
            ⚠️ 当前为本地模式，分数仅保存在浏览器中
          </p>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;