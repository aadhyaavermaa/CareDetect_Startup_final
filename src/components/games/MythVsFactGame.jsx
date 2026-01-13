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

  const allQuestions = [
    // MYTH QUESTIONS (20 total)
    {
      id: 1,
      question: "All breast lumps are cancerous?",
      answer: false,
      type: "myth",
      explanation: "80-90% of breast lumps are benign (non-cancerous). However, every lump needs proper doctor evaluation for accurate diagnosis.",
      category: "Symptoms"
    },
    {
      id: 2,
      question: "Breast cancer only affects older women?",
      answer: false,
      type: "myth",
      explanation: "About 50% of breast cancer cases are diagnosed before age 50. Young women are also at risk and should be aware of symptoms.",
      category: "Age & Risk"
    },
    {
      id: 3,
      question: "Having family history means I'll definitely get cancer?",
      answer: false,
      type: "myth",
      explanation: "85-90% of breast cancer cases have NO family history. Most cases are sporadic, not hereditary.",
      category: "Genetics"
    },
    {
      id: 4,
      question: "Breast pain means cancer?",
      answer: false,
      type: "myth",
      explanation: "Breast pain is RARELY a sign of cancer. It's usually hormonal or cyclical and related to menstrual cycles.",
      category: "Symptoms"
    },
    {
      id: 5,
      question: "No lump means no cancer?",
      answer: false,
      type: "myth",
      explanation: "Early cancers often show as skin changes, nipple inversion, or dimpling FIRST, before any lump can be felt.",
      category: "Symptoms"
    },
    {
      id: 6,
      question: "Biopsy spreads cancer throughout the body?",
      answer: false,
      type: "myth",
      explanation: "Biopsy is completely SAFE and doesn't spread cancer. Delaying proper diagnosis is actually dangerous.",
      category: "Treatment"
    },
    {
      id: 7,
      question: "Mammograms cause cancer due to radiation?",
      answer: false,
      type: "myth",
      explanation: "Mammogram radiation dose is only 0.4mSv (equivalent to 7 weeks of background radiation). They are life-saving screening tools.",
      category: "Screening"
    },
    {
      id: 8,
      question: "Men don't get breast cancer?",
      answer: false,
      type: "myth",
      explanation: "About 1% of breast cancer cases occur in men. They have the same symptoms and need the same awareness as women.",
      category: "Gender"
    },
    {
      id: 9,
      question: "Breast cancer is a death sentence?",
      answer: false,
      type: "myth",
      explanation: "90% survival rate when caught early. Stage 1 breast cancer has a 99% survival rate. Early detection saves lives!",
      category: "Treatment"
    },
    {
      id: 10,
      question: "Wearing tight bras causes breast cancer?",
      answer: false,
      type: "myth",
      explanation: "There is no scientific evidence linking bra type or tightness to breast cancer risk. This is a persistent myth.",
      category: "Lifestyle"
    },
    {
      id: 11,
      question: "Self-examination replaces mammogram screening?",
      answer: false,
      type: "myth",
      explanation: "Self-exam finds only 70% of cancers and misses deep cancers. BOTH self-exam AND mammogram screening are needed together.",
      category: "Screening"
    },
    {
      id: 12,
      question: "Breastfeeding prevents cancer completely?",
      answer: false,
      type: "myth",
      explanation: "Breastfeeding reduces risk by only 4-5%, it doesn't eliminate cancer risk. Regular screening is still essential.",
      category: "Prevention"
    },
    {
      id: 13,
      question: "Antiperspirants cause breast cancer?",
      answer: false,
      type: "myth",
      explanation: "No scientific evidence supports this claim. Aluminum absorption through skin is minimal and not linked to cancer.",
      category: "Lifestyle"
    },
    {
      id: 14,
      question: "Sugar directly feeds cancer growth?",
      answer: false,
      type: "myth",
      explanation: "All cells use sugar for energy. Dietary sugar doesn't directly CAUSE cancer, though healthy diet is always recommended.",
      category: "Lifestyle"
    },
    {
      id: 15,
      question: "Abortion or contraception causes breast cancer?",
      answer: false,
      type: "myth",
      explanation: "No causal link has been scientifically proven. Real risk factors are primarily hormonal, genetic, and lifestyle-related.",
      category: "Lifestyle"
    },
    {
      id: 16,
      question: "Dense breasts mean high cancer risk?",
      answer: false,
      type: "myth",
      explanation: "Dense breasts make cancer detection harder on mammograms, but don't necessarily mean higher cancer risk.",
      category: "Screening"
    },
    {
      id: 17,
      question: "5 years cancer-free means completely cured?",
      answer: false,
      type: "myth",
      explanation: "20% of recurrences happen after 5 years. Lifetime monitoring and follow-up care are still needed.",
      category: "Treatment"
    },
    {
      id: 18,
      question: "Radiation therapy is too dangerous to use?",
      answer: false,
      type: "myth",
      explanation: "Targeted radiation therapy saves lives and is precisely controlled. Side effects are manageable and temporary.",
      category: "Treatment"
    },
    {
      id: 19,
      question: "Breast removal is the only treatment option?",
      answer: false,
      type: "myth",
      explanation: "80% of early-stage cancers can be treated with breast conservation surgery. Complete removal isn't always necessary.",
      category: "Treatment"
    },
    {
      id: 20,
      question: "Stress directly causes breast cancer?",
      answer: false,
      type: "myth",
      explanation: "Stress can weaken immunity but is not a direct cause of cancer. Managing stress is good for overall health.",
      category: "Lifestyle"
    },
    
    // FACT QUESTIONS (10 total)
    {
      id: 21,
      question: "Stage 1 breast cancer has 99% 5-year survival rate?",
      answer: true,
      type: "fact",
      explanation: "When breast cancer is found at Stage 1 (localized, <2cm, no lymph nodes), modern treatment cures 99% of women. Regular self-exam + mammogram makes early detection possible.",
      category: "Treatment"
    },
    {
      id: 22,
      question: "Self-exam finds 70% of breast lumps before doctor visits?",
      answer: true,
      type: "fact",
      explanation: "70% of breast lumps are discovered by women themselves during monthly self-exams. Do it Day 7-10 of your cycle when breasts are least tender. Upper outer quadrant focus!",
      category: "Prevention"
    },
    {
      id: 23,
      question: "50% breast cancer cases diagnosed before age 50?",
      answer: true,
      type: "fact",
      explanation: "In India, 50% of breast cancer occurs in women under 50 - much younger than global average. Family history, early periods, late pregnancy increase young women's risk.",
      category: "Age & Risk"
    },
    {
      id: 24,
      question: "85-90% breast cancers have NO family history?",
      answer: true,
      type: "fact",
      explanation: "Only 10-15% cases are hereditary. 85-90% women with breast cancer had no family history. Age, hormones, lifestyle affect everyone regardless of genetics.",
      category: "Genetics"
    },
    {
      id: 25,
      question: "Mammogram + ultrasound detects 95% early cancers?",
      answer: true,
      type: "fact",
      explanation: "Young Indian women often have dense breasts where mammogram alone misses 20-30% cancers. Ultrasound + mammogram together = 95% detection rate for early stage.",
      category: "Screening"
    },
    {
      id: 26,
      question: "Breastfeeding reduces risk by 4% per year breastfed?",
      answer: true,
      type: "fact",
      explanation: "Each year of breastfeeding lowers lifetime breast cancer risk by 4.3%. Total 12+ months breastfeeding = significant protection. Natural prevention!",
      category: "Prevention"
    },
    {
      id: 27,
      question: "1 new breast cancer diagnosis every 4 minutes in India?",
      answer: true,
      type: "fact",
      explanation: "India sees 200,000+ new cases yearly = 1 woman diagnosed every 4 minutes. 70% late stage detection. YOUR awareness can change this statistic.",
      category: "Statistics"
    },
    {
      id: 28,
      question: "50% breast cancers found in upper outer quadrant?",
      answer: true,
      type: "fact",
      explanation: "50% of all breast cancers develop in upper outer quadrant (towards armpit). Self-exam this area specially using circular motion with 3 fingers.",
      category: "Symptoms"
    },
    {
      id: 29,
      question: "90% overall survival with modern treatment?",
      answer: true,
      type: "fact",
      explanation: "90% of breast cancer patients survive 5+ years with current treatments. Early detection + targeted therapy = dramatic improvement over past decades.",
      category: "Treatment"
    },
    {
      id: 30,
      question: "Biopsy does NOT spread cancer?",
      answer: true,
      type: "fact",
      explanation: "Common myth delays diagnosis. Needle biopsy is safe, accurate, and essential. 80-90% 'suspicious lumps' prove benign. Don't delay - get it done!",
      category: "Treatment"
    }
  ];

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
                  <li>• 10 questions from pool of 30</li>
                  <li>• Mix of myths and facts</li>
                  <li>• 15 seconds per question</li>
                  <li>• Build streaks for bonus points</li>
                  <li>• Different questions each game!</li>
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
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              {[
                { name: 'Symptoms', emoji: '🔍' },
                { name: 'Screening', emoji: '📋' },
                { name: 'Treatment', emoji: '🏥' },
                { name: 'Lifestyle', emoji: '🌱' },
                { name: 'Prevention', emoji: '🛡️' },
                { name: 'Genetics', emoji: '🧬' },
                { name: 'Age & Risk', emoji: '🎂' },
                { name: 'Gender', emoji: '👥' },
                { name: 'Statistics', emoji: '📊' }
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
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {currentQuestion + 1}/{questions.length}
              </div>
              {/* Submit and Back buttons */}
              <button
                onClick={() => setGameState('results')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Submit Quiz
              </button>
              <button
                onClick={onBack}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
              >
                Back to Games
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