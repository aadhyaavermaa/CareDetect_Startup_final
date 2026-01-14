# TODO: Complete Multilingual Integration

## ✅ Already Done
- [x] Translation system created
- [x] Language context provider
- [x] Language selector component
- [x] GameHub fully translated
- [x] App wrapped with LanguageProvider

## 🎯 Remaining Tasks

### Task 1: Integrate MythVsFactGame (2-3 hours)

#### Step 1.1: Add Imports (2 minutes)
```javascript
// At the top of src/components/games/MythVsFactGame.jsx
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSelector from '../LanguageSelector';
```

#### Step 1.2: Add Hook (1 minute)
```javascript
// Inside MythVsFactGame component, after the opening line
const { t, tGame, language } = useLanguage();
```

#### Step 1.3: Add Language Selector to Menu Screen (5 minutes)
Find the header section in menu screen and add:
```javascript
<div className="flex justify-between items-center mb-6">
  <button onClick={onBack}>
    <ArrowLeft className="w-6 h-6 mr-2" />
    {t('backToGames')}
  </button>
  <LanguageSelector />
</div>
```

#### Step 1.4: Replace UI Text (30 minutes)
Replace these hardcoded strings:

**Menu Screen:**
- "Myth vs Fact" → `{tGame('mythVsFact', 'title')}`
- "Bust myths..." → `{tGame('mythVsFact', 'subtitle')}`
- "Game Rules" → `{tGame('mythVsFact', 'gameRules')}`
- "How to Play" → `{tGame('mythVsFact', 'howToPlay')}`
- "Scoring System" → `{tGame('mythVsFact', 'scoringSystem')}`
- "Start Quiz 🚀" → `{t('startQuiz')} 🚀`

**Game Screen:**
- "Back to Games" → `{t('backToGames')}`
- "Submit Quiz" → `{t('submitQuiz')}`
- "MYTH" → `{tGame('mythVsFact', 'myth')}`
- "FACT" → `{tGame('mythVsFact', 'fact')}`
- "This statement is FALSE" → `{tGame('mythVsFact', 'mythDesc')}`
- "This statement is TRUE" → `{tGame('mythVsFact', 'factDesc')}`
- "Correct!" → `{tGame('mythVsFact', 'correct')}`
- "Incorrect!" → `{tGame('mythVsFact', 'incorrect')}`

**Results Screen:**
- "Final Score" → `{tGame('mythVsFact', 'finalScore')}`
- "Correct" → `{tGame('mythVsFact', 'correctAnswers')}`
- "Best Streak" → `{tGame('mythVsFact', 'bestStreak')}`
- "Play Again" → `{t('playAgain')}`
- "Back to Games" → `{t('backToGames')}`

#### Step 1.5: Translate Questions (1-2 hours)
Create a function to get translated questions:

```javascript
const getTranslatedQuestions = () => {
  const questionsData = {
    en: [
      // Copy all 30 existing English questions here
    ],
    hi: [
      // Add Hindi translations of all 30 questions
      {
        id: 1,
        question: "क्या सभी स्तन गांठें कैंसरयुक्त होती हैं?",
        answer: false,
        type: "myth",
        explanation: "80-90% स्तन गांठें सौम्य होती हैं...",
        category: "लक्षण"
      },
      // ... 29 more
    ],
    es: [
      // Add Spanish translations of all 30 questions
      {
        id: 1,
        question: "¿Todos los bultos mamarios son cancerosos?",
        answer: false,
        type: "myth",
        explanation: "El 80-90% de los bultos mamarios son benignos...",
        category: "Síntomas"
      },
      // ... 29 more
    ]
  };
  
  return questionsData[language] || questionsData.en;
};

// Replace the allQuestions constant with:
const allQuestions = getTranslatedQuestions();
```

#### Step 1.6: Test (10 minutes)
- [ ] Language selector appears
- [ ] All UI text translates
- [ ] Questions appear in selected language
- [ ] Explanations translate
- [ ] Categories translate
- [ ] Results screen translates

---

### Task 2: Integrate SpotTheSignGame (1-2 hours)

#### Step 2.1: Add Imports (2 minutes)
```javascript
// At the top of src/components/games/SpotTheSignGame.jsx
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSelector from '../LanguageSelector';
```

#### Step 2.2: Add Hook (1 minute)
```javascript
// Inside SpotTheSignGame component
const { t, tGame, language } = useLanguage();
```

#### Step 2.3: Add Language Selector to Menu Screen (5 minutes)
```javascript
<div className="flex justify-between items-center mb-6">
  <button onClick={onBack}>
    <ArrowLeft className="w-6 h-6 mr-2" />
    {t('backToGames')}
  </button>
  <LanguageSelector />
</div>
```

#### Step 2.4: Replace UI Text (30 minutes)
Replace these hardcoded strings:

**Menu Screen:**
- "Spot The Sign" → `{tGame('spotTheSign', 'title')}`
- "Find unusual changes..." → `{tGame('spotTheSign', 'subtitle')}`
- "Choose Your Challenge" → `{tGame('spotTheSign', 'chooseChallenge')}`
- "Easy" → `{tGame('spotTheSign', 'easy')}`
- "Medium" → `{tGame('spotTheSign', 'medium')}`
- "Hard" → `{tGame('spotTheSign', 'hard')}`
- "How to Play" → `{tGame('spotTheSign', 'howToPlay')}`
- "Start Game 🚀" → `{t('startGame')} 🚀`

**Game Screen:**
- "Back to Games" → `{t('backToGames')}`
- "Submit Game" → `{t('submitGame')}`
- "Found" → `{tGame('spotTheSign', 'found')}`
- "Progress" → `{tGame('spotTheSign', 'progress')}`

**Results Screen:**
- "Final Score" → `{tGame('spotTheSign', 'finalScore')}`
- "Signs Found" → `{tGame('spotTheSign', 'signsFound')}`
- "Accuracy" → `{tGame('spotTheSign', 'accuracy')}`
- "Excellent!" → `{tGame('spotTheSign', 'excellent')}`
- "Great Job!" → `{tGame('spotTheSign', 'greatJob')}`
- "Play Again" → `{t('playAgain')}`

#### Step 2.5: Translate Sign Types (20 minutes)
Update the signTypes array to use translations:

```javascript
const signTypes = [
  { 
    id: 'lump', 
    name: tGame('spotTheSign', 'lump'),
    icon: '●', 
    color: 'bg-red-500',
    description: tGame('spotTheSign', 'lumpDesc'),
    // ... rest
  },
  // ... update all 7 sign types
];
```

#### Step 2.6: Test (10 minutes)
- [ ] Language selector appears
- [ ] All UI text translates
- [ ] Sign names translate
- [ ] Sign descriptions translate
- [ ] Level descriptions translate
- [ ] Results screen translates

---

## 🎯 Quick Win Strategy

**Start with the easiest parts first:**

1. **Day 1 (30 minutes):**
   - Add imports to both games
   - Add hooks to both games
   - Add language selectors to both games
   - Test that selectors appear

2. **Day 2 (1 hour):**
   - Replace all UI text in MythVsFactGame
   - Replace all UI text in SpotTheSignGame
   - Test language switching for UI

3. **Day 3 (2 hours):**
   - Translate all 30 questions for MythVsFactGame
   - Test question translations

4. **Day 4 (30 minutes):**
   - Final testing
   - Fix any issues
   - Celebrate! 🎉

---

## 📋 Testing Checklist

### MythVsFactGame
- [ ] Language selector visible in menu
- [ ] Menu text translates
- [ ] Game rules translate
- [ ] Questions translate
- [ ] Explanations translate
- [ ] Categories translate
- [ ] Feedback messages translate
- [ ] Results screen translates
- [ ] Language persists on refresh

### SpotTheSignGame
- [ ] Language selector visible in menu
- [ ] Menu text translates
- [ ] Level descriptions translate
- [ ] Instructions translate
- [ ] Sign names translate
- [ ] Sign descriptions translate
- [ ] Game feedback translates
- [ ] Results screen translates
- [ ] Language persists on refresh

### Overall
- [ ] Can switch languages in any game
- [ ] Language choice persists across games
- [ ] No console errors
- [ ] All text readable in all languages
- [ ] UI doesn't break with longer text
- [ ] Mobile responsive

---

## 🆘 Need Help?

**If stuck, check these files:**
1. `MULTILINGUAL_QUICK_REFERENCE.md` - Quick syntax reference
2. `TRANSLATION_EXAMPLES.md` - Code examples
3. `MULTILINGUAL_INTEGRATION_GUIDE.md` - Detailed guide
4. `src/components/games/GameHub.jsx` - Working example

**Common Issues:**
- **Text not translating?** Check the key exists in translations.js or gameTranslations.js
- **Wrong function?** Use `t()` for common text, `tGame()` for game-specific
- **Missing import?** Make sure you imported useLanguage and LanguageSelector

---

## ✨ When Complete

You'll have:
- ✅ Fully multilingual game section
- ✅ Support for 3 languages (English, Hindi, Spanish)
- ✅ Professional language switching
- ✅ Persistent language preference
- ✅ Easy to add more languages

**Estimated Total Time: 4-6 hours**

Good luck! 🚀
