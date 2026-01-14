# Translation Examples for Game Questions

## Example: How to Translate MythVsFactGame Questions

Since there are 30 questions in the game, here's the pattern to follow:

### English Question (Original)
```javascript
{
  id: 1,
  question: "All breast lumps are cancerous?",
  answer: false,
  type: "myth",
  explanation: "80-90% of breast lumps are benign (non-cancerous). However, every lump needs proper doctor evaluation for accurate diagnosis.",
  category: "Symptoms"
}
```

### Hindi Translation
```javascript
{
  id: 1,
  question: "क्या सभी स्तन गांठें कैंसरयुक्त होती हैं?",
  answer: false,
  type: "myth",
  explanation: "80-90% स्तन गांठें सौम्य (गैर-कैंसरयुक्त) होती हैं। हालांकि, सटीक निदान के लिए हर गांठ का उचित डॉक्टर मूल्यांकन आवश्यक है।",
  category: "लक्षण"
}
```

### Spanish Translation
```javascript
{
  id: 1,
  question: "¿Todos los bultos mamarios son cancerosos?",
  answer: false,
  type: "myth",
  explanation: "El 80-90% de los bultos mamarios son benignos (no cancerosos). Sin embargo, cada bulto necesita una evaluación médica adecuada para un diagnóstico preciso.",
  category: "Síntomas"
}
```

## Implementation Approach

### Option 1: Keep Questions in Component (Simpler)

In `MythVsFactGame.jsx`, create a function that returns translated questions:

```javascript
import { useLanguage } from '../../contexts/LanguageContext';

const MythVsFactGame = ({ onBack, onClose }) => {
  const { language, t, tGame } = useLanguage();
  
  const getQuestions = () => {
    const questionsData = {
      en: [
        // All 30 English questions
      ],
      hi: [
        // All 30 Hindi questions
      ],
      es: [
        // All 30 Spanish questions
      ]
    };
    
    return questionsData[language] || questionsData.en;
  };
  
  const allQuestions = getQuestions();
  // Rest of your game logic...
};
```

### Option 2: Separate File (More Organized)

Create `src/data/mythVsFactQuestions.js`:

```javascript
export const mythVsFactQuestions = {
  en: [
    // All 30 English questions
  ],
  hi: [
    // All 30 Hindi questions  
  ],
  es: [
    // All 30 Spanish questions
  ]
};
```

Then in your component:

```javascript
import { mythVsFactQuestions } from '../../data/mythVsFactQuestions';
import { useLanguage } from '../../contexts/LanguageContext';

const MythVsFactGame = ({ onBack, onClose }) => {
  const { language } = useLanguage();
  const allQuestions = mythVsFactQuestions[language] || mythVsFactQuestions.en;
  // Rest of your game logic...
};
```

## Category Translations

Make sure to translate category names too:

```javascript
const categoryTranslations = {
  en: {
    'Symptoms': 'Symptoms',
    'Age & Risk': 'Age & Risk',
    'Genetics': 'Genetics',
    'Treatment': 'Treatment',
    'Screening': 'Screening',
    'Lifestyle': 'Lifestyle',
    'Prevention': 'Prevention',
    'Gender': 'Gender',
    'Statistics': 'Statistics'
  },
  hi: {
    'Symptoms': 'लक्षण',
    'Age & Risk': 'आयु और जोखिम',
    'Genetics': 'आनुवंशिकी',
    'Treatment': 'उपचार',
    'Screening': 'जांच',
    'Lifestyle': 'जीवनशैली',
    'Prevention': 'रोकथाम',
    'Gender': 'लिंग',
    'Statistics': 'आंकड़े'
  },
  es: {
    'Symptoms': 'Síntomas',
    'Age & Risk': 'Edad y Riesgo',
    'Genetics': 'Genética',
    'Treatment': 'Tratamiento',
    'Screening': 'Detección',
    'Lifestyle': 'Estilo de Vida',
    'Prevention': 'Prevención',
    'Gender': 'Género',
    'Statistics': 'Estadísticas'
  }
};
```

## Quick Start Steps

1. **GameHub is already done** ✅ - Language selector is visible
2. **Add to MythVsFactGame**:
   - Import `useLanguage` hook
   - Add `LanguageSelector` component to header
   - Replace hardcoded UI text with `t()` and `tGame()` calls
   - Create translated question arrays
3. **Add to SpotTheSignGame**:
   - Same steps as MythVsFactGame
   - Translate sign descriptions and UI text

## Testing Checklist

- [ ] Language selector appears in all game screens
- [ ] Switching language updates all visible text
- [ ] Questions appear in selected language
- [ ] Buttons and labels are translated
- [ ] Category names are translated
- [ ] Explanations are translated
- [ ] Language preference persists after refresh
