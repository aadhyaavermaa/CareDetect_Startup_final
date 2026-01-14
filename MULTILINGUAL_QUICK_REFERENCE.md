# Multilingual Feature - Quick Reference

## 🎯 What's Been Done

✅ **Created Translation System**
- `src/utils/translations.js` - Common UI translations
- `src/utils/gameTranslations.js` - Game-specific translations
- `src/contexts/LanguageContext.js` - Language management context
- `src/components/LanguageSelector.js` - Language dropdown component

✅ **Updated Files**
- `src/index.js` - Wrapped app with LanguageProvider
- `src/components/games/GameHub.jsx` - Fully translated with language selector

✅ **Supported Languages**
- 🇬🇧 English (en) - Default
- 🇮🇳 Hindi (hi) - हिंदी
- 🇪🇸 Spanish (es) - Español

## 🚀 How to Use

### In Any Component

```javascript
// 1. Import the hook
import { useLanguage } from '../../contexts/LanguageContext';

// 2. Use in component
const MyComponent = () => {
  const { t, tGame, language, changeLanguage } = useLanguage();
  
  return (
    <div>
      <h1>{t('gameHubTitle')}</h1>
      <p>{tGame('spotTheSign', 'title')}</p>
      <button>{t('playNow')}</button>
    </div>
  );
};
```

### Add Language Selector

```javascript
import LanguageSelector from '../LanguageSelector';

// In your JSX
<LanguageSelector />
```

## 📝 Translation Functions

| Function | Usage | Example |
|----------|-------|---------|
| `t(key)` | Common translations | `t('playNow')` → "Play Now" |
| `tGame(game, key)` | Game-specific | `tGame('mythVsFact', 'title')` → "Myth vs Fact" |
| `language` | Current language | `language` → "en" |
| `changeLanguage(lang)` | Change language | `changeLanguage('hi')` |

## 🎮 Available Translation Keys

### Common Keys (use with `t()`)
```
back, backToGames, backToHome, playNow, playAgain, startGame, 
startQuiz, submit, submitGame, submitQuiz, continue, points, 
badges, gamesPlayed, dayStreak, difficulty, reward, badgeToUnlock, 
locked, comingSoon, yourAchievements, firstSteps, eagleEye, 
mythBuster, streakMaster, healthHero
```

### Game Keys (use with `tGame('spotTheSign', key)`)
```
title, subtitle, chooseChallenge, easy, medium, hard, easyDesc, 
mediumDesc, hardDesc, signsToFind, timeLimit, multiplier, 
howToPlay, objective, scoring, found, progress, finalScore, 
signsFound, accuracy, badgeEarned, excellent, greatJob, 
goodEffort, keepPracticing
```

### Game Keys (use with `tGame('mythVsFact', key)`)
```
title, subtitle, gameRules, howToPlay, scoringSystem, 
questionCategories, myth, fact, mythDesc, factDesc, correct, 
incorrect, streak, finalScore, correctAnswers, bestStreak
```

## 🔧 Next Steps to Complete Integration

### For MythVsFactGame.jsx

1. Add imports:
```javascript
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSelector from '../LanguageSelector';
```

2. Add hook:
```javascript
const { t, tGame, language } = useLanguage();
```

3. Add language selector to header:
```javascript
<div className="flex justify-between">
  <button onClick={onBack}>{t('backToGames')}</button>
  <LanguageSelector />
</div>
```

4. Replace text:
```javascript
// Before: <h1>Myth vs Fact</h1>
// After:
<h1>{tGame('mythVsFact', 'title')}</h1>

// Before: <button>Play Again</button>
// After:
<button>{t('playAgain')}</button>
```

5. Translate questions (create separate arrays for each language)

### For SpotTheSignGame.jsx

Same steps as MythVsFactGame above.

## 💾 Data Persistence

Language preference is automatically saved to `localStorage` and persists across:
- Page refreshes
- Browser sessions
- Different tabs

## 🌍 Adding More Languages

1. Add to `src/utils/translations.js`:
```javascript
fr: {
  playNow: 'Jouer Maintenant',
  // ... more translations
}
```

2. Add to `src/utils/gameTranslations.js`:
```javascript
fr: {
  spotTheSign: {
    title: 'Repérer le Signe',
    // ... more translations
  }
}
```

3. Add to `src/components/LanguageSelector.js`:
```javascript
{ code: 'fr', name: 'Français', flag: '🇫🇷' }
```

## 🐛 Troubleshooting

**Text not translating?**
- Check if key exists in translations.js or gameTranslations.js
- Verify you're using correct function (t vs tGame)
- Check language code is correct ('en', 'hi', 'es')

**Language not persisting?**
- Check browser localStorage is enabled
- Clear localStorage and try again

**Missing translations?**
- Falls back to English automatically
- Add missing keys to translation files

## 📚 Files Reference

```
src/
├── utils/
│   ├── translations.js          # Common translations
│   └── gameTranslations.js      # Game-specific translations
├── contexts/
│   └── LanguageContext.js       # Language context provider
├── components/
│   ├── LanguageSelector.js      # Language dropdown
│   └── games/
│       ├── GameHub.jsx          # ✅ Already translated
│       ├── MythVsFactGame.jsx   # ⏳ Needs translation
│       └── SpotTheSignGame.jsx  # ⏳ Needs translation
└── index.js                     # ✅ Wrapped with provider
```

## 🎨 Language Selector Styling

The language selector automatically matches your app's design:
- White background with backdrop blur
- Pink border and accents
- Globe icon
- Dropdown with flags and language names

## ✨ Features

- ✅ Instant language switching
- ✅ Persistent language preference
- ✅ Fallback to English for missing translations
- ✅ Easy to add new languages
- ✅ Minimal code changes needed
- ✅ Works with all React components
