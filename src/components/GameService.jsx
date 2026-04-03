import React, { createContext, useContext, useState, useEffect } from 'react';
import { localStorageService, mockAuthService } from '../utils/localStorageService';
import { supabase, isSupabaseConnected } from '../utils/supabaseClient';

// 创建游戏服务上下文
const GameServiceContext = createContext();

// 游戏服务提供者
export const GameServiceProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(false);
  const [user, setUser] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  // 初始化
  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    setLoading(true);
    
    // 检查 Supabase 连接
    if (isSupabaseConnected && supabase) {
      setIsOnline(true);
      console.log('🎮 使用在线模式 (Supabase)');
      
      // 监听认证状态
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setUser(session?.user || null);
        }
      );

      // 加载排行榜
      await loadLeaderboard();
      
      return () => subscription.unsubscribe();
    } else {
      setIsOnline(false);
      console.log('🎮 使用离线模式 (本地存储)');
      
      // 加载本地排行榜
      const { success, data } = localStorageService.getLeaderboard(10);
      if (success) {
        setLeaderboard(data);
      }
    }
    
    setLoading(false);
  };

  // 加载排行榜
  const loadLeaderboard = async (limit = 10) => {
    if (isOnline && supabase) {
      try {
        const { data, error } = await supabase
          .from('scores')
          .select(`
            score,
            level,
            duration,
            created_at,
            user:users(username, avatar_url)
          `)
          .order('score', { ascending: false })
          .limit(limit);

        if (!error && data) {
          setLeaderboard(data);
        }
      } catch (error) {
        console.error('加载排行榜失败:', error);
      }
    } else {
      const { success, data } = localStorageService.getLeaderboard(limit);
      if (success) {
        setLeaderboard(data);
      }
    }
  };

  // 提交分数
  const submitScore = async (score, level = 1, duration = 0) => {
    if (isOnline && supabase && user) {
      // 在线模式：提交到 Supabase
      try {
        const { data, error } = await supabase
          .from('scores')
          .insert([
            {
              user_id: user.id,
              score,
              level,
              duration,
            },
          ])
          .select()
          .single();

        if (!error) {
          console.log('✅ 分数已保存到云端');
          await loadLeaderboard(); // 刷新排行榜
          return { success: true, data };
        }
      } catch (error) {
        console.error('提交分数失败:', error);
      }
    }

    // 离线模式或失败时：保存到本地
    const result = localStorageService.saveScore(score, level, duration);
    if (result.success) {
      console.log('✅ 分数已保存到本地');
      await loadLeaderboard(); // 刷新排行榜
    }
    
    return result;
  };

  // 用户认证
  const signUp = async (email, password, username) => {
    if (isOnline && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username,
            },
          },
        });

        if (error) throw error;
        return { success: true, data };
      } catch (error) {
        return { success: false, error };
      }
    }
    
    return mockAuthService.signUp(email, password, username);
  };

  const signIn = async (email, password) => {
    if (isOnline && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        setUser(data.user);
        return { success: true, data };
      } catch (error) {
        return { success: false, error };
      }
    }
    
    return mockAuthService.signIn(email, password);
  };

  const signOut = async () => {
    if (isOnline && supabase) {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setUser(null);
        return { success: true };
      } catch (error) {
        return { success: false, error };
      }
    }
    
    setUser(null);
    return mockAuthService.signOut();
  };

  // 获取最高分
  const getHighScore = () => {
    return localStorageService.getHighScore();
  };

  const value = {
    isOnline,
    user,
    leaderboard,
    loading,
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

// 使用游戏服务的钩子
export const useGameService = () => {
  const context = useContext(GameServiceContext);
  if (!context) {
    throw new Error('useGameService 必须在 GameServiceProvider 内使用');
  }
  return context;
};

export default GameServiceProvider;