import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, CheckCircle, XCircle, Award, RefreshCw, Home, Zap } from 'lucide-react';

const MythVsFactGame = ({ onBack, onClose }) => {
  const [gameState, setGameState] = useState('menu'); // menu, playing, results
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState([]);

  const questions = [
    {
      id: 1,
      question: "Breast cancer only happens after age 40?",
      answer: false,
      type: "myth",
      explanation: "While risk increases with age, breast cancer can occur at any age. About 5% of cases occur in women under 40.",
      category: "Age & Risk"
    },
    {
      id: 2,
      question: "All breast lumps are cancerous?",
      answer: false,
      type: "myth",
      explanation: "About 80% of breast lumps are benign (non-cancerous). However, any new lump should be checked by a doctor.",
      category: "Symptoms"
    },
    {
      id: 3,
      question: "Self-examination can help detect breast cancer early?",
      answer: true,
      type: "fact",
      explanation: "Regular self-exams help you know what's normal for you, making it easier to notice changes.",
      category: "Prevention"
    },
    {
      id: 4,
      question: "Family history means you will definitely get breast cancer?",
      answer: false,
      type: "myth",
      explanation: "Family history increases risk but doesn't guarantee you'll get cancer. Only 5-10% of cases are hereditary.",
      category: "Genetics"
    },
    {
      id: 5,
      question: "Men cannot get breast cancer?",
      answer: false,
      type: "myth",
      explanation: "Men can get breast cancer, though it's rare (less than 1% of all cases). About 2,600 men are diagnosed yearly in the US.",
      category: "Gender"
    },
    {
      id: 6,
      question: "Mammograms can detect cancer before you can feel a lump?",
      answer: true,
      type: "fact",
      explanation: "Mammograms can detect tumors 2-3 years before they can be felt, when they're most treatable.",
      category: "Screening"
    },
    {
      id: 7,
      question: "Wearing underwire bras causes breast cancer?",
      answer: false,
      type: "myth",
      explanation: "There's no scientific evidence linking underwire bras to breast cancer. This is a persistent myth.",
      category: "Lifestyle"
    },
    {
      id: 8,
      question: "Exercise can reduce breast cancer risk?",
      answer: true,
      type: "fact",
      explanation: "Regular physical activity can reduce breast cancer risk by 10-20% by helping maintain healthy weight and hormone levels.",
      category: "Prevention"
    },
    {
      id: 9,
      question: "Breast cancer always causes pain?",
      answer: false,
      type: "myth",
      explanation: "Most breast cancers are painless in early stages. Pain is not a reliable indicator of cancer.",
      category: "Symptoms"
    },
    {
      id: 10,
      question: "Early detection significantly improves survival rates?",
      answer: true,
      type: "fact",
      explanation: "When caught early (stage 1), the 5-year survival rate is nearly 100%. Early detection saves lives!",
      category: "Treatment"
    }
  ];

  // Start game
  const startGame = () => {
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
              Back to Games
            </button>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              ⚖️ Myth vs Fact
            </h1>
            <p className="text-xl text-gray-600">
              Bust myths with rapid-fire quiz and become a Myth Buster!
            </p>
          </div>

          {/* Game Info */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Game Rules</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <Zap className="w-5 h-5 text-yellow-500 mr-2" />
                  How to Play
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• 10 rapid-fire questions</li>
                  <li>• 15 seconds per question</li>
                  <li>• Swipe or click True/False</li>
                  <li>• Build streaks for bonus points</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <Award className="w-5 h-5 text-purple-500 mr-2" />
                  Scoring System
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Base: 10 points per correct answer</li>
                  <li>• Time bonus: +50% if answered in 10s</li>
                  <li>• Streak bonus: +10% per consecutive correct</li>
                  <li>• Perfect score: 200+ points</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Categories Preview */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Question Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {['Age & Risk', 'Symptoms', 'Prevention', 'Genetics', 'Screening'].map((category, index) => (
                <div key={index} className="text-center p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
                  <div className="text-2xl mb-2">
                    {['🎂', '🔍', '🛡️', '🧬', '📋'][index]}
                  </div>
                  <div className="text-sm font-semibold text-gray-700">{category}</div>
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
              Start Quiz 🚀
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
                  <span className="font-bold">{streak} streak!</span>
                </div>
              )}
            </div>
            <div className="text-sm text-gray-600">
              {currentQuestion + 1}/{questions.length}
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
                <div className="text-xl font-bold">MYTH</div>
                <div className="text-sm mt-2">This statement is FALSE</div>
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
                <div className="text-xl font-bold">FACT</div>
                <div className="text-sm mt-2">This statement is TRUE</div>
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
                    {selectedAnswer === currentQ.answer ? 'Correct!' : 'Incorrect!'}
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
                <div className="text-gray-600">Final Score</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">{correctAnswers}/{questions.length}</div>
                <div className="text-gray-600">Correct</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600">{maxStreak}</div>
                <div className="text-gray-600">Best Streak</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-pink-600">{percentage}%</div>
                <div className="text-gray-600">Accuracy</div>
              </div>
            </div>
          </div>

          {/* Badge Earned */}
          {percentage >= 70 && (
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-3xl p-8 shadow-xl border border-yellow-200 mb-8">
              <div className="text-center">
                <Award className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Badge Earned!</h2>
                <div className="text-xl font-semibold text-gray-800">Myth Buster 🛡️</div>
                <p className="text-gray-600 mt-2">You've mastered breast health facts and busted the myths!</p>
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
              Play Again
            </button>
            <button
              onClick={onBack}
              className="flex items-center px-6 py-3 bg-gray-600 text-white font-semibold rounded-xl shadow-lg hover:bg-gray-700 transition-colors"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Games
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default MythVsFactGame;