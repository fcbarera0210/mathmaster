import React, { useState, useEffect, useCallback } from 'react';
import { GameState, LevelConfig, Question, PlayerStats } from './types';
import { LEVELS } from './constants';
import { generateQuestion } from './services/mathService';
import { LevelCard } from './components/LevelCard';
import { Button } from './components/Button';
import { Brain, ArrowRight, CheckCircle, XCircle, Home, RotateCcw, Award } from 'lucide-react';
import { Fraction } from './components/Fraction';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [activeLevel, setActiveLevel] = useState<LevelConfig | null>(null);
  const [stats, setStats] = useState<PlayerStats>({ unlockedLevels: 1, totalScore: 0, stars: 0 });
  
  // Gameplay state
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const startLevel = (level: LevelConfig) => {
    setActiveLevel(level);
    setGameState(GameState.LEARNING);
  };

  const beginQuiz = () => {
    setScore(0);
    setQuestionCount(1);
    setFeedback(null);
    setSelectedOption(null);
    if (activeLevel) {
      setCurrentQuestion(generateQuestion(activeLevel.id));
    }
    setGameState(GameState.PLAYING);
  };

  const handleAnswer = (index: number) => {
    if (feedback !== null) return; // Prevent double clicking
    setSelectedOption(index);

    if (currentQuestion && index === currentQuestion.correctIndex) {
      setFeedback('correct');
      setScore(s => s + 1);
    } else {
      setFeedback('incorrect');
    }
  };

  const nextQuestion = () => {
    if (!activeLevel) return;
    
    // Check win condition (e.g., 5 questions per level for demo)
    if (questionCount >= 5) {
      if (score >= 3) { // Pass threshold
        setGameState(GameState.LEVEL_COMPLETE);
        const newUnlocked = Math.max(stats.unlockedLevels, activeLevel.id + 1);
        setStats(prev => ({
          ...prev,
          unlockedLevels: newUnlocked,
          totalScore: prev.totalScore + score * 10,
          stars: prev.stars + (score === 5 ? 3 : score >= 4 ? 2 : 1)
        }));
      } else {
        setGameState(GameState.GAME_OVER);
      }
    } else {
      setFeedback(null);
      setSelectedOption(null);
      setQuestionCount(c => c + 1);
      setCurrentQuestion(generateQuestion(activeLevel.id));
    }
  };

  const returnToMenu = () => {
    setGameState(GameState.MENU);
    setActiveLevel(null);
  };

  // --- RENDERERS ---

  const renderMenu = () => (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <div className="inline-flex items-center justify-center p-4 bg-indigo-100 rounded-full mb-4">
          <Brain className="w-12 h-12 text-indigo-600" />
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-2 tracking-tight">Potencias Racionales</h1>
        <p className="text-xl text-gray-600">Domina las fracciones y los exponentes</p>
        
        <div className="mt-6 flex justify-center gap-6 text-sm font-bold text-gray-500">
           <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm">
             <Award className="w-5 h-5 text-yellow-500" />
             <span>{stats.stars} Estrellas</span>
           </div>
           <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm">
             <span className="text-indigo-600">PTS</span>
             <span>{stats.totalScore}</span>
           </div>
        </div>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        {LEVELS.map(level => (
          <LevelCard 
            key={level.id} 
            level={level} 
            isUnlocked={level.id <= stats.unlockedLevels}
            completed={level.id < stats.unlockedLevels}
            onSelect={startLevel} 
          />
        ))}
      </div>
    </div>
  );

  const renderLearning = () => {
    if (!activeLevel) return null;
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 min-h-screen flex flex-col justify-center">
        <div className="bg-white rounded-3xl shadow-xl p-8 border-b-8 border-indigo-100">
          <div className="mb-6 flex items-center justify-between">
             <h2 className={`text-3xl font-display font-bold text-gray-800`}>Teoría: {activeLevel.title}</h2>
             <button onClick={returnToMenu} className="text-gray-400 hover:text-gray-600">
                <XCircle />
             </button>
          </div>
          
          <div className="space-y-6">
            {activeLevel.theory.map((text, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className={`mt-1 min-w-[24px] h-6 rounded-full ${activeLevel.color} flex items-center justify-center text-white text-sm font-bold`}>
                  {idx + 1}
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">{text}</p>
              </div>
            ))}
            
            <div className="bg-gray-50 rounded-2xl p-6 mt-8 border-2 border-dashed border-gray-200">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Ejemplo Clave</h4>
              <p className="text-xl font-medium text-gray-800 font-serif">{activeLevel.example}</p>
            </div>
          </div>

          <div className="mt-10 flex justify-end">
            <Button onClick={beginQuiz} size="lg" className="w-full md:w-auto">
              ¡Entendido, a jugar! <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderPlaying = () => {
    if (!currentQuestion || !activeLevel) return null;

    return (
      <div className="max-w-2xl mx-auto px-4 py-6 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button onClick={returnToMenu} className="text-gray-500 hover:bg-gray-100 p-2 rounded-xl transition">
            <Home className="w-6 h-6" />
          </button>
          <div className="flex-1 mx-4">
             <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${activeLevel.color} transition-all duration-500 ease-out`} 
                  style={{ width: `${(questionCount / 5) * 100}%`}}
                />
             </div>
          </div>
          <div className="font-bold text-gray-600">{questionCount}/5</div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 mb-6 flex-grow flex flex-col justify-center items-center text-center">
            <h3 className="text-gray-500 font-medium mb-6 uppercase tracking-wider text-sm">Resuelve la potencia</h3>
            <div className="text-4xl md:text-6xl text-gray-800 mb-8 font-serif">
              {currentQuestion.latexProblem}
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
              {currentQuestion.options.map((opt, idx) => {
                let btnStyle = "bg-white border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50";
                
                if (feedback) {
                  if (idx === currentQuestion.correctIndex) {
                    btnStyle = "bg-green-100 border-green-500 text-green-800";
                  } else if (idx === selectedOption) {
                    btnStyle = "bg-red-100 border-red-500 text-red-800";
                  } else {
                    btnStyle = "bg-gray-50 border-gray-100 opacity-50";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={feedback !== null}
                    className={`p-6 rounded-2xl transition-all duration-200 flex items-center justify-center text-2xl ${btnStyle}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
        </div>

        {/* Feedback Area */}
        {feedback && (
          <div className={`fixed bottom-0 left-0 right-0 p-6 ${feedback === 'correct' ? 'bg-green-100' : 'bg-red-100'} border-t-4 ${feedback === 'correct' ? 'border-green-500' : 'border-red-500'} animate-slide-up shadow-2xl`}>
             <div className="max-w-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {feedback === 'correct' 
                    ? <CheckCircle className="w-10 h-10 text-green-600" />
                    : <XCircle className="w-10 h-10 text-red-600" />
                  }
                  <div>
                    <h4 className={`font-bold text-lg ${feedback === 'correct' ? 'text-green-800' : 'text-red-800'}`}>
                      {feedback === 'correct' ? '¡Correcto!' : 'Incorrecto'}
                    </h4>
                    <p className="text-gray-700 max-w-lg">{currentQuestion.explanation}</p>
                  </div>
                </div>
                <Button onClick={nextQuestion} variant={feedback === 'correct' ? 'success' : 'danger'} className="w-full md:w-auto whitespace-nowrap">
                   {questionCount >= 5 ? 'Ver Resultados' : 'Siguiente'}
                </Button>
             </div>
          </div>
        )}
      </div>
    );
  };

  const renderLevelComplete = () => (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>
        
        <div className="inline-block p-6 rounded-full bg-green-100 mb-6 animate-bounce">
          <Award className="w-16 h-16 text-green-600" />
        </div>
        
        <h2 className="text-3xl font-black text-gray-900 mb-2">¡Nivel Completado!</h2>
        <p className="text-gray-500 mb-8">Has dominado {activeLevel?.title}</p>
        
        <div className="bg-gray-50 rounded-2xl p-6 mb-8">
          <div className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-1">Puntuación</div>
          <div className="text-4xl font-black text-indigo-600">{score} / 5</div>
        </div>

        <div className="flex flex-col gap-3">
          <Button onClick={returnToMenu} size="lg" className="w-full">
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );

  const renderGameOver = () => (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>
        
        <div className="inline-block p-6 rounded-full bg-red-100 mb-6">
          <Brain className="w-16 h-16 text-red-500" />
        </div>
        
        <h2 className="text-3xl font-black text-gray-900 mb-2">Casi lo logras</h2>
        <p className="text-gray-500 mb-8">Necesitas al menos 3 respuestas correctas para avanzar.</p>
        
        <div className="bg-gray-50 rounded-2xl p-6 mb-8">
          <div className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-1">Puntuación</div>
          <div className="text-4xl font-black text-red-500">{score} / 5</div>
        </div>

        <div className="flex flex-col gap-3">
          <Button onClick={beginQuiz} variant="primary" className="w-full">
            <RotateCcw className="w-4 h-4 mr-2" /> Intentar de nuevo
          </Button>
          <Button onClick={returnToMenu} variant="secondary" className="w-full">
            Volver al menú
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f0fdf4] text-slate-800">
      {gameState === GameState.MENU && renderMenu()}
      {gameState === GameState.LEARNING && renderLearning()}
      {gameState === GameState.PLAYING && renderPlaying()}
      {gameState === GameState.LEVEL_COMPLETE && renderLevelComplete()}
      {gameState === GameState.GAME_OVER && renderGameOver()}
    </div>
  );
};

export default App;
