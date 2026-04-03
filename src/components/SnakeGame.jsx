import React, { useState, useEffect, useCallback } from 'react';
import { useGameService } from './GameService';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const { submitScore, getHighScore } = useGameService();
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  // 生成随机食物
  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    
    // 确保食物不在蛇身上
    const onSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    if (onSnake) {
      return generateFood();
    }
    
    return newFood;
  }, [snake]);

  // 初始化游戏
  const initGame = useCallback(() => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood());
    setDirection('RIGHT');
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
    setSpeed(INITIAL_SPEED);
    setGameStartTime(Date.now());
  }, [generateFood]);

  // 游戏逻辑
  const gameLoop = useCallback(() => {
    if (!isPlaying || gameOver) return;

    setSnake(prevSnake => {
      const head = { ...prevSnake[0] };
      
      // 根据方向移动头部
      switch (direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
        default: break;
      }

      // 检查撞墙
      if (
        head.x < 0 || head.x >= GRID_SIZE ||
        head.y < 0 || head.y >= GRID_SIZE
      ) {
        handleGameOver();
        return prevSnake;
      }

      // 检查撞到自己
      if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        handleGameOver();
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // 检查是否吃到食物
      if (head.x === food.x && head.y === food.y) {
        setFood(generateFood());
        setScore(prev => {
          const newScore = prev + 10;
          // 每100分加速一次
          if (newScore % 100 === 0 && speed > 50) {
            setSpeed(prevSpeed => prevSpeed - 20);
          }
          return newScore;
        });
      } else {
        newSnake.pop(); // 移除尾部，保持长度不变
      }

      return newSnake;
    });
  }, [isPlaying, gameOver, direction, food, generateFood, score, highScore, speed]);

  // 键盘控制
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isPlaying && e.key === ' ') {
        initGame();
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        case ' ':
          setIsPlaying(prev => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, isPlaying, initGame]);

  // 游戏循环
  useEffect(() => {
    if (!isPlaying) return;

    const gameInterval = setInterval(gameLoop, speed);
    return () => clearInterval(gameInterval);
  }, [isPlaying, gameLoop, speed]);

  // 初始化
  useEffect(() => {
    const savedHighScore = getHighScore();
    setHighScore(savedHighScore);
  }, [getHighScore]);

  // 游戏结束处理
  const handleGameOver = useCallback(async () => {
    setGameOver(true);
    setIsPlaying(false);
    
    if (score > highScore) {
      setHighScore(score);
    }
    
    // 提交分数
    if (score > 0) {
      const gameDuration = Math.floor((Date.now() - gameStartTime) / 1000);
      await submitScore(score, Math.floor(score / 100) + 1, gameDuration);
    }
  }, [score, highScore, submitScore]);

  // 游戏状态变量
  const [gameStartTime, setGameStartTime] = useState(0);

  return (
    <div className="flex flex-col items-center p-6">
      {/* 游戏状态栏 */}
      <div className="w-full max-w-2xl mb-6">
        <div className="flex justify-between items-center bg-gradient-to-r from-snake-green to-emerald-500 text-white p-4 rounded-xl shadow-lg">
          <div className="text-center">
            <div className="text-sm opacity-80">当前分数</div>
            <div className="text-3xl font-bold">{score}</div>
          </div>
          <div className="text-center">
            <div className="text-sm opacity-80">最高记录</div>
            <div className="text-3xl font-bold">{highScore}</div>
          </div>
          <div className="text-center">
            <div className="text-sm opacity-80">游戏速度</div>
            <div className="text-3xl font-bold">{INITIAL_SPEED - speed + 150}ms</div>
          </div>
        </div>
      </div>

      {/* 游戏画布 */}
      <div className="relative">
        <div 
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-2 shadow-2xl"
          style={{
            width: GRID_SIZE * CELL_SIZE + 20,
            height: GRID_SIZE * CELL_SIZE + 20,
          }}
        >
          {/* 网格背景 */}
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: GRID_SIZE }).map((_, x) =>
              Array.from({ length: GRID_SIZE }).map((_, y) => (
                <div
                  key={`${x}-${y}`}
                  className="absolute border border-gray-700"
                  style={{
                    left: x * CELL_SIZE + 10,
                    top: y * CELL_SIZE + 10,
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                  }}
                />
              ))
            )}
          </div>

          {/* 蛇 */}
          {snake.map((segment, index) => (
            <div
              key={index}
              className={`absolute rounded ${index === 0 ? 'bg-gradient-to-r from-green-400 to-snake-green' : 'bg-gradient-to-r from-green-500 to-emerald-600'}`}
              style={{
                left: segment.x * CELL_SIZE + 10,
                top: segment.y * CELL_SIZE + 10,
                width: CELL_SIZE - 2,
                height: CELL_SIZE - 2,
                boxShadow: index === 0 ? '0 0 10px rgba(16, 185, 129, 0.5)' : 'none',
                zIndex: snake.length - index,
              }}
            />
          ))}

          {/* 食物 */}
          <div
            className="absolute rounded-full bg-gradient-to-r from-red-500 to-pink-500 animate-pulse-slow"
            style={{
              left: food.x * CELL_SIZE + 10,
              top: food.y * CELL_SIZE + 10,
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              boxShadow: '0 0 15px rgba(239, 68, 68, 0.7)',
            }}
          />
        </div>

        {/* 游戏状态覆盖层 */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-black bg-opacity-70 rounded-xl flex flex-col items-center justify-center">
            {gameOver ? (
              <>
                <div className="text-4xl font-bold text-red-400 mb-4">游戏结束!</div>
                <div className="text-2xl text-white mb-6">最终得分: {score}</div>
              </>
            ) : (
              <div className="text-4xl font-bold text-white mb-4">贪吃蛇大作战</div>
            )}
            <button
              onClick={initGame}
              className="px-8 py-3 bg-gradient-to-r from-snake-green to-emerald-500 text-white font-bold rounded-lg hover:from-emerald-500 hover:to-snake-green transition-all transform hover:scale-105 shadow-lg text-xl"
            >
              {gameOver ? '重新开始' : '开始游戏'}
            </button>
            <div className="mt-6 text-gray-300 text-center">
              <div>使用 ↑ ↓ ← → 方向键控制</div>
              <div className="text-sm mt-2">空格键暂停/继续</div>
            </div>
          </div>
        )}
      </div>

      {/* 控制说明 */}
      <div className="mt-8 w-full max-w-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <div className="text-2xl mb-2">↑</div>
            <div className="text-gray-700 font-medium">向上移动</div>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <div className="text-2xl mb-2">↓</div>
            <div className="text-gray-700 font-medium">向下移动</div>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <div className="text-2xl mb-2">← →</div>
            <div className="text-gray-700 font-medium">左右移动</div>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <div className="text-2xl mb-2">空格</div>
            <div className="text-gray-700 font-medium">暂停/继续</div>
          </div>
        </div>
      </div>

      {/* 游戏提示 */}
      <div className="mt-8 text-center text-gray-600">
        <p className="mb-2">🍎 吃到红色食物增加10分</p>
        <p>⚡ 每100分游戏速度会加快！</p>
      </div>
    </div>
  );
};

export default SnakeGame;