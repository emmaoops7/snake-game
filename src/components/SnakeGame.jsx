import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const { submitScore, getHighScore } = useGameService();

  const gameStartTime = useRef(0);
  const directionRef = useRef('RIGHT');

  // 同步 direction 到 ref（避免闭包陷阱）
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  // 生成随机食物
  const generateFood = useCallback((currentSnake) => {
    let newFood;
    let attempts = 0;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      attempts++;
    } while (
      currentSnake.some(s => s.x === newFood.x && s.y === newFood.y) &&
      attempts < 100
    );
    return newFood;
  }, []);

  // 初始化游戏
  const initGame = useCallback(() => {
    const initialSnake = [{ x: 10, y: 10 }];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
    setSpeed(INITIAL_SPEED);
    gameStartTime.current = Date.now();
  }, [generateFood]);

  // 游戏结束处理
  const handleGameOver = useCallback(async (finalScore) => {
    setGameOver(true);
    setIsPlaying(false);

    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('snakeHighScore', finalScore.toString());
    }

    if (finalScore > 0) {
      const duration = Math.floor((Date.now() - gameStartTime.current) / 1000);
      await submitScore(finalScore, Math.floor(finalScore / 100) + 1, duration);
    }
  }, [highScore, submitScore]);

  // 游戏逻辑（用 ref 避免闭包问题）
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setSnake(prevSnake => {
        const head = { ...prevSnake[0] };
        const dir = directionRef.current;

        switch (dir) {
          case 'UP':    head.y -= 1; break;
          case 'DOWN':  head.y += 1; break;
          case 'LEFT':  head.x -= 1; break;
          case 'RIGHT': head.x += 1; break;
          default: break;
        }

        // 撞墙
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          handleGameOver(score);
          return prevSnake;
        }

        // 撞自己
        if (prevSnake.some(s => s.x === head.x && s.y === head.y)) {
          handleGameOver(score);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // 吃到食物
        if (head.x === food.x && head.y === food.y) {
          const newFood = generateFood(newSnake);
          setFood(newFood);
          setScore(prev => {
            const ns = prev + 10;
            if (ns % 100 === 0 && speed > 50) {
              setSpeed(s => s - 20);
            }
            return ns;
          });
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [isPlaying, speed, food, score, generateFood, handleGameOver]);

  // 键盘控制
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isPlaying && (e.key === ' ' || e.key === 'Enter')) {
        if (!gameOver) initGame();
        return;
      }

      const dir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':    if (dir !== 'DOWN')  { setDirection('UP'); }    break;
        case 'ArrowDown':  if (dir !== 'UP')    { setDirection('DOWN'); }  break;
        case 'ArrowLeft':  if (dir !== 'RIGHT') { setDirection('LEFT'); }  break;
        case 'ArrowRight': if (dir !== 'LEFT')  { setDirection('RIGHT'); } break;
        case ' ':
          if (isPlaying) setIsPlaying(false);
          break;
        default: break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver, initGame]);

  // 初始化最高分
  useEffect(() => {
    setHighScore(getHighScore());
  }, [getHighScore]);

  return (
    <div className="flex flex-col items-center p-6">
      {/* 分数栏 */}
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
            <div className="text-sm opacity-80">速度</div>
            <div className="text-3xl font-bold">{Math.round(1000 / speed)}</div>
          </div>
        </div>
      </div>

      {/* 游戏画布 */}
      <div className="relative">
        <div
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-2 shadow-2xl relative overflow-hidden"
          style={{ width: GRID_SIZE * CELL_SIZE + 20, height: GRID_SIZE * CELL_SIZE + 20 }}
        >
          {/* 蛇 */}
          {snake.map((segment, index) => (
            <div
              key={index}
              className={`absolute rounded-sm ${index === 0 ? 'bg-green-400' : 'bg-emerald-500'}`}
              style={{
                left: segment.x * CELL_SIZE + 10,
                top: segment.y * CELL_SIZE + 10,
                width: CELL_SIZE - 2,
                height: CELL_SIZE - 2,
                boxShadow: index === 0 ? '0 0 8px rgba(74,222,128,0.6)' : 'none',
                zIndex: snake.length - index,
              }}
            />
          ))}

          {/* 食物 */}
          <div
            className="absolute rounded-full bg-red-500"
            style={{
              left: food.x * CELL_SIZE + 10,
              top: food.y * CELL_SIZE + 10,
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              boxShadow: '0 0 12px rgba(239,68,68,0.7)',
              animation: 'pulse 1.5s infinite',
            }}
          />
        </div>

        {/* 覆盖层 */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-black bg-opacity-70 rounded-xl flex flex-col items-center justify-center">
            {gameOver ? (
              <>
                <div className="text-4xl font-bold text-red-400 mb-2">游戏结束!</div>
                <div className="text-2xl text-white mb-6">得分: {score}</div>
              </>
            ) : (
              <div className="text-4xl font-bold text-white mb-4">🐍 贪吃蛇大作战</div>
            )}
            <button
              onClick={initGame}
              className="px-8 py-3 bg-gradient-to-r from-snake-green to-emerald-500 text-white font-bold rounded-lg hover:opacity-90 transition transform hover:scale-105 shadow-lg text-xl cursor-pointer"
            >
              {gameOver ? '重新开始' : '开始游戏'}
            </button>
            <div className="mt-4 text-gray-300 text-sm">
              ↑ ↓ ← → 控制方向 · 空格暂停
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SnakeGame;
