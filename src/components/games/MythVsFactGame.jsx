import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, CheckCircle, XCircle, Award, RefreshCw, Home, Zap } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { mythVsFactQuestions } from '../../utils/mythVsFactQuestions';

const MythVsFactGame = ({ onBack, onClose }) => {
  const { t, tGame, language } = useLanguage();
  const [gameState, setGameState] = useState('menu'); // menu, playing, results
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState([]);

  // Get questions in current language
  const allQuestions = mythVsFactQuestions[language] || mythVsFactQuestions.en;

  // Shuffle and select 10 random questions for each game
  const [questions, setQuestions] = useState([]);

  // Shuffle array function
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Start game
  const startGame = () => {
    // Select 10 random questions from the pool of 20
    const shuffledQuestions = shuffleArray(allQuestions).slice(0, 10);
    setQuestions(shuffledQuestions);
    
    setGameState('playing');
    setCurrentQuestion(0);
    setScore(0);
    setStreak(0);
    setAnswers([]);
    setTimeLeft(15);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing' && !showFeedback && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'playing' && !showFeedback) {
      handleAnswer(null); // Time's up
    }
  }, [timeLeft, gameState, showFeedback]);

  // Handle answer selection
  const handleAnswer = (answer) => {
    if (showFeedback) return;
    
    setSelectedAnswer(answer);
    setShowFeedback(true);
    
    const currentQ = questions[currentQuestion];
    const isCorrect = answer === currentQ.answer;
    const timeBonus = timeLeft > 10 ? 1.5 : timeLeft > 5 ? 1.2 : 1;
    
    let points = 0;
    let newStreak = streak;
    
    if (isCorrect) {
      points = Math.floor(10 * timeBonus * (1 + streak * 0.1));
      newStreak = streak + 1;
    } else {
      newStreak = 0;
    }
    
    setScore(prev => prev + points);
    setStreak(newStreak);
    
    const answerData = {
      question: currentQ.question,
      userAnswer: answer,
      correctAnswer: currentQ.answer,
      isCorrect,
      points,
      timeLeft,
      explanation: currentQ.explanation
    };
    
    setAnswers(prev => [...prev, answerData]);
    
    // Auto-advance after 3 seconds
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setTimeLeft(15);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        setGameState('results');
      }
    }, 3000);
  };

  // Menu Screen
  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="flex items-center mb-8">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-purple-600 transition-colors mr-4"
            >
              <ArrowLeft className="w-6 h-6 mr-2" />
              {t('backToGames')}
            </button>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              ⚖️ {tGame('mythVsFact', 'title')}
            </h1>
            <p className="text-xl text-gray-600">
              {tGame('mythVsFact', 'subtitle')}
            </p>
          </div>

          {/* Game Info */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{tGame('mythVsFact', 'gameRules')}</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <Zap className="w-5 h-5 text-yellow-500 mr-2" />
                  {tGame('mythVsFact', 'howToPlay')}
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• 10 {tGame('mythVsFact', 'questionsFromPool')}</li>
                  <li>• {tGame('mythVsFact', 'mixOfMyths')}</li>
                  <li>• 15 {tGame('mythVsFact', 'secondsPerQuestion')}</li>
                  <li>• {tGame('mythVsFact', 'buildStreaks')}</li>
                  <li>• {tGame('mythVsFact', 'differentQuestions')}</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <Award className="w-5 h-5 text-purple-500 mr-2" />
                  {tGame('mythVsFact', 'scoringSystem')}
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• {tGame('mythVsFact', 'basePoints')}</li>
                  <li>• {tGame('mythVsFact', 'timeBonusDesc')}</li>
                  <li>• {tGame('mythVsFact', 'streakBonus')}</li>
                  <li>• {tGame('mythVsFact', 'perfectScore')}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Categories Preview */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{tGame('mythVsFact', 'questionCategories')}</h2>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              {[
                { name: tGame('mythVsFact', 'symptoms'), emoji: '🔍' },
                { name: tGame('mythVsFact', 'screening'), emoji: '📋' },
                { name: tGame('mythVsFact', 'treatment'), emoji: '🏥' },
                { name: tGame('mythVsFact', 'lifestyle'), emoji: '🌱' },
                { name: tGame('mythVsFact', 'prevention'), emoji: '🛡️' },
                { name: tGame('mythVsFact', 'genetics'), emoji: '🧬' },
                { name: tGame('mythVsFact', 'ageRisk'), emoji: '🎂' },
                { name: tGame('mythVsFact', 'gender'), emoji: '👥' },
                { name: tGame('mythVsFact', 'statistics'), emoji: '📊' }
              ].map((category, index) => (
                <div key={index} className="text-center p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
                  <div className="text-2xl mb-2">{category.emoji}</div>
                  <div className="text-sm font-semibold text-gray-700">{category.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <div className="text-center">
            <button
              onClick={startGame}
              className="px-12 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xl font-bold rounded-2xl shadow-lg hover:scale-105 transition-all duration-300"
            >
              {t('startQuiz')} 🚀
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Game Screen
  if (gameState === 'playing') {
    const currentQ = questions[currentQuestion];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Game Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                <Clock className="w-5 h-5 text-red-500 mr-2" />
                <span className="font-bold text-red-600">{timeLeft}s</span>
              </div>
              <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                <Award className="w-5 h-5 text-purple-500 mr-2" />
                <span className="font-bold text-purple-600">{score} pts</span>
              </div>
              {streak > 0 && (
                <div className="flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl px-4 py-2 shadow-lg">
                  <Zap className="w-5 h-5 mr-2" />
                  <span className="font-bold">{streak} {tGame('mythVsFact', 'streak')}</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {currentQuestion + 1}/{questions.length}
              </div>
              {/* Submit and Back buttons */}
              <button
                onClick={() => setGameState('results')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                {t('submitQuiz')}
              </button>
              <button
                onClick={onBack}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
              >
                {t('backToGames')}
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 mb-8">
            <div className="text-center mb-8">
              <div className="text-sm font-semibold text-purple-600 mb-2">{currentQ.category}</div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {currentQ.question}
              </h2>
            </div>

            {/* Answer Buttons */}
            <div className="grid md:grid-cols-2 gap-6">
              <button
                onClick={() => handleAnswer(false)}
                disabled={showFeedback}
                className={`p-8 rounded-2xl border-2 transition-all duration-300 ${
                  showFeedback
                    ? selectedAnswer === false
                      ? currentQ.answer === false
                        ? 'border-green-500 bg-green-100 text-green-800'
                        : 'border-red-500 bg-red-100 text-red-800'
                      : currentQ.answer === false
                        ? 'border-green-500 bg-green-100 text-green-800'
                        : 'border-gray-300 bg-gray-100 text-gray-600'
                    : 'border-red-300 bg-red-50 text-red-700 hover:border-red-500 hover:bg-red-100 hover:scale-105 cursor-pointer'
                }`}
              >
                <div className="text-4xl mb-4">❌</div>
                <div className="text-xl font-bold">{tGame('mythVsFact', 'myth')}</div>
                <div className="text-sm mt-2">{tGame('mythVsFact', 'mythDesc')}</div>
              </button>

              <button
                onClick={() => handleAnswer(true)}
                disabled={showFeedback}
                className={`p-8 rounded-2xl border-2 transition-all duration-300 ${
                  showFeedback
                    ? selectedAnswer === true
                      ? currentQ.answer === true
                        ? 'border-green-500 bg-green-100 text-green-800'
                        : 'border-red-500 bg-red-100 text-red-800'
                      : currentQ.answer === true
                        ? 'border-green-500 bg-green-100 text-green-800'
                        : 'border-gray-300 bg-gray-100 text-gray-600'
                    : 'border-green-300 bg-green-50 text-green-700 hover:border-green-500 hover:bg-green-100 hover:scale-105 cursor-pointer'
                }`}
              >
                <div className="text-4xl mb-4">✅</div>
                <div className="text-xl font-bold">{tGame('mythVsFact', 'fact')}</div>
                <div className="text-sm mt-2">{tGame('mythVsFact', 'factDesc')}</div>
              </button>
            </div>

            {/* Feedback */}
            {showFeedback && (
              <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
                <div className="flex items-center mb-4">
                  {selectedAnswer === currentQ.answer ? (
                    <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500 mr-2" />
                  )}
                  <span className="font-bold text-gray-900">
                    {selectedAnswer === currentQ.answer ? tGame('mythVsFact', 'correct') : tGame('mythVsFact', 'incorrect')}
                  </span>
                </div>
                <p className="text-gray-700">{currentQ.explanation}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (gameState === 'results') {
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const percentage = Math.round((correctAnswers / questions.length) * 100);
    const maxStreak = Math.max(...answers.map((_, i) => {
      let streak = 0;
      for (let j = i; j < answers.length && answers[j].isCorrect; j++) {
        streak++;
      }
      return streak;
    }));
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-4">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">
              {percentage >= 80 ? '🏆' : percentage >= 60 ? '🥈' : percentage >= 40 ? '🥉' : '💪'}
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              {percentage >= 80 ? 'Myth Buster!' : percentage >= 60 ? 'Great Knowledge!' : percentage >= 40 ? 'Good Start!' : 'Keep Learning!'}
            </h1>
          </div>

          {/* Results Summary */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 mb-8">
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-purple-600">{score}</div>
                <div className="text-gray-600">{tGame('mythVsFact', 'finalScore')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">{correctAnswers}/{questions.length}</div>
                <div className="text-gray-600">{tGame('mythVsFact', 'correctAnswers')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600">{maxStreak}</div>
                <div className="text-gray-600">{tGame('mythVsFact', 'bestStreak')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-pink-600">{percentage}%</div>
                <div className="text-gray-600">{t('accuracy')}</div>
              </div>
            </div>
          </div>

          {/* Badge Earned */}
          {percentage >= 70 && (
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-3xl p-8 shadow-xl border border-yellow-200 mb-8">
              <div className="text-center">
                <Award className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('badgeEarned')}</h2>
                <div className="text-xl font-semibold text-gray-800">{tGame('mythVsFact', 'mythBusterBadge')} 🛡️</div>
                <p className="text-gray-600 mt-2">{tGame('mythVsFact', 'mythBusterDesc')}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={startGame}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-all duration-300"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              {t('playAgain')}
            </button>
            <button
              onClick={onBack}
              className="flex items-center px-6 py-3 bg-gray-600 text-white font-semibold rounded-xl shadow-lg hover:bg-gray-700 transition-colors"
            >
              <Home className="w-5 h-5 mr-2" />
              {t('backToGames')}
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default MythVsFactGame;