// Multilingual translations for games
export const translations = {
  en: {
    // Common
    back: 'Back',
    backToGames: 'Back to Games',
    backToHome: 'Back to Home',
    playNow: 'Play Now',
    playAgain: 'Play Again',
    startGame: 'Start Game',
    startQuiz: 'Start Quiz',
    submit: 'Submit',
    submitGame: 'Submit Game',
    submitQuiz: 'Submit Quiz',
    continue: 'Continue Game',
    accuracy: 'Accuracy',
    badgeEarned: 'Badge Earned!',
    
    // GameHub
    gameHubTitle: 'Breast Health Hero Challenge',
    gameHubSubtitle: 'Play fun games, earn badges, and become a breast health expert!',
    points: 'Points',
    badges: 'Badges',
    gamesPlayed: 'Games Played',
    dayStreak: 'Day Streak',
    
    // Game Cards
    spotTheSign: 'Spot The Sign',
    spotTheSignDesc: 'Find unusual changes in breast images',
    mythVsFact: 'Myth vs Fact',
    mythVsFactDesc: 'Bust myths with rapid-fire quiz',
    riskAssessment: 'Risk Assessment',
    riskAssessmentDesc: 'Interactive risk calculator game',
    
    difficulty: 'Difficulty',
    reward: 'Reward',
    badgeToUnlock: 'Badge to Unlock',
    locked: 'Locked',
    comingSoon: 'Coming Soon',
    
    // Achievements
    yourAchievements: 'Your Achievements',
    firstSteps: 'First Steps',
    eagleEye: 'Eagle Eye',
    mythBuster: 'Myth Buster',
    streakMaster: 'Streak Master',
    healthHero: 'Health Hero',
  },
  
  hi: {
    // Common
    back: 'वापस',
    backToGames: 'खेलों पर वापस जाएं',
    backToHome: 'होम पर वापस जाएं',
    playNow: 'अभी खेलें',
    playAgain: 'फिर से खेलें',
    startGame: 'खेल शुरू करें',
    startQuiz: 'क्विज़ शुरू करें',
    submit: 'जमा करें',
    submitGame: 'खेल जमा करें',
    submitQuiz: 'क्विज़ जमा करें',
    continue: 'खेल जारी रखें',
    accuracy: 'सटीकता',
    badgeEarned: 'बैज अर्जित किया!',
    
    // GameHub
    gameHubTitle: 'स्तन स्वास्थ्य हीरो चैलेंज',
    gameHubSubtitle: 'मज़ेदार खेल खेलें, बैज अर्जित करें, और स्तन स्वास्थ्य विशेषज्ञ बनें!',
    points: 'अंक',
    badges: 'बैज',
    gamesPlayed: 'खेले गए खेल',
    dayStreak: 'दिन की लकीर',
    
    // Game Cards
    spotTheSign: 'संकेत खोजें',
    spotTheSignDesc: 'स्तन छवियों में असामान्य परिवर्तन खोजें',
    mythVsFact: 'मिथक बनाम तथ्य',
    mythVsFactDesc: 'तेज़ क्विज़ के साथ मिथकों को तोड़ें',
    riskAssessment: 'जोखिम मूल्यांकन',
    riskAssessmentDesc: 'इंटरैक्टिव जोखिम कैलकुलेटर खेल',
    
    difficulty: 'कठिनाई',
    reward: 'पुरस्कार',
    badgeToUnlock: 'अनलॉक करने के लिए बैज',
    locked: 'लॉक',
    comingSoon: 'जल्द आ रहा है',
    
    // Achievements
    yourAchievements: 'आपकी उपलब्धियां',
    firstSteps: 'पहले कदम',
    eagleEye: 'ईगल आई',
    mythBuster: 'मिथक बस्टर',
    streakMaster: 'स्ट्रीक मास्टर',
    healthHero: 'स्वास्थ्य हीरो',
  }
};

// Language names for display
export const languages = {
  en: 'English',
  hi: 'हिंदी'
};

// Hook for using translations
export const useTranslation = (language = 'en') => {
  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };
  
  return { t, language };
};
