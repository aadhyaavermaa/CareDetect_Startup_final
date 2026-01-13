import React, { useState, useEffect } from 'react';
import { 
  User, Activity, FileText, Calendar, ChevronDown, Droplets, ArrowLeft, 
  LogOut, Settings, Heart, Shield, TrendingUp, Clock, Award, 
  BarChart3, Target, Zap, Bell, Download, Plus, Eye
} from 'lucide-react';

const Dashboard = ({ onClose, onLogout, user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [userData, setUserData] = useState({
    name: user?.name || 'User',
    email: user?.email || '',
    age: '',
    lastScreening: null,
    riskAssessment: null,
    testStripResults: null,
    totalScreenings: 0,
    riskLevel: 'Unknown'
  });

  // Load user data from localStorage on component mount
  useEffect(() => {
    const savedProfileData = localStorage.getItem('userProfileData');
    const savedTestStripResults = localStorage.getItem('testStripResults');
    const savedRiskAssessmentResults = localStorage.getItem('riskAssessmentResults');
    
    if (savedProfileData) {
      const profileData = JSON.parse(savedProfileData);
      setUserData(prev => ({
        ...prev,
        age: profileData.age || '',
        lastScreening: profileData.lastScreening || prev.lastScreening
      }));
    }
    
    if (savedTestStripResults) {
      setUserData(prev => ({
        ...prev,
        testStripResults: JSON.parse(savedTestStripResults),
        totalScreenings: prev.totalScreenings + 1
      }));
    }
    
    if (savedRiskAssessmentResults) {
      const riskData = JSON.parse(savedRiskAssessmentResults);
      setUserData(prev => ({
        ...prev,
        riskAssessment: riskData,
        riskLevel: riskData.riskScore || 'Low',
        totalScreenings: prev.totalScreenings + 1
      }));
    }
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'No previous screenings';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLogout = () => {
    onLogout();
    onClose();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-pink-100 sticky top-0 z-50">
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
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">CareDetect</h1>
                  <p className="text-xs text-gray-600">Health Dashboard</p>
                </div>
              </div>
            </div>

            {/* Right - User Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-3 text-gray-700 hover:text-pink-600 transition-colors p-3 rounded-xl hover:bg-pink-50"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">{userData.name}</div>
                  <div className="text-xs text-gray-500">Premium Member</div>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-pink-100 overflow-hidden z-50">
                  <div className="p-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl">{userData.name}</h3>
                        <p className="text-sm opacity-90">{userData.email}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Award className="w-4 h-4" />
                          <span className="text-xs">Premium Member</span>
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
                        <div className="font-semibold text-green-600">{userData.riskLevel}</div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-3 space-y-2">
                      <button className="w-full flex items-center space-x-3 text-left text-gray-700 hover:text-pink-600 p-2 rounded-lg hover:bg-pink-50 transition-colors">
                        <Settings className="w-4 h-4" />
                        <span>Account Settings</span>
                      </button>
                      <button className="w-full flex items-center space-x-3 text-left text-gray-700 hover:text-pink-600 p-2 rounded-lg hover:bg-pink-50 transition-colors">
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {userData.name.split(' ')[0]}! 👋
          </h2>
          <p className="text-xl text-gray-600">Here's your health overview and recent activity</p>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Screenings */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{userData.totalScreenings}</h3>
            <p className="text-sm text-gray-600">Total Screenings</p>
            <div className="mt-2 text-xs text-green-600 font-medium">+2 this month</div>
          </div>

          {/* Risk Level */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <Target className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{userData.riskLevel}</h3>
            <p className="text-sm text-gray-600">Risk Level</p>
            <div className="mt-2 text-xs text-green-600 font-medium">Excellent status</div>
          </div>

          {/* Last Screening */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <Clock className="w-5 h-5 text-purple-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {userData.lastScreening ? 
                new Date(userData.lastScreening).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 
                'No tests'
              }
            </h3>
            <p className="text-sm text-gray-600">Last Screening</p>
            <div className="mt-2 text-xs text-purple-600 font-medium">
              {userData.lastScreening ? 'Recent' : 'Schedule now'}
            </div>
          </div>

          {/* Health Score */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <BarChart3 className="w-5 h-5 text-pink-500" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">92</h3>
            <p className="text-sm text-gray-600">Health Score</p>
            <div className="mt-2 text-xs text-pink-600 font-medium">Excellent</div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-pink-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <FileText className="w-6 h-6 mr-3 text-pink-600" />
                  Recent Screenings
                </h3>
              </div>
              
              <div className="p-6">
                {userData.testStripResults || userData.riskAssessment ? (
                  <div className="space-y-4">
                    {/* Test Strip Results */}
                    {userData.testStripResults && (
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-l-4 border-blue-500">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                            <Droplets className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">Sweat Biomarker Test</h4>
                            <p className="text-sm text-gray-600">
                              Result: {userData.testStripResults.result === 'positive' ? 'Requires Follow-up' : 'Normal'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(userData.testStripResults.date)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                            userData.testStripResults.result === 'positive' 
                              ? 'bg-yellow-100 text-yellow-700' 
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {userData.testStripResults.result === 'positive' ? 'Follow-up' : 'Normal'}
                          </div>
                          <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Risk Assessment */}
                    {userData.riskAssessment && (
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border-l-4 border-purple-500">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                            <BarChart3 className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">Risk Assessment</h4>
                            <p className="text-sm text-gray-600">
                              Risk Level: {userData.riskAssessment.riskScore || 'Low'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(userData.riskAssessment.date)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                            Completed
                          </div>
                          <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-10 h-10 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No screenings yet</h4>
                    <p className="text-gray-600 mb-6">Start your health journey with your first screening</p>
                    <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                      Start First Screening
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* New Screening */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-pink-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Plus className="w-5 h-5 mr-2 text-pink-600" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2">
                  <Droplets className="w-5 h-5" />
                  <span>New Sweat Test</span>
                </button>
                <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Risk Assessment</span>
                </button>
                <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Schedule Checkup</span>
                </button>
              </div>
            </div>

            {/* Health Tips */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-pink-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">💡 Health Tips</h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-pink-50 rounded-lg border-l-4 border-pink-500">
                  <p className="font-semibold text-pink-700">Monthly Self-Exam</p>
                  <p className="text-gray-600">Perform monthly breast self-examinations</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <p className="font-semibold text-blue-700">Stay Active</p>
                  <p className="text-gray-600">Regular exercise reduces cancer risk</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <p className="font-semibold text-green-700">Healthy Diet</p>
                  <p className="text-gray-600">Maintain a balanced, nutritious diet</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;