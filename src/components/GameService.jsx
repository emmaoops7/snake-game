import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { localStorageService, mockAuthService } from '../utils/localStorageService';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';

const GameServiceContext = createContext();

export const GameServiceProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(false);
  const [user, setUser] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [authError, setAuthError] = useState('');

  // 初始化
  useEffect(() => {
    const init = async () => {
      setLoading(true);

      if (isSupabaseConfigured && supabase) {
        try {
          // 检查当前会话
          const { data: { session }, error } = await supabase.auth.getSession();
          if (!error) {
            setIsOnline(true);
            setUser(session?.user || null);

            // 监听认证状态变化
            supabase.auth.onAuthStateChange((_event, session) => {
              setUser(session?.user || null);
            });
          } else {
            setIsOnline(false);
          }
        } catch {
          setIsOnline(false);
        }
      } else {
        setIsOnline(false);
      }

      // 加载排行榜
      const { success, data } = localStorageService.getLeaderboard(10);
      if (success) setLeaderboard(data);

      setLoading(false);
    };

    init();
  }, []);

  // 加载排行榜
  const loadLeaderboard = useCallback(async (limit = 10) => {
    if (isOnline && supabase) {
      try {
        const { data, error } = await supabase
          .from('scores')
          .select('score, level, duration, created_at, user:users(username, avatar_url)')
          .order('score', { ascending: false })
          .limit(limit);
        if (!error && data) {
          setLeaderboard(data);
          return;
        }
      } catch (e) {
        console.error('云端排行榜加载失败:', e);
      }
    }
    // 回退到本地
    const { success, data } = localStorageService.getLeaderboard(limit);
    if (success) setLeaderboard(data);
  }, [isOnline]);

  // 提交分数
  const submitScore = useCallback(async (score, level = 1, duration = 0) => {
    // 先保存到本地
    const result = localStorageService.saveScore(score, level, duration);

    // 如果在线且已登录，也提交到云端
    if (isOnline && supabase && user) {
      try {
        await supabase.from('scores').insert([{
          user_id: user.id,
          score,
          level,
          duration,
        }]);
      } catch (e) {
        console.error('云端分数提交失败:', e);
      }
    }

    await loadLeaderboard();
    return result;
  }, [isOnline, user, loadLeaderboard]);

  // 注册
  const signUp = useCallback(async (email, password, username) => {
    setAuthError('');
    if (isOnline && supabase) {
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
    }
    // 离线模式
    const result = await mockAuthService.signUp(email, password, username);
    setAuthError(result.error?.message || '离线模式暂不支持注册');
    return result;
  }, [isOnline]);

  // 登录
  const signIn = useCallback(async (email, password) => {
    setAuthError('');
    if (isOnline && supabase) {
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
    }
    // 离线模式
    const result = await mockAuthService.signIn(email, password);
    setAuthError(result.error?.message || '离线模式暂不支持登录');
    return result;
  }, [isOnline]);

  // 退出
  const signOut = useCallback(async () => {
    if (isOnline && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error('退出失败:', e);
      }
    }
    setUser(null);
    return mockAuthService.signOut();
  }, [isOnline]);

  const getHighScore = useCallback(() => {
    return localStorageService.getHighScore();
  }, []);

  const value = {
    isOnline,
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
  if (!context) {
    throw new Error('useGameService 必须在 GameServiceProvider 内使用');
  }
  return context;
};

export default GameServiceProvider;
