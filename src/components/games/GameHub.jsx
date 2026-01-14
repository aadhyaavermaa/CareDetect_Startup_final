import React, { useState, useEffect } from 'react';
import { Trophy, Star, Eye, Shield, Target, Award, Play, Lock, ArrowLeft } from 'lucide-react';
import SpotTheSignGame from './SpotTheSignGame';
import MythVsFactGame from './MythVsFactGame';
import LanguageSelector from '../LanguageSelector';
import { useLanguage } from '../../contexts/LanguageContext';

const GameHub = ({ onClose }) => {
  const { t } = useLanguage();
  const [selectedGame, setSelectedGame] = useState(null);
  const [userStats, setUserStats] = useState({
    totalPoints: 1250,
    badges: 3,
    totalBadges: 5,
    gamesPlayed: 15,
    streak: 7
  });

  const games = [
    {
      id: 'spot-the-sign',
      title: t('spotTheSign'),
      icon: Eye,
      emoji: '🕵️‍♀️',
      description: t('spotTheSignDesc'),
      difficulty: 'Easy to Hard',
      points: '50-150 pts',
      badge: 'Eagle Eye Detective 🦅',
      color: 'from-pink-500 to-rose-600',
      unlocked: true,
      completed: true
    },
    {
      id: 'myth-vs-fact',
      title: t('mythVsFact'),
      icon: Shield,
      emoji: '⚖️',
      description: t('mythVsFactDesc'),
      difficulty: '10 Questions',
      points: '100-200 pts',
      badge: 'Myth Buster 🛡️',
      color: 'from-purple-500 to-indigo-600',
      unlocked: true,
      completed: false
    },
    {
      id: 'coming-soon',
      title: t('riskAssessment'),
      icon: Target,
      emoji: '🎯',
      description: t('riskAssessmentDesc'),
      difficulty: t('comingSoon'),
      points: '??? pts',
      badge: 'Risk Master 📊',
      color: 'from-gray-400 to-gray-500',
      unlocked: false,
      completed: false
    }
  ];

  if (selectedGame === 'spot-the-sign') {
    return <SpotTheSignGame onBack={() => setSelectedGame(null)} onClose={onClose} />;
  }

  if (selectedGame === 'myth-vs-fact') {
    return <MythVsFactGame onBack={() => setSelectedGame(null)} onClose={onClose} />;
  }

  return (
    <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4 min-h-full">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          {/* Back Button */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={onClose}
              className="flex items-center text-gray-600 hover:text-pink-600 transition-colors bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-pink-100"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {t('backToHome')}
            </button>
            <LanguageSelector />
          </div>
          
          <div className="flex items-center justify-center mb-4">
            <Trophy className="w-12 h-12 text-yellow-500 mr-3" />
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              {t('gameHubTitle')}
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-6">
            {t('gameHubSubtitle')}
          </p>
          
          {/* Stats Bar */}
          <div className="flex justify-center items-center space-x-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">{userStats.totalPoints}</div>
              <div className="text-sm text-gray-600">{t('points')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{userStats.badges}/{userStats.totalBadges}</div>
              <div className="text-sm text-gray-600">{t('badges')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{userStats.gamesPlayed}</div>
              <div className="text-sm text-gray-600">{t('gamesPlayed')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{userStats.streak}</div>
              <div className="text-sm text-gray-600">{t('dayStreak')}</div>
            </div>
          </div>
        </div>

        {/* Game Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {games.map((game) => {
            const IconComponent = game.icon;
            return (
              <div
                key={game.id}
                className={`relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  game.unlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-75'
                }`}
                onClick={() => game.unlocked && game.id !== 'coming-soon' && setSelectedGame(game.id)}
              >
                {/* Badge/Status Indicator */}
                <div className="absolute -top-3 -right-3">
                  {game.completed ? (
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                  ) : !game.unlocked ? (
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                  ) : null}
                </div>

                {/* Game Icon */}
                <div className={`w-20 h-20 bg-gradient-to-br ${game.color} rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg`}>
                  <IconComponent className="w-10 h-10 text-white" />
                </div>

                {/* Game Info */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {game.title} {game.emoji}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{game.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{t('difficulty')}:</span>
                      <span className="font-semibold text-gray-700">{game.difficulty}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{t('reward')}:</span>
                      <span className="font-semibold text-green-600">{game.points}</span>
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-3 mb-4">
                    <div className="text-xs text-gray-600 mb-1">{t('badgeToUnlock')}:</div>
                    <div className="font-semibold text-gray-800">{game.badge}</div>
                  </div>

                  {/* Play Button */}
                  <button
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center ${
                      game.unlocked && game.id !== 'coming-soon'
                        ? `bg-gradient-to-r ${game.color} text-white hover:scale-105 shadow-lg`
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={!game.unlocked || game.id === 'coming-soon'}
                  >
                    {game.unlocked && game.id !== 'coming-soon' ? (
                      <>
                        <Play className="w-5 h-5 mr-2" />
                        {t('playNow')}
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5 mr-2" />
                        {game.id === 'coming-soon' ? t('comingSoon') : t('locked')}
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Achievement Showcase */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">🏆 {t('yourAchievements')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: t('firstSteps'), emoji: '👶', unlocked: true },
              { name: t('eagleEye'), emoji: '🦅', unlocked: true },
              { name: t('mythBuster'), emoji: '🛡️', unlocked: true },
              { name: t('streakMaster'), emoji: '🔥', unlocked: false },
              { name: t('healthHero'), emoji: '🦸‍♀️', unlocked: false }
            ].map((badge, index) => (
              <div
                key={index}
                className={`text-center p-4 rounded-xl transition-all duration-300 ${
                  badge.unlocked
                    ? 'bg-gradient-to-br from-yellow-100 to-orange-100 shadow-md'
                    : 'bg-gray-100 opacity-50'
                }`}
              >
                <div className="text-3xl mb-2">{badge.emoji}</div>
                <div className={`text-sm font-semibold ${badge.unlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                  {badge.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameHub;