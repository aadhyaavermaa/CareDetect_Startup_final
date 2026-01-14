import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSelector = ({ className = '' }) => {
  const { language, changeLanguage } = useLanguage();

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  ];

  return (
    <div className={`relative inline-block ${className}`}>
      <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-pink-100">
        <Globe className="w-5 h-5 text-pink-600 mr-2" />
        <select
          value={language}
          onChange={(e) => changeLanguage(e.target.value)}
          className="bg-transparent border-none outline-none cursor-pointer text-gray-700 font-semibold"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LanguageSelector;
