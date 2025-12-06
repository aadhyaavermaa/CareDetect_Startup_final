import React, { useState, useEffect } from 'react';
import { User, Activity, FileText, Calendar, ChevronDown, Droplets, ArrowLeft } from 'lucide-react';

const Dashboard = () => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    age: '',
    lastScreening: null,
    riskAssessment: null,
    testStripResults: null
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
        name: profileData.name || 'Guest User',
        email: profileData.email || '',
        age: profileData.age || '',
        lastScreening: profileData.lastScreening || prev.lastScreening
      }));
    }
    
    if (savedTestStripResults) {
      setUserData(prev => ({
        ...prev,
        testStripResults: JSON.parse(savedTestStripResults)
      }));
    }
    
    if (savedRiskAssessmentResults) {
      setUserData(prev => ({
        ...prev,
        riskAssessment: JSON.parse(savedRiskAssessmentResults)
      }));
    }
  }, []);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (userData.name || userData.email) {
      localStorage.setItem('userProfileData', JSON.stringify(userData));
    }
  }, [userData]);

  // Function to update user profile information
  const updateProfile = (formData) => {
    setUserData(prev => ({
      ...prev,
      name: formData.name || prev.name,
      email: formData.email || prev.email,
      age: formData.age || prev.age,
      lastScreening: new Date().toISOString()
    }));
  };

  // Function to save screening results
  const saveScreeningResults = (type, results) => {
    setUserData(prev => ({
      ...prev,
      lastScreening: new Date().toISOString(),
      [type === 'testStrip' ? 'testStripResults' : 'riskAssessment']: {
        ...results,
        date: new Date().toISOString()
      }
    }));
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CareDetect</h1>
                <p className="text-xs text-gray-600">Health Dashboard</p>
              </div>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-3 text-gray-700 hover:text-pink-600 transition-colors p-2 rounded-lg hover:bg-pink-50"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium">
                  {userData.name || 'Guest User'}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-pink-100 overflow-hidden">
                  <div className="p-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {userData.name || 'Guest User'}
                        </h3>
                        <p className="text-sm opacity-90">
                          {userData.email || 'No email set'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Age:</span>
                      <span className="font-medium">{userData.age || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Last Screening:</span>
                      <span className="font-medium">{formatDate(userData.lastScreening)}</span>
                    </div>
                    <div className="border-t pt-3">
                      <button className="w-full text-left text-sm text-pink-600 hover:text-pink-700 font-medium">
                        Edit Profile
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Dashboard Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Health Dashboard</h2>
          <p className="text-gray-600">Track your screening history and health insights</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-pink-100">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 text-blue-500" />
              <span className="text-sm text-gray-500">Total Screenings</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">
              {(userData.testStripResults ? 1 : 0) + (userData.riskAssessment ? 1 : 0)}
            </h3>
            <p className="text-sm text-gray-600 mt-1">Completed tests</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-pink-100">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 text-green-500" />
              <span className="text-sm text-gray-500">Last Test</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              {userData.lastScreening ? 
                new Date(userData.lastScreening).toLocaleDateString() : 
                'No tests yet'
              }
            </h3>
            <p className="text-sm text-gray-600 mt-1">Most recent screening</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-pink-100">
            <div className="flex items-center justify-between mb-4">
              <FileText className="w-8 h-8 text-purple-500" />
              <span className="text-sm text-gray-500">Risk Level</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">
              {userData.riskAssessment ? 'Low' : 'Unknown'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">Based on assessment</p>
          </div>
        </div>

        {/* Recent Screenings */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-pink-100">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800">Recent Screenings</h3>
          </div>
          
          <div className="p-6 space-y-4">
            {/* Test Strip Results */}
            {userData.testStripResults ? (
              <div className="border-l-4 border-blue-500 pl-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-800">Test Strip Analysis</h4>
                    <p className="text-sm text-gray-600">
                      Result: {userData.testStripResults.result || 'Completed'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(userData.testStripResults.date)}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    userData.testStripResults.result === 'positive' 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {userData.testStripResults.result === 'positive' ? 'Abnormal' : 'Normal'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No test strip screenings completed yet</p>
              </div>
            )}

            {/* Risk Assessment Results */}
            {userData.riskAssessment ? (
              <div className="border-l-4 border-purple-500 pl-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-800">Risk Assessment Questionnaire</h4>
                    <p className="text-sm text-gray-600">
                      Risk Score: {userData.riskAssessment.riskScore || 'Calculated'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(userData.riskAssessment.date)}
                    </p>
                  </div>
                  <div className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                    Completed
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No risk assessments completed yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            New Test Strip Screening
          </button>
          <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            Risk Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
