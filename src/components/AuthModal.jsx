import React, { useState } from 'react';
import { useGameService } from './GameService';

const AuthModal = ({ type }) => {
  const {
    showLogin, setShowLogin,
    showRegister, setShowRegister,
    signIn, signUp, authError,
  } = useGameService();

  const isLogin = type === 'login';
  const show = isLogin ? showLogin : showRegister;
  const setShow = isLogin ? setShowLogin : setShowRegister;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      await signIn(email, password);
    } else {
      await signUp(email, password, username);
    }

    setLoading(false);
    setEmail('');
    setPassword('');
    setUsername('');
  };

  const switchType = () => {
    setShow(false);
    if (isLogin) {
      setShowRegister(true);
    } else {
      setShowLogin(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* 头部 */}
        <div className="bg-gradient-to-r from-snake-green to-emerald-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {isLogin ? '🐍 登录' : '✨ 注册'}
            </h2>
            <button
              onClick={() => setShow(false)}
              className="text-white hover:text-gray-200 text-2xl cursor-pointer"
            >
              ×
            </button>
          </div>
          <p className="text-sm opacity-80 mt-1">
            {isLogin ? '登录后可保存分数到云端排行榜' : '注册账号开始挑战全球玩家'}
          </p>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">昵称</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="你的游戏昵称"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-snake-green focus:border-transparent outline-none"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-snake-green focus:border-transparent outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-snake-green focus:border-transparent outline-none"
              required
              minLength={6}
            />
          </div>

          {authError && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
              {authError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-snake-green to-emerald-500 text-white font-bold rounded-lg hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? '处理中...' : (isLogin ? '登录' : '注册')}
          </button>

          <div className="text-center text-sm text-gray-500">
            {isLogin ? '还没有账号？' : '已有账号？'}
            <button
              type="button"
              onClick={switchType}
              className="text-snake-green font-medium ml-1 hover:underline cursor-pointer"
            >
              {isLogin ? '立即注册' : '立即登录'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
