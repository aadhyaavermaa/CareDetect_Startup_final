import React, { useState, useEffect } from 'react';
import { Heart, Shield, Users, ArrowRight, Play, CheckCircle, User, LogOut } from 'lucide-react';
import { BreastModel } from './components/BreastModel';
import OnboardingOverlay from "./components/OnboardingOverlay";
import GeneticRiskForm from './components/breastcancer/GeneticRiskForm';
import AuthModal from './components/AuthModal';
import TermsModal from './components/TermsModal';
import BreastCancerRiskAssessment from './components/BreastCancerRiskAssessment';
import DoctorModel3D from './components/DoctorModel3D';
import GameHub from './components/games/GameHub';
import BreastCancerScreening from './BreastCancerScreening';
import Dashboard from './components/Dashboard';
import { useAuth } from './contexts/AuthContext';

export default function BreastCancerLandingPage() {
  const { user, logout, isAuthenticated } = useAuth();

  // 🌟 ALL HOOKS MUST BE INSIDE THE COMPONENT
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [authModal, setAuthModal] = useState(null);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showGeneticRiskForm, setShowGeneticRiskForm] = useState(false);
  const [showBreastModel, setShowBreastModel] = useState(false);
  const [showGameHub, setShowGameHub] = useState(false);
  const [showSweatDetection, setShowSweatDetection] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Disable body scroll when modals are open
  useEffect(() => {
    if (showGameHub || showSweatDetection || showDashboard) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showGameHub, showSweatDetection, showDashboard]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserDropdown && !event.target.closest('.user-dropdown-container')) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserDropdown]);

  // PAGE ANIMATION
  useEffect(() => {
    const timer = setTimeout(() => {
      // Component loaded animation can be added here if needed
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">CareDetect</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-pink-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-pink-600 transition-colors">How It Works</a>
              <a href="#about" className="text-gray-600 hover:text-pink-600 transition-colors">About</a>
              <a href="#contact" className="text-gray-600 hover:text-pink-600 transition-colors">Contact</a>
              <button 
                onClick={() => setShowGameHub(true)}
                className="text-gray-600 hover:text-pink-600 transition-colors"
              >
                🎮 Games
              </button>
              <button 
                onClick={() => setShowBreastModel(true)}
                className="text-gray-600 hover:text-pink-600 transition-colors"
              >
                3D Model
              </button>
              <button 
                onClick={() => setShowRiskModal(true)}
                className="text-gray-600 hover:text-pink-600 transition-colors"
              >
                Risk Assessment
              </button>
              <button 
                onClick={() => setShowGeneticRiskForm(true)}
                className="text-gray-600 hover:text-pink-600 transition-colors"
              >
                Genetic Risk
              </button>
            </nav>
            
            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3 relative">
                  <div className="relative user-dropdown-container">
                    <button 
                      onClick={() => setShowUserDropdown(!showUserDropdown)}
                      className="flex items-center space-x-2 bg-pink-50 px-3 py-1.5 rounded-full border border-pink-200 hover:bg-pink-100 transition-colors cursor-pointer"
                      title="User Menu"
                    >
                      <User className="w-4 h-4 text-pink-600" />
                      <span className="text-sm font-medium text-pink-700">
                        {user?.name?.split(' ')[0] || 'User'}
                      </span>
                      <svg 
                        className={`w-4 h-4 text-pink-600 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* User Dropdown Menu */}
                    {showUserDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-pink-100 py-2 z-50">
                        <button
                          onClick={() => {
                            setShowDashboard(true);
                            setShowUserDropdown(false);
                          }}
                          className="w-full flex items-center px-4 py-2 text-left text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                          </svg>
                          Dashboard
                        </button>
                        
                        <button
                          onClick={() => {
                            setShowUserDropdown(false);
                            // Add settings functionality here
                            alert('Settings feature coming soon!');
                          }}
                          className="w-full flex items-center px-4 py-2 text-left text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Settings
                        </button>
                        
                        <div className="border-t border-gray-100 my-1"></div>
                        
                        <button
                          onClick={() => {
                            handleLogout();
                            setShowUserDropdown(false);
                          }}
                          className="w-full flex items-center px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => setAuthModal('login')}
                    className="text-gray-600 hover:text-pink-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => setAuthModal('signup')}
                    className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section relative bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 font-lexend tracking-tight">
                Early Detection
                <span className="block bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Saves Lives</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-lg">
                Revolutionary AI-powered breast cancer detection technology that empowers women with accurate, accessible screening solutions for better health outcomes.
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button className="bg-pink-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center">
                  Start Screening
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
                <button className="bg-white text-pink-600 px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-pink-200 flex items-center justify-center">
                  <Play className="mr-2 w-5 h-5" />
                  Watch Demo
                </button>
                <button 
                  onClick={() => setShowSweatDetection(true)}
                  className="bg-pink-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Detecting by Sweat
                </button>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  FDA Approved
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  92.8% Accuracy
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Instant Results
                </div>
              </div>
            </div>
            
            {/* Right Content - Video */}
            <div className="relative">
              <div className="bg-white/80 rounded-3xl shadow-2xl p-8 backdrop-blur-2xl border border-pink-100">
                <div className="relative bg-black rounded-2xl overflow-hidden shadow-lg" style={{ aspectRatio: '16/9' }}>
                  <video 
                    className="w-full h-full object-contain"
                    controls
                    preload="metadata"
                    poster="/video-poster.jpg"
                    onError={(e) => {
                      // If video fails to load, show placeholder
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  >
                    <source src="/video.mp4" type="video/mp4" />
                    <source src="./video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  {/* CareDetect Branded Video Placeholder */}
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 via-gray-900 to-black flex flex-col items-center justify-center text-white relative">
                    {/* CareDetect Logo */}
                    <div className="text-center mb-8">
                      <h1 className="text-6xl font-bold mb-2">
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                          Care
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                          Detect
                        </span>
                      </h1>
                      <p className="text-lg text-gray-300 mt-4">AI-Powered Breast Cancer Detection</p>
                    </div>
                    
                    {/* Video Controls */}
                    <div className="absolute bottom-4 left-4 right-4 bg-black/50 rounded-lg p-3">
                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center space-x-4">
                          <button className="text-white hover:text-blue-400 transition-colors">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </button>
                          <span className="text-sm font-mono">0:08 / 0:26</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button className="text-white hover:text-blue-400 transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                            </svg>
                          </button>
                          <button className="text-white hover:text-blue-400 transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                            </svg>
                          </button>
                          <button className="text-white hover:text-blue-400 transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mt-3">
                        <div className="w-full bg-gray-600 rounded-full h-1">
                          <div className="bg-blue-500 h-1 rounded-full" style={{ width: '31%' }}></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute top-8 left-8 w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                    <div className="absolute top-16 right-12 w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <div className="absolute bottom-20 left-16 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute bottom-32 right-8 w-1 h-1 bg-pink-300 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Features Section */}
      <section className="project-features py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Project Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore the core features of our breast cancer detection platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* AI-powered Screening */}
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 border border-pink-100 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI-powered Screening</h3>
              <p className="text-gray-600 text-sm">
                Upload or capture images for instant, accurate breast cancer risk analysis using advanced AI algorithms.
              </p>
            </div>

            {/* Sweat Biomarker Detection */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Sweat Biomarker Detection</h3>
              <p className="text-gray-600 text-sm">
                Non-invasive detection using sweat test strips and smartphone camera for early risk assessment.
              </p>
            </div>

            {/* 3D Breast Model */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3D Breast Model</h3>
              <p className="text-gray-600 text-sm">
                Interactive 3D model for education, symptom awareness, and region-specific information.
              </p>
            </div>

            {/* Genetic Risk Calculator */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Genetic Risk Calculator</h3>
              <p className="text-gray-600 text-sm">
                Personalized risk score based on family history, genetics, and lifestyle factors.
              </p>
            </div>
          </div>

          {/* Interactive Games Section - Separate Row */}
          <div className="games-section mt-8">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-100 hover:shadow-lg transition-all duration-300 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">Interactive Health Games 🎮</h3>
                <p className="text-gray-600 mb-4">
                  Learn through fun, engaging games: Spot the Sign detective challenge, Myth vs Fact rapid-fire quiz, and earn badges while becoming a breast health expert!
                </p>
                <button 
                  onClick={() => setShowGameHub(true)}
                  className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  🚀 Play Games Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How CareDetect Works Section */}
      <section className="how-it-works py-20 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-8">
              How CareDetect Works
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Doctor Model */}
            <div className="relative">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-pink-100">
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4">
                    <DoctorModel3D />
                  </div>
                  <h3 className="doctor-model text-2xl font-bold text-pink-600 mb-2">Meet Dr. CareDetect</h3>
                  <p className="text-gray-600 text-sm">
                    Your friendly AI health assistant here to guide you through every step of your breast cancer screening journey.
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Steps */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Start Screening</h4>
                  <p className="text-gray-600">
                    Click on <strong>Start Screening</strong> and answer a few simple questions to begin your health checkup journey.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Upload or Capture Image</h4>
                  <p className="text-gray-600">
                    Upload your medical image or capture a new one using your phone or computer.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">AI Analysis</h4>
                  <p className="text-gray-600">
                    Our advanced AI instantly analyzes your image and provides accurate results with easy-to-understand feedback.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  4
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Get Personalized Report</h4>
                  <p className="text-gray-600">
                    Download or view your personalized report and get recommendations for next steps.
                  </p>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500 italic">
                  * Available in multiple languages soon for everyone!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Risk Assessment Modal */}
      {showRiskModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-2" onClick={() => setShowRiskModal(false)}>
          <div className="bg-white rounded-2xl p-4 w-full max-w-4xl h-[95vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-2 flex-shrink-0">
              <h3 className="text-xl font-bold text-pink-600">Breast Cancer Risk Assessment</h3>
              <button 
                onClick={() => setShowRiskModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <BreastCancerRiskAssessment onBack={() => setShowRiskModal(false)} />
            </div>
          </div>
        </div>
      )}

      {/* 3D Breast Model Modal */}
      {showBreastModel && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-2" onClick={() => setShowBreastModel(false)}>
          <div className="bg-white rounded-2xl p-4 w-full max-w-6xl h-[95vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-2 flex-shrink-0">
              <h3 className="text-xl font-bold text-pink-600">Interactive 3D Breast Model</h3>
              <button 
                onClick={() => setShowBreastModel(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl shadow-inner border border-pink-100 p-1 overflow-hidden">
              <BreastModel />
            </div>
            <div className="mt-2 text-center space-y-1 flex-shrink-0">
              <p className="text-gray-600 text-xs">
                <strong>Instructions:</strong> Click and drag to rotate • Hover over regions for information • Click on regions to explore symptoms
              </p>
              <p className="text-pink-600 text-xs font-semibold">
                ❤️ Click on Nipple/Areola region for detailed discharge and bleeding information
              </p>
              <p className="text-gray-500 text-xs">Educational purposes only - Always consult healthcare professionals for medical advice</p>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 
            className="text-4xl lg:text-5xl font-bold mb-6 font-lexend tracking-tight"
          >
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of women who trust CareDetect for their breast cancer screening needs. 
            Early detection saves lives.
          </p>
          <button className="bg-white text-pink-600 px-10 py-4 rounded-full font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            Start Your Free Screening Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold">CareDetect</span>
              </div>
              <p className="text-gray-400">
                Empowering women with advanced breast cancer detection technology for better health outcomes.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-pink-400 transition-colors">Screening</a></li>
                <li><a href="#" className="hover:text-pink-400 transition-colors">AI Analysis</a></li>
                <li><a href="#" className="hover:text-pink-400 transition-colors">Reports</a></li>
                <li><a href="#" className="hover:text-pink-400 transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-pink-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-pink-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-pink-400 transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-pink-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-pink-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-pink-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-pink-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-pink-400 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 CareDetect. All rights reserved. Made with ❤ for women's health.</p>
          </div>
        </div>
      </footer>
      <AuthModal 
        isOpen={authModal !== null}
        onClose={() => setAuthModal(null)}
        onLogin={() => {
          console.log('Login clicked');
          // Handle login logic here
        }}
        onSignUp={() => {
          console.log('Sign up clicked');
          // Handle signup logic here
        }}
      />
      <TermsModal 
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAgree={() => {
          setShowTermsModal(false);
          // Handle terms agreement
        }}
      />
      <GeneticRiskForm open={showGeneticRiskForm} onClose={() => setShowGeneticRiskForm(false)} />
      
      {/* Game Hub */}
      {showGameHub && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto overflow-x-hidden">
          <GameHub onClose={() => setShowGameHub(false)} />
        </div>
      )}
      
      {/* Sweat Biomarker Detection */}
      {showSweatDetection && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto" style={{ height: '100vh' }}>
          <BreastCancerScreening 
            onBack={() => setShowSweatDetection(false)} 
          />
        </div>
      )}
      
      {/* Floating Guide Me Button */}
      <button
        className="guide-me-btn fixed bottom-8 right-8 z-[9999] bg-pink-500 text-white px-4 py-2 rounded-full shadow-lg hover:scale-105 transition"
        onClick={() => setOnboardingStep(0)}
        style={{ display: onboardingStep === null && !showGameHub && !showSweatDetection && !showDashboard ? 'block' : 'none' }}
      >
        Guide Me
      </button>
      
      {/* Dashboard */}
      {showDashboard && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto overflow-x-hidden">
          <Dashboard onClose={() => setShowDashboard(false)} onLogout={handleLogout} user={user} />
        </div>
      )}
      {/* Onboarding Overlay */}
      {onboardingStep !== null && (
        <OnboardingOverlay
          stepIndex={onboardingStep}
          onNext={() => {
            if (onboardingStep < 15) setOnboardingStep(onboardingStep + 1);
            else setOnboardingStep(null);
          }}
          onClose={() => setOnboardingStep(null)}
        />
      )}
    </>
  );
} 