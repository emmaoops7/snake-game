// 本地存储服务 - 在没有 Supabase 时使用
export const localStorageService = {
  // 保存分数
  saveScore(score, level = 1, duration = 0) {
    try {
      const scores = this.getScores();
      const newScore = {
        id: Date.now().toString(),
        score,
        level,
        duration,
        created_at: new Date().toISOString(),
        username: '本地玩家'
      };
      
      scores.push(newScore);
      // 只保留最近50条记录
      const recentScores = scores.slice(-50);
      localStorage.setItem('snake_scores', JSON.stringify(recentScores));
      
      // 更新最高分
      this.updateHighScore(score);
      
      return { success: true, data: newScore };
    } catch (error) {
      console.error('保存分数失败:', error);
      return { success: false, error };
    }
  },

  // 获取所有分数
  getScores() {
    try {
      const scores = localStorage.getItem('snake_scores');
      return scores ? JSON.parse(scores) : [];
    } catch (error) {
      console.error('获取分数失败:', error);
      return [];
    }
  },

  // 获取排行榜（前N名）
  getLeaderboard(limit = 100) {
    try {
      const scores = this.getScores();
      // 按分数降序排序
      const sorted = scores.sort((a, b) => b.score - a.score);
      return { success: true, data: sorted.slice(0, limit) };
    } catch (error) {
      console.error('获取排行榜失败:', error);
      return { success: false, error };
    }
  },

  // 更新最高分
  updateHighScore(score) {
    try {
      const currentHigh = this.getHighScore();
      if (score > currentHigh) {
        localStorage.setItem('snake_high_score', score.toString());
        return score;
      }
      return currentHigh;
    } catch (error) {
      console.error('更新最高分失败:', error);
      return 0;
    }
  },

  // 获取最高分
  getHighScore() {
    try {
      const highScore = localStorage.getItem('snake_high_score');
      return highScore ? parseInt(highScore) : 0;
    } catch (error) {
      console.error('获取最高分失败:', error);
      return 0;
    }
  },

  // 获取用户分数（模拟）
  getUserScores(userId, limit = 20) {
    // 本地版本只返回所有分数
    return this.getLeaderboard(limit);
  },

  // 获取用户最高分（模拟）
  getUserHighScore(userId) {
    const highScore = this.getHighScore();
    return { success: true, data: { score: highScore } };
  }
};

// 模拟认证服务
export const mockAuthService = {
  async signUp(email, password, username) {
    console.log('本地模式：注册功能已禁用');
    return { 
      success: false, 
      error: { message: '请配置 Supabase 以启用用户注册' } 
    };
  },

  async signIn(email, password) {
    console.log('本地模式：登录功能已禁用');
    return { 
      success: false, 
      error: { message: '请配置 Supabase 以启用用户登录' } 
    };
  },

  async signOut() {
    return { success: true };
  },

  getCurrentUser() {
    return { data: { user: null } };
  },

  onAuthStateChange(callback) {
    // 本地模式没有认证状态变化
    return { data: { subscription: { unsubscribe: () => {} } } };
  }
};

// 导出所有服务
export default {
  localStorageService,
  mockAuthService,
  isLocalMode: true
};