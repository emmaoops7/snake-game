import React, { useState } from 'react';
import { useGameService } from './GameService';

const GameHeader = () => {
  const { user, signOut, isOnline, setShowLogin, setShowRegister } = useGameService();

  return (
    <nav className="bg-gradient-to-r from-snake-green to-emerald-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="text-3xl">🐍</div>
            <div>
              <h1 className="text-2xl font-bold">贪吃蛇大作战</h1>
              <p className="text-sm opacity-80">
                {isOnline ? '全球排行榜 | 实时对战' : '本地游戏 | 离线模式'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></div>
              <span className="text-sm">{isOnline ? '在线模式' : '离线模式'}</span>
            </div>

            {user ? (
              <div className="flex items-center space-x-3">
                <div className="text-sm">
                  <div className="font-medium">{user.email?.split('@')[0] || '玩家'}</div>
                  <div className="text-xs opacity-80">已登录</div>
                </div>
                <button
                  onClick={signOut}
                  className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition"
                >
                  退出
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowLogin(true)}
                  className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition cursor-pointer"
                >
                  登录
                </button>
                <button
                  onClick={() => setShowRegister(true)}
                  className="px-4 py-2 bg-white text-snake-green font-semibold rounded-lg hover:bg-gray-100 transition cursor-pointer"
                >
                  注册
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default GameHeader;
