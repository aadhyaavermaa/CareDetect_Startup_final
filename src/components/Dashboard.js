import React, { useState, useEffect } from 'react';
import { 
  User, Activity, FileText, Calendar, ChevronDown, Droplets, ArrowLeft, 
  LogOut, Settings, Heart, Shield, TrendingUp, Clock, Award, 
  BarChart3, Target, Bell, Download, Plus, Eye, AlertTriangle, 
  CheckCircle, XCircle, Flame, Users, MapPin, Phone, Mail, 
  ChevronLeft, ChevronRight, Filter, Search, ExternalLink, MessageSquare
} from 'lucide-react';
import FeedbackForm from './FeedbackForm';

const Dashboard = ({ onClose, onLogout, user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  const [userData, setUserData] = useState({
    name: user?.name || 'User',
    email: user?.email || '',
    age: '',
    dateOfBirth: '',
    phone: '',
    address: '',
    emergencyContact: '',
    lastScreening: null,
    riskAssessment: null,
    testStripResults: null,
    totalScreenings: 0,
    screeningsThisMonth: 0,
    riskLevel: 'Unknown',
    riskScorePercent: null,
    familyHistory: null,
    gameScore: 0,
    lastScreeningType: null,
    lastScreeningDate: null,
    lastScreeningStatus: null,
    allScreenings: [],
    testingStreak: 0,
    longestStreak: 0,
    nextAppointment: null,
    medications: [],
    allergies: [],
    medicalHistory: [],
    lifestyle: {
      smoking: 'Never',
      alcohol: 'Occasionally',
      exercise: 'Regular',
      diet: 'Balanced'
    }
  });

  // Load user data from localStorage on component mount
  useEffect(() => {
    const savedProfileData = localStorage.getItem('userProfileData');
    const savedTestStripResults = localStorage.getItem('testStripResults');
    const savedRiskAssessmentResults = localStorage.getItem('riskAssessmentResults');
    const savedGameStats = localStorage.getItem('gameStats');
    const savedScreeningHistory = localStorage.getItem('screeningHistory');
    
    let allScreenings = [];
    let totalScreenings = 0;
    let screeningsThisMonth = 0;
    let lastScreeningDate = null;
    let lastScreeningType = null;
    let lastScreeningStatus = null;
    
    // Load profile data
    if (savedProfileData) {
      const profileData = JSON.parse(savedProfileData);
      setUserData(prev => ({
        ...prev,
        age: profileData.age || '',
        dateOfBirth: profileData.dateOfBirth || '',
        phone: profileData.phone || '',
        address: profileData.address || '',
        emergencyContact: profileData.emergencyContact || '',
        medications: profileData.medications || [],
        allergies: profileData.allergies || [],
        medicalHistory: profileData.medicalHistory || [],
        lifestyle: { ...prev.lifestyle, ...profileData.lifestyle }
      }));
    }
    
    // Load test strip results
    if (savedTestStripResults) {
      const testData = JSON.parse(savedTestStripResults);
      const screening = {
        id: 'sweat-' + Date.now(),
        type: 'Sweat Biomarker Test',
        date: testData.date || testData.timestamp || new Date().toISOString(),
        status: testData.result === 'positive' ? 'Abnormal' : 'Normal',
        result: testData.result === 'positive' ? 'Requires follow-up' : 'Normal levels detected',
        provider: 'CareDetect AI',
        notes: testData.confidence ? `Confidence: ${testData.confidence}%` : ''
      };
      allScreenings.push(screening);
      totalScreenings += 1;
      
      const testDate = new Date(screening.date);
      const currentMonth = new Date().getMonth();
      if (testDate.getMonth() === currentMonth) {
        screeningsThisMonth += 1;
      }
      lastScreeningDate = screening.date;
      lastScreeningType = screening.type;
      lastScreeningStatus = screening.status;
    }
    
    // Load risk assessment results
    if (savedRiskAssessmentResults) {
      const riskData = JSON.parse(savedRiskAssessmentResults);
      const screening = {
        id: 'risk-' + Date.now(),
        type: 'Risk Assessment',
        date: riskData.date || riskData.timestamp || new Date().toISOString(),
        status: 'Completed',
        result: `Risk Level: ${riskData.riskScore || 'Low'}`,
        provider: 'CareDetect Assessment',
        notes: riskData.familyHistory === 'Yes' ? 'Family history noted' : 'No family history'
      };
      allScreenings.push(screening);
      totalScreenings += 1;
      
      const riskDate = new Date(screening.date);
      const currentMonth = new Date().getMonth();
      if (riskDate.getMonth() === currentMonth) {
        screeningsThisMonth += 1;
      }
      
      // Determine risk level and family history from assessment data
      let riskLevel = 'Low';
      let familyHistory = 'No family history';
      let riskPercent = null;
      
      if (riskData.familyHistory === 'Yes') {
        familyHistory = 'Has family history';
        riskLevel = 'Moderate';
      }
      
      if (riskData.previousDiagnosis === 'Yes') {
        riskLevel = 'High';
      }
      
      // Calculate synthetic risk percentage based on factors
      if (riskData.age && parseInt(riskData.age) > 50) {
        riskPercent = Math.floor(Math.random() * 15) + 10; // 10-25%
      } else {
        riskPercent = Math.floor(Math.random() * 8) + 5; // 5-13%
      }
      
      setUserData(prev => ({
        ...prev,
        riskAssessment: riskData,
        riskLevel: riskLevel,
        riskScorePercent: riskPercent,
        familyHistory: familyHistory
      }));
    }
    
    // Load game statistics
    if (savedGameStats) {
      const gameData = JSON.parse(savedGameStats);
      setUserData(prev => ({
        ...prev,
        gameScore: gameData.totalPoints || 0
      }));
    } else {
      setUserData(prev => ({
        ...prev,
        gameScore: 1250 // Default from GameHub
      }));
    }
    
    // Load additional screening history
    if (savedScreeningHistory) {
      const historyData = JSON.parse(savedScreeningHistory);
      allScreenings = [...allScreenings, ...historyData];
      totalScreenings += historyData.length;
    }
    
    // Sort screenings by date (newest first)
    allScreenings.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Calculate testing streak
    const { currentStreak, longestStreak } = calculateTestingStreak(allScreenings);
    
    setUserData(prev => ({
      ...prev,
      totalScreenings,
      screeningsThisMonth,
      lastScreeningDate,
      lastScreeningType,
      lastScreeningStatus,
      allScreenings,
      testingStreak: currentStreak,
      longestStreak: longestStreak,
      testStripResults: savedTestStripResults ? JSON.parse(savedTestStripResults) : null
    }));
  }, []);

  // Calculate testing streak based on screening history
  const calculateTestingStreak = (screenings) => {
    if (screenings.length === 0) return { currentStreak: 0, longestStreak: 0 };
    
    const sortedDates = screenings.map(s => new Date(s.date)).sort((a, b) => b - a);
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;
    
    // Calculate current streak (consecutive months with tests)
    const today = new Date();
    const lastTestMonth = sortedDates[0].getMonth();
    const currentMonth = today.getMonth();
    
    if (lastTestMonth === currentMonth || lastTestMonth === currentMonth - 1) {
      currentStreak = 1;
      
      for (let i = 1; i < sortedDates.length; i++) {
        const prevMonth = sortedDates[i-1].getMonth();
        const currMonth = sortedDates[i].getMonth();
        
        if (prevMonth - currMonth === 1 || (prevMonth === 0 && currMonth === 11)) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
    
    // Calculate longest streak
    for (let i = 1; i < sortedDates.length; i++) {
      const prevMonth = sortedDates[i-1].getMonth();
      const currMonth = sortedDates[i].getMonth();
      
      if (prevMonth - currMonth === 1 || (prevMonth === 0 && currMonth === 11)) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak, currentStreak);
    
    return { currentStreak, longestStreak };
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'No previous screenings';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric',
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate next recommended action
  const getNextRecommendation = () => {
    if (userData.totalScreenings === 0) {
      return {
        title: 'Complete your first screening',
        action: 'Start Assessment'
      };
    }
    
    if (userData.lastScreeningDate) {
      const lastDate = new Date(userData.lastScreeningDate);
      const monthsAgo = (new Date() - lastDate) / (1000 * 60 * 60 * 24 * 30);
      
      if (monthsAgo > 12) {
        return {
          title: 'Due for repeat screening',
          action: 'Schedule Test'
        };
      }
    }
    
    return {
      title: 'You\'re up to date',
      action: 'View Recommendations'
    };
  };

  // Get awareness level badge
  const getAwarenessLevel = (score) => {
    if (score >= 1000) return { level: 'Health Hero', color: 'text-green-600' };
    if (score >= 500) return { level: 'On your way', color: 'text-yellow-600' };
    return { level: 'Start learning', color: 'text-gray-600' };
  };

  // Generate calendar for streak tracking
  const generateCalendar = (month) => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const calendar = [];
    const screeningDates = userData.allScreenings.map(s => 
      new Date(s.date).toDateString()
    );
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendar.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, monthIndex, day);
      const hasScreening = screeningDates.includes(date.toDateString());
      calendar.push({
        day,
        date,
        hasScreening,
        isToday: date.toDateString() === new Date().toDateString()
      });
    }
    
    return calendar;
  };

  // Filter screenings based on search and filter
  const filteredScreenings = userData.allScreenings.filter(screening => {
    const matchesSearch = screening.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         screening.result.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'normal' && screening.status === 'Normal') ||
                         (filterType === 'abnormal' && screening.status === 'Abnormal') ||
                         (filterType === 'pending' && screening.status === 'Pending');
    return matchesSearch && matchesFilter;
  });

  const handleLogout = () => {
    onLogout();
    onClose();
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'screenings', label: 'Screenings', icon: Activity },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left - Logo & Back */}
            <div className="flex items-center space-x-4">
              <button
                onClick={onClose}
                className="flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </button>
              <a href="/" className="flex items-center gap-2 group">
                <img src="/logo192.png" alt="CareDetect" className="h-9 w-9 object-contain flex-shrink-0 transition-transform group-hover:scale-110" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900 group-hover:text-pink-600 transition-colors">CareDetect</h1>
                  <p className="text-xs text-gray-600">Patient Portal</p>
                </div>
              </a>
            </div>

            {/* Right - User Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-3 text-gray-700 hover:text-pink-600 transition-colors p-3 rounded-lg hover:bg-gray-50"
              >
                <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">{userData.name}</div>
                  <div className="text-xs text-gray-500">Patient ID: {user?.id || 'P001'}</div>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                  <div className="p-6 bg-pink-600 text-white">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl">{userData.name}</h3>
                        <p className="text-sm opacity-90">{userData.email}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Shield className="w-4 h-4" />
                          <span className="text-xs">Verified Patient</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Age:</span>
                        <div className="font-semibold">{userData.age || 'Not set'}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Risk Level:</span>
                        <div className={`font-semibold ${
                          userData.riskLevel === 'High' ? 'text-red-600' :
                          userData.riskLevel === 'Moderate' ? 'text-yellow-600' : 'text-green-600'
                        }`}>{userData.riskLevel}</div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-3 space-y-2">
                      <button className="w-full flex items-center space-x-3 text-left text-gray-700 hover:text-pink-600 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <Settings className="w-4 h-4" />
                        <span>Account Settings</span>
                      </button>
                      <button className="w-full flex items-center space-x-3 text-left text-gray-700 hover:text-pink-600 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <Bell className="w-4 h-4" />
                        <span>Notifications</span>
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 text-left text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-pink-500 text-pink-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Welcome back, {userData.name.split(' ')[0]}</h2>
                  <p className="text-gray-600 mt-1">Your comprehensive health dashboard</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Last visit</div>
                  <div className="font-semibold text-gray-900">
                    {userData.lastScreeningDate ? formatDate(userData.lastScreeningDate) : 'No previous visits'}
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Screenings */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Screenings</p>
                    <p className="text-3xl font-bold text-gray-900">{userData.totalScreenings}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      +{userData.screeningsThisMonth} this month
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-pink-600" />
                  </div>
                </div>
              </div>

              {/* Risk Level */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Current Risk Level</p>
                    <p className={`text-2xl font-bold ${
                      userData.riskLevel === 'High' ? 'text-red-600' :
                      userData.riskLevel === 'Moderate' ? 'text-yellow-600' : 'text-green-600'
                    }`}>{userData.riskLevel}</p>
                    {userData.riskScorePercent && (
                      <p className="text-sm text-gray-500 mt-1">
                        {userData.riskScorePercent}% lifetime risk
                      </p>
                    )}
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Testing Streak */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Testing Streak</p>
                    <p className="text-3xl font-bold text-orange-600">{userData.testingStreak}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Best: {userData.longestStreak} months
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Flame className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>

              {/* Awareness Score */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Education Score</p>
                    <p className="text-3xl font-bold text-purple-600">{userData.gameScore}</p>
                    <p className={`text-sm mt-1 ${getAwarenessLevel(userData.gameScore).color}`}>
                      {getAwarenessLevel(userData.gameScore).level}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity & Next Steps */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Screenings */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Screenings</h3>
                </div>
                <div className="p-6">
                  {userData.allScreenings.length > 0 ? (
                    <div className="space-y-4">
                      {userData.allScreenings.slice(0, 3).map((screening, index) => (
                        <div key={screening.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              screening.type.includes('Sweat') ? 'bg-pink-100' : 'bg-purple-100'
                            }`}>
                              {screening.type.includes('Sweat') ? 
                                <Droplets className={`w-5 h-5 ${screening.type.includes('Sweat') ? 'text-pink-600' : 'text-purple-600'}`} /> :
                                <BarChart3 className="w-5 h-5 text-purple-600" />
                              }
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{screening.type}</h4>
                              <p className="text-sm text-gray-600">{screening.result}</p>
                              <p className="text-xs text-gray-500">{formatDate(screening.date)}</p>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            screening.status === 'Normal' ? 'bg-green-100 text-green-700' :
                            screening.status === 'Abnormal' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {screening.status}
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={() => setActiveTab('screenings')}
                        className="w-full text-center text-pink-600 hover:text-pink-700 font-medium py-2"
                      >
                        View All Screenings
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No screenings yet</h4>
                      <p className="text-gray-600 mb-4">Start your health journey with your first screening</p>
                      <button className="bg-pink-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-pink-700 transition-colors">
                        Start First Screening
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions & Health Tips */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full bg-pink-600 text-white p-3 rounded-lg font-medium hover:bg-pink-700 transition-colors flex items-center justify-center space-x-2">
                      <Droplets className="w-5 h-5" />
                      <span>New Biomarker Test</span>
                    </button>
                    <button className="w-full bg-purple-600 text-white p-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
                      <BarChart3 className="w-5 h-5" />
                      <span>Risk Assessment</span>
                    </button>
                    <button className="w-full bg-green-600 text-white p-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                      <Calendar className="w-5 h-5" />
                      <span>Schedule Appointment</span>
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-4 text-center">
                    These tools are for screening purposes only. Consult your doctor for medical advice.
                  </p>
                </div>

                {/* Health Tips */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Education</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-pink-50 rounded-lg border-l-4 border-pink-500">
                      <p className="font-medium text-pink-900 text-sm">Monthly Self-Exam</p>
                      <p className="text-pink-800 text-xs mt-1">Perform breast self-examination 7-10 days after your period</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                      <p className="font-medium text-red-900 text-sm">Warning Signs</p>
                      <p className="text-red-800 text-xs mt-1">New lumps, nipple discharge, or skin changes need immediate attention</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                      <p className="font-medium text-green-900 text-sm">Prevention</p>
                      <p className="text-green-800 text-xs mt-1">Regular exercise and healthy diet reduce cancer risk</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'screenings' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search screenings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
                <div className="relative">
                  <Filter className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 appearance-none bg-white"
                  >
                    <option value="all">All Results</option>
                    <option value="normal">Normal</option>
                    <option value="abnormal">Abnormal</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Screenings List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">All Screenings ({filteredScreenings.length})</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {filteredScreenings.length > 0 ? (
                  filteredScreenings.map((screening) => (
                    <div key={screening.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            screening.type.includes('Sweat') ? 'bg-pink-100' : 'bg-purple-100'
                          }`}>
                            {screening.type.includes('Sweat') ? 
                              <Droplets className="w-6 h-6 text-pink-600" /> :
                              <BarChart3 className="w-6 h-6 text-purple-600" />
                            }
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{screening.type}</h4>
                            <p className="text-gray-600">{screening.result}</p>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                              <span>{formatDate(screening.date)}</span>
                              <span>•</span>
                              <span>{screening.provider}</span>
                            </div>
                            {screening.notes && (
                              <p className="text-xs text-gray-500 mt-1">{screening.notes}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            screening.status === 'Normal' ? 'bg-green-100 text-green-700' :
                            screening.status === 'Abnormal' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {screening.status}
                          </div>
                          <button className="p-2 text-gray-400 hover:text-pink-600 transition-colors">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No screenings found</h4>
                    <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <FeedbackForm />
        )}

        {activeTab === 'calendar' && (
          <div className="space-y-6">
            {/* Calendar Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-gray-900">Testing Calendar</h3>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1))}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                  <span className="font-semibold text-gray-900 min-w-24 text-center text-xs">
                    {selectedMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                  <button
                    onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1))}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-0.5 bg-gray-100 p-1.5 rounded">
                {/* Day Headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-1 text-center text-xs font-bold text-gray-500 bg-white">
                    {day.slice(0, 1)}
                  </div>
                ))}
                
                {/* Calendar Days */}
                {generateCalendar(selectedMonth).map((day, index) => (
                  <div key={index} className="aspect-square">
                    {day ? (
                      <div className={`w-full h-full flex flex-col items-center justify-center text-xs relative rounded overflow-hidden transition-all ${
                        day.isToday ? 'bg-gradient-to-br from-pink-500 to-pink-600 text-white font-bold' :
                        day.hasScreening ? 'bg-gradient-to-br from-pink-100 to-pink-50 text-pink-900 font-semibold' :
                        'bg-white text-gray-600 hover:bg-gray-50'
                      }`}>
                        <span className="leading-tight">{day.day}</span>
                        {day.hasScreening && (
                          <div className="flex flex-col items-center gap-0.5 mt-0.5">
                            <Flame className="w-2.5 h-2.5 text-orange-500 flex-shrink-0" />
                            <img 
                              src="/logo192.png" 
                              alt="CareDetect" 
                              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gray-50"></div>
                    )}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center space-x-4 mt-3 pt-3 border-t border-gray-200 text-xs">
                <div className="flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 bg-gradient-to-br from-pink-500 to-pink-600 rounded"></div>
                  <span className="text-gray-600">Today</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 bg-pink-200 border border-pink-300 rounded"></div>
                  <span className="text-gray-600">Testing Day</span>
                </div>
              </div>
            </div>

            {/* Streak Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Flame className="w-6 h-6 text-orange-600" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900">{userData.testingStreak}</h4>
                <p className="text-gray-600">Current Streak</p>
                <p className="text-xs text-gray-500 mt-1">Consecutive months</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-yellow-600" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900">{userData.longestStreak}</h4>
                <p className="text-gray-600">Best Streak</p>
                <p className="text-xs text-gray-500 mt-1">Personal record</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-pink-600" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900">{userData.totalScreenings}</h4>
                <p className="text-gray-600">Total Tests</p>
                <p className="text-xs text-gray-500 mt-1">All time</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={userData.name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={userData.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input
                    type="text"
                    value={userData.age || 'Not specified'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="text"
                    value={userData.phone || 'Not specified'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Medical Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Medical Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Risk Factors</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Risk Level:</span>
                      <span className={`font-medium ${
                        userData.riskLevel === 'High' ? 'text-red-600' :
                        userData.riskLevel === 'Moderate' ? 'text-yellow-600' : 'text-green-600'
                      }`}>{userData.riskLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Family History:</span>
                      <span className="font-medium text-gray-900">{userData.familyHistory || 'Not assessed'}</span>
                    </div>
                    {userData.riskScorePercent && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lifetime Risk:</span>
                        <span className="font-medium text-gray-900">{userData.riskScorePercent}%</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Screening History</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Screenings:</span>
                      <span className="font-medium text-gray-900">{userData.totalScreenings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Screening:</span>
                      <span className="font-medium text-gray-900">
                        {userData.lastScreeningDate ? formatDate(userData.lastScreeningDate) : 'None'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Testing Streak:</span>
                      <span className="font-medium text-gray-900">{userData.testingStreak} months</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lifestyle Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Lifestyle Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Smoking Status</label>
                    <input
                      type="text"
                      value={userData.lifestyle.smoking}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Alcohol Consumption</label>
                    <input
                      type="text"
                      value={userData.lifestyle.alcohol}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      readOnly
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Exercise Frequency</label>
                    <input
                      type="text"
                      value={userData.lifestyle.exercise}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Diet Type</label>
                    <input
                      type="text"
                      value={userData.lifestyle.diet}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Medical Disclaimer */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-semibold mb-1">Medical Disclaimer</p>
              <p>
                This dashboard provides educational information only and does not give medical diagnosis or treatment. 
                For concerns, please consult a doctor.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;