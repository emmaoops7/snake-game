import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { localStorageService } from '../utils/localStorageService';
import { supabase } from '../utils/supabaseClient';

const GameServiceContext = createContext();

export const GameServiceProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [authError, setAuthError] = useState('');

  // 初始化：检查已有会话 + 监听认证变化
  useEffect(() => {
    // 获取当前会话
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    // 监听登录/登出
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    // 加载本地排行榜
    const { success, data } = localStorageService.getLeaderboard(10);
    if (success) setLeaderboard(data);

    return () => subscription.unsubscribe();
  }, []);

  // 加载排行榜
  const loadLeaderboard = useCallback(async (limit = 10) => {
    const { success, data } = localStorageService.getLeaderboard(limit);
    if (success) setLeaderboard(data);
  }, []);

  // 提交分数（保存到本地 + 云端）
  const submitScore = useCallback(async (score, level = 1, duration = 0) => {
    // 本地保存
    const result = localStorageService.saveScore(score, level, duration);

    // 云端保存（如果已登录）
    if (user) {
      try {
        await supabase.from('scores').insert([{
          user_id: user.id,
          score,
          level,
          duration,
        }]);
      } catch (e) {
        console.log('云端保存失败，仅保存到本地:', e.message);
      }
    }

    await loadLeaderboard();
    return result;
  }, [user, loadLeaderboard]);

  // 注册
  const signUp = useCallback(async (email, password, username) => {
    setAuthError('');
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } },
      });
      if (error) {
        setAuthError(error.message);
        return { success: false, error };
      }
      setShowRegister(false);
      return { success: true, data };
    } catch (e) {
      setAuthError(e.message);
      return { success: false, error: e };
    }
  }, []);

  // 登录
  const signIn = useCallback(async (email, password) => {
    setAuthError('');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setAuthError(error.message);
        return { success: false, error };
      }
      setUser(data.user);
      setShowLogin(false);
      return { success: true, data };
    } catch (e) {
      setAuthError(e.message);
      return { success: false, error: e };
    }
  }, []);

  // 退出
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const getHighScore = useCallback(() => {
    return localStorageService.getHighScore();
  }, []);

  const value = {
    user,
    leaderboard,
    loading,
    showLogin,
    setShowLogin,
    showRegister,
    setShowRegister,
    authError,
    submitScore,
    signUp,
    signIn,
    signOut,
    getHighScore,
    loadLeaderboard,
  };

  return (
    <GameServiceContext.Provider value={value}>
      {children}
    </GameServiceContext.Provider>
  );
};

export const useGameService = () => {
  const context = useContext(GameServiceContext);
  if (!context) throw new Error('useGameService 必须在 GameServiceProvider 内使用');
  return context;
};

export default GameServiceProvider;
