# Multilingual Integration Guide for Games

## Overview
This guide shows how to integrate the multilingual feature into your game components.

## Files Created

1. **src/utils/translations.js** - Common translations (buttons, labels, etc.)
2. **src/utils/gameTranslations.js** - Game-specific translations (questions, descriptions, etc.)
3. **src/contexts/LanguageContext.js** - React context for language management
4. **src/components/LanguageSelector.js** - Language selector dropdown component

## How to Use in Your Components

### 1. Import the Language Hook

```javascript
import { useLanguage } from '../../contexts/LanguageContext';
```

### 2. Use the Hook in Your Component

```javascript
const MyComponent = () => {
  const { t, tGame, language } = useLanguage();
  
  // For common translations
  const buttonText = t('playNow');
  
  // For game-specific translations
  const gameTitle = tGame('spotTheSign', 'title');
  
  return <div>{buttonText}</div>;
};
```

### 3. Add Language Selector

```javascript
import LanguageSelector from '../LanguageSelector';

// In your JSX
<LanguageSelector />
```

## Integration Steps for MythVsFactGame and SpotTheSignGame

### Step 1: Add imports at the top of each game file

```javascript
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSelector from '../LanguageSelector';
```

### Step 2: Add the hook in the component

```javascript
const MythVsFactGame = ({ onBack, onClose }) => {
  const { t, tGame } = useLanguage();
  // ... rest of your code
```

### Step 3: Replace hardcoded text with translation functions

**For common text (buttons, labels):**
```javascript
// Before
<button>Back to Games</button>

// After
<button>{t('backToGames')}</button>
```

**For game-specific text:**
```javascript
// Before
<h1>Myth vs Fact</h1>

// After
<h1>{tGame('mythVsFact', 'title')}</h1>
```

### Step 4: Add Language Selector to the header

```javascript
<div className="flex justify-between items-center mb-6">
  <button onClick={onBack}>
    {t('backToGames')}
  </button>
  <LanguageSelector />
</div>
```

## Example: Translating Questions

For the MythVsFactGame questions, you'll need to add translations to `gameTranslations.js`:

```javascript
// In gameTranslations.js
export const mythVsFactQuestions = {
  en: [
    {
      id: 1,
      question: "All breast lumps are cancerous?",
      answer: false,
      explanation: "80-90% of breast lumps are benign..."
    }
  ],
  hi: [
    {
      id: 1,
      question: "क्या सभी स्तन गांठें कैंसरयुक्त होती हैं?",
      answer: false,
      explanation: "80-90% स्तन गांठें सौम्य होती हैं..."
    }
  ],
  es: [
    {
      id: 1,
      question: "¿Todos los bultos mamarios son cancerosos?",
      answer: false,
      explanation: "El 80-90% de los bultos mamarios son benignos..."
    }
  ]
};
```

Then in your component:
```javascript
import { mythVsFactQuestions } from '../../utils/gameTranslations';

const { language } = useLanguage();
const questions = mythVsFactQuestions[language];
```

## Supported Languages

- **English (en)** - Default
- **Hindi (hi)** - हिंदी
- **Spanish (es)** - Español

## Adding More Languages

1. Add translations to `translations.js` and `gameTranslations.js`
2. Add the language option to `LanguageSelector.js`
3. The language preference is automatically saved to localStorage

## Testing

1. Start your app
2. Look for the language selector (globe icon with dropdown)
3. Switch between languages
4. All text should update immediately
5. Refresh the page - your language choice should persist

## Next Steps

To complete the integration:

1. Update `MythVsFactGame.jsx` with translation hooks
2. Update `SpotTheSignGame.jsx` with translation hooks
3. Add question translations for all 30 questions in MythVsFactGame
4. Add sign descriptions translations for SpotTheSignGame
5. Test all three languages thoroughly

## Notes

- The GameHub.jsx has already been updated with multilingual support
- Language preference persists across sessions using localStorage
- You can add more languages by extending the translation objects
- All emojis and icons remain the same across languages
