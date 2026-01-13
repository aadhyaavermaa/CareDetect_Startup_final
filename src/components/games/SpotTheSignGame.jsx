import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Target, Award, RefreshCw, Home } from 'lucide-react';

const SpotTheSignGame = ({ onBack, onClose }) => {
  const [gameState, setGameState] = useState('menu'); // menu, playing, results
  const [level, setLevel] = useState('easy');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [foundSigns, setFoundSigns] = useState([]);
  const [gameData, setGameData] = useState(null);
  const [selectedSign, setSelectedSign] = useState(null);
  const [showSignDetails, setShowSignDetails] = useState(false);

  const levels = {
    easy: { signs: 3, timeLimit: 30, multiplier: 1 },
    medium: { signs: 5, timeLimit: 25, multiplier: 1.5 },
    hard: { signs: 7, timeLimit: 20, multiplier: 2 }
  };

  const signTypes = [
    { 
      id: 'lump', 
      name: 'Lump/Mass', 
      icon: '●', 
      color: 'bg-red-500',
      description: 'A hard, painless lump or thickening in the breast tissue',
      details: 'Most breast lumps are not cancerous, but any new lump should be examined by a doctor. Cancerous lumps are typically hard, irregular in shape, and painless.',
      symptoms: ['Hard, fixed lump', 'Irregular shape', 'Usually painless', 'May be attached to skin or chest wall']
    },
    { 
      id: 'dimpling', 
      name: 'Skin Dimpling', 
      icon: '◐', 
      color: 'bg-orange-500',
      description: 'Puckering or dimpling of the breast skin, like an orange peel',
      details: 'Skin dimpling occurs when cancer cells block lymph vessels in the skin. This creates a texture similar to an orange peel (peau d\'orange).',
      symptoms: ['Orange peel texture', 'Puckering of skin', 'Thickened skin', 'Swelling in affected area']
    },
    { 
      id: 'nipple-inversion', 
      name: 'Nipple Changes', 
      icon: '⬇', 
      color: 'bg-purple-500',
      description: 'Sudden inversion or retraction of the nipple',
      details: 'A nipple that suddenly turns inward or becomes inverted when it was previously normal can be a sign of breast cancer.',
      symptoms: ['Sudden nipple inversion', 'Nipple retraction', 'Change in nipple direction', 'Nipple pulling inward']
    },
    { 
      id: 'redness', 
      name: 'Skin Redness', 
      icon: '🔴', 
      color: 'bg-red-400',
      description: 'Unusual redness, warmth, or rash on breast skin',
      details: 'Inflammatory breast cancer can cause redness, warmth, and swelling. The breast may look infected but doesn\'t respond to antibiotics.',
      symptoms: ['Red, warm skin', 'Breast swelling', 'Skin looks infected', 'Rapid onset of symptoms']
    },
    { 
      id: 'discharge', 
      name: 'Nipple Discharge', 
      icon: '💧', 
      color: 'bg-blue-500',
      description: 'Unusual discharge from the nipple, especially if bloody',
      details: 'While most nipple discharge is benign, bloody or clear discharge from one breast should be evaluated by a healthcare provider.',
      symptoms: ['Bloody discharge', 'Clear, watery discharge', 'Discharge from one breast only', 'Spontaneous discharge']
    },
    { 
      id: 'size-change', 
      name: 'Size/Shape Change', 
      icon: '↔', 
      color: 'bg-green-500',
      description: 'Noticeable change in breast size or shape',
      details: 'Any sudden change in breast size or shape, especially if it affects only one breast, should be examined.',
      symptoms: ['One breast larger than other', 'Change in breast contour', 'Breast appears different', 'Asymmetrical appearance']
    },
    { 
      id: 'lymph-nodes', 
      name: 'Swollen Lymph Nodes', 
      icon: '⚪', 
      color: 'bg-gray-500',
      description: 'Swollen lymph nodes under the arm or near the collarbone',
      details: 'Breast cancer can spread to nearby lymph nodes, causing them to become enlarged and sometimes painful.',
      symptoms: ['Lumps under arm', 'Swelling near collarbone', 'Tender lymph nodes', 'Hard, fixed nodes']
    }
  ];

  // Generate game data
  const generateGameData = () => {
    const currentLevel = levels[level];
    const selectedSigns = signTypes.slice(0, currentLevel.signs);
    
    // Generate positions for signs (avoiding overlap)
    const positions = [];
    for (let i = 0; i < currentLevel.signs; i++) {
      let position;
      do {
        position = {
          x: Math.random() * 70 + 10, // 10-80% from left
          y: Math.random() * 60 + 20  // 20-80% from top
        };
      } while (positions.some(p => 
        Math.abs(p.x - position.x) < 15 || Math.abs(p.y - position.y) < 15
      ));
      positions.push(position);
    }

    return {
      signs: selectedSigns.map((sign, index) => ({
        ...sign,
        position: positions[index],
        found: false
      }))
    };
  };

  // Start game
  const startGame = () => {
    const data = generateGameData();
    setGameData(data);
    setGameState('playing');
    setScore(0);
    setFoundSigns([]);
    setTimeLeft(levels[level].timeLimit);
  };

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      endGame();
    }
  }, [timeLeft, gameState]);

  // Handle sign click
  const handleSignClick = (signId, event) => {
    if (gameState !== 'playing') return;
    
    event.stopPropagation();
    
    if (!foundSigns.includes(signId)) {
      const timeBonus = timeLeft > 20 ? 1.5 : 1;
      const points = Math.floor(50 * levels[level].multiplier * timeBonus);
      
      setScore(prev => prev + points);
      setFoundSigns(prev => [...prev, signId]);
      
      // Show sign details
      const clickedSign = gameData.signs.find(sign => sign.id === signId);
      setSelectedSign(clickedSign);
      setShowSignDetails(true);
      
      // Update game data
      setGameData(prev => ({
        ...prev,
        signs: prev.signs.map(sign => 
          sign.id === signId ? { ...sign, found: true } : sign
        )
      }));

      // Auto-hide details after 3 seconds and check if game complete
      setTimeout(() => {
        setShowSignDetails(false);
        setSelectedSign(null);
        
        // Check if all signs found
        if (foundSigns.length + 1 === gameData.signs.length) {
          setTimeout(() => endGame(), 500);
        }
      }, 3000);
    }
  };

  // Handle wrong click (false positive)
  const handleWrongClick = () => {
    if (gameState !== 'playing') return;
    setScore(prev => Math.max(0, prev - 20));
  };

  // End game
  const endGame = () => {
    setGameState('results');
  };

  // Menu Screen
  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="flex items-center mb-8">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-pink-600 transition-colors mr-4"
            >
              <ArrowLeft className="w-6 h-6 mr-2" />
              Back to Games
            </button>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
              🕵️‍♀️ Spot The Sign
            </h1>
            <p className="text-xl text-gray-600">
              Find unusual changes in breast images to become an Eagle Eye Detective!
            </p>
          </div>

          {/* Level Selection */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Choose Your Challenge</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {Object.entries(levels).map(([levelKey, levelData]) => (
                <div
                  key={levelKey}
                  className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                    level === levelKey
                      ? 'border-pink-500 bg-pink-50 shadow-lg scale-105'
                      : 'border-gray-200 bg-white hover:border-pink-300 hover:shadow-md'
                  }`}
                  onClick={() => setLevel(levelKey)}
                >
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 capitalize">{levelKey}</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div>Signs to find: <span className="font-semibold text-pink-600">{levelData.signs}</span></div>
                      <div>Time limit: <span className="font-semibold text-purple-600">{levelData.timeLimit}s</span></div>
                      <div>Multiplier: <span className="font-semibold text-green-600">{levelData.multiplier}x</span></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">How to Play</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">🎯 Objective</h3>
                <p className="text-gray-600 text-sm">Find all the unusual signs in the breast image before time runs out!</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">⏱️ Scoring</h3>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Correct spot: +50 points</li>
                  <li>• Time bonus: +50% if found in first 10s</li>
                  <li>• Wrong click: -20 points</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Signs Reference */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Signs to Look For</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {signTypes.map((sign) => (
                <div key={sign.id} className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl mb-2">{sign.icon}</div>
                  <div className="text-sm font-semibold text-gray-700">{sign.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <div className="text-center">
            <button
              onClick={startGame}
              className="px-12 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xl font-bold rounded-2xl shadow-lg hover:scale-105 transition-all duration-300"
            >
              Start Game 🚀
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Game Screen
  if (gameState === 'playing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Game Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-6">
              <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                <Clock className="w-5 h-5 text-red-500 mr-2" />
                <span className="font-bold text-red-600">{timeLeft}s</span>
              </div>
              <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                <Target className="w-5 h-5 text-green-500 mr-2" />
                <span className="font-bold text-green-600">{score} pts</span>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Found: {foundSigns.length}/{gameData?.signs.length}
            </div>
          </div>

          {/* Game Area */}
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
            <div 
              className="relative w-full h-96 bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl overflow-hidden cursor-crosshair"
              onClick={handleWrongClick}
            >
              {/* Realistic Breast Anatomy Background */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg width="300" height="280" viewBox="0 0 300 280" className="opacity-80">
                  {/* Breast outline */}
                  <ellipse cx="150" cy="140" rx="120" ry="100" fill="#f8d7da" stroke="#e1a3a8" strokeWidth="2"/>
                  
                  {/* Nipple area */}
                  <circle cx="150" cy="120" r="12" fill="#d1949e" stroke="#c1848a" strokeWidth="1"/>
                  <circle cx="150" cy="120" r="4" fill="#b8838a"/>
                  
                  {/* Areola */}
                  <circle cx="150" cy="120" r="20" fill="none" stroke="#d1949e" strokeWidth="1" opacity="0.5"/>
                  
                  {/* Breast tissue texture */}
                  <path d="M80 100 Q150 80 220 100" stroke="#e8b4b8" strokeWidth="1" fill="none" opacity="0.3"/>
                  <path d="M90 160 Q150 140 210 160" stroke="#e8b4b8" strokeWidth="1" fill="none" opacity="0.3"/>
                  <path d="M100 200 Q150 180 200 200" stroke="#e8b4b8" strokeWidth="1" fill="none" opacity="0.3"/>
                  
                  {/* Lymph node areas */}
                  <circle cx="80" cy="80" r="8" fill="#f0c2c6" opacity="0.4"/>
                  <circle cx="220" cy="80" r="8" fill="#f0c2c6" opacity="0.4"/>
                </svg>
              </div>
              
              {/* Signs */}
              {gameData?.signs.map((sign) => (
                <div
                  key={sign.id}
                  className={`absolute w-6 h-6 ${sign.color} rounded-full cursor-pointer transition-all duration-300 ${
                    sign.found ? 'scale-150 ring-4 ring-green-400 z-10' : 'hover:scale-125 animate-pulse'
                  }`}
                  style={{
                    left: `${sign.position.x}%`,
                    top: `${sign.position.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={(e) => handleSignClick(sign.id, e)}
                  title={sign.name}
                >
                  <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                    {sign.icon}
                  </div>
                  {sign.found && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      ✓ Found!
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Sign Details Modal */}
            {showSignDetails && selectedSign && (
              <div className="absolute inset-0 bg-black/50 rounded-3xl flex items-center justify-center z-20">
                <div className="bg-white rounded-2xl p-6 max-w-md mx-4 shadow-2xl">
                  <div className="flex items-center mb-4">
                    <div className={`w-8 h-8 ${selectedSign.color} rounded-full flex items-center justify-center text-white mr-3`}>
                      {selectedSign.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedSign.name}</h3>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{selectedSign.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Key Symptoms:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {selectedSign.symptoms?.map((symptom, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                          {symptom}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">{selectedSign.details}</p>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => {
                        setShowSignDetails(false);
                        setSelectedSign(null);
                      }}
                      className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                    >
                      Continue Game
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">Progress</span>
              <span className="text-sm text-gray-600">{foundSigns.length}/{gameData?.signs.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-pink-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(foundSigns.length / gameData?.signs.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (gameState === 'results') {
    const totalPossibleScore = gameData?.signs.length * 50 * levels[level].multiplier;
    const percentage = Math.round((score / totalPossibleScore) * 100);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">
              {percentage >= 80 ? '🏆' : percentage >= 60 ? '🥈' : percentage >= 40 ? '🥉' : '💪'}
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
              {percentage >= 80 ? 'Excellent!' : percentage >= 60 ? 'Great Job!' : percentage >= 40 ? 'Good Effort!' : 'Keep Practicing!'}
            </h1>
          </div>

          {/* Results Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 mb-8">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-pink-600">{score}</div>
                <div className="text-gray-600">Final Score</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">{foundSigns.length}/{gameData?.signs.length}</div>
                <div className="text-gray-600">Signs Found</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">{percentage}%</div>
                <div className="text-gray-600">Accuracy</div>
              </div>
            </div>
          </div>

          {/* Badge Earned */}
          {percentage >= 80 && (
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-3xl p-8 shadow-xl border border-yellow-200 mb-8">
              <div className="text-center">
                <Award className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Badge Earned!</h2>
                <div className="text-xl font-semibold text-gray-800">Eagle Eye Detective 🦅</div>
                <p className="text-gray-600 mt-2">You've mastered the art of spotting breast health signs!</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={startGame}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-all duration-300"
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

export default SpotTheSignGame;