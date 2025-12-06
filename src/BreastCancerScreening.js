import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplets, ArrowLeft, AlertTriangle, CheckCircle, Smartphone, Brain, Shield, Camera, Info, AlertCircle, Upload, ChevronDown, User } from 'lucide-react';

const BreastCancerScreening = ({ onBack }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [confidence, setConfidence] = useState(null); // Added confidence state
  const [formData, setFormData] = useState({
    age: '',
    ageAtFirstPeriod: '',
    ageAtFirstChild: '',
    ageAtMenopause: '',
    birthControl: 'No',
    hrt: 'No',
    familyHistory: 'No',
    previousDiagnosis: 'No',
    breastDensity: 'Not sure',
    biopsy: 'No',
    race: 'Asian',
    height: '',
    weight: '',
    alcohol: 'Never',
    physicalActivity: 'Rarely',
    breastfeeding: 'No',
    periods: '12-13',
    periodCycle: 'Regular',
    periodPain: 'No',
    pcos: 'No',
    diabetes: 'No',
    thyroid: 'No'
  });
  
  const [formStep, setFormStep] = useState(1);
  const totalFormSteps = 5;

  const fileInputRef = useRef(null);

  const resetTest = () => {
    setSelectedImage(null);
    setIsAnalyzing(false);
    setResult(null);
    setConfidence(null);
    setCurrentStep(1);
  };

  const resetTestStripOnly = () => {
    setSelectedImage(null);
    setIsAnalyzing(false);
    setResult(null);
    setConfidence(null);
    setCurrentStep(1);
  };

  const goToRiskAssessment = () => {
    // Reset test strip data when going to risk assessment
    setSelectedImage(null);
    setIsAnalyzing(false);
    setResult(null);
    setConfidence(null);
    setFormStep(1); // Reset form step to 1
    setCurrentStep(5); // Go to risk assessment
  };

  const simulateAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setResult('Your Risk Category: Average/Lower Risk');
      setConfidence('85%');
      setCurrentStep(4);
      
      // Save test strip results to localStorage
      const testStripResults = {
        result: 'negative', // or 'positive' based on analysis
        confidence: '85%',
        date: new Date().toISOString(),
        imageUrl: selectedImage
      };
      localStorage.setItem('testStripResults', JSON.stringify(testStripResults));
    }, 3000);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setSelectedImage(e.target.result);
      reader.readAsDataURL(file);
      setCurrentStep(2);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save user profile data to localStorage
    const userProfileData = {
      name: formData.name || 'User',
      email: formData.email || '',
      age: formData.age,
      lastScreening: new Date().toISOString()
    };
    
    // Save risk assessment results
    const riskAssessmentResults = {
      riskScore: 'Low', // This would be calculated based on form answers
      formData: formData,
      date: new Date().toISOString()
    };
    
    // Update localStorage
    localStorage.setItem('userProfileData', JSON.stringify(userProfileData));
    localStorage.setItem('riskAssessmentResults', JSON.stringify(riskAssessmentResults));
    
    console.log('Form submitted and saved:', formData);
    
    // Show success message or redirect to dashboard
    alert('Risk assessment completed! Your results have been saved to your profile.');
  };

  const nextFormStep = () => {
    if (formStep < totalFormSteps) {
      setFormStep(formStep + 1);
    }
  };

  const prevFormStep = () => {
    if (formStep > 1) {
      setFormStep(formStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 font-lexend">CareDetect</h1>
                <p className="text-xs text-gray-600">Breast Cancer Screening</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back to Home</span>
                </button>
              )}
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
              >
                <User className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 font-lexend tracking-tight">
            Breast Cancer Screening
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Non-invasive detection using sweat biomarkers
          </p>
          <p className="text-sm text-gray-500">
            AI-powered analysis • Privacy-focused • Instant results
          </p>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm text-center border border-pink-100">
            <Droplets className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-800">Sweat Analysis</h3>
            <p className="text-sm text-gray-600">Detects protein biomarkers</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm text-center border border-pink-100">
            <Smartphone className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-800">Smartphone Ready</h3>
            <p className="text-sm text-gray-600">Works offline locally</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm text-center border border-pink-100">
            <Brain className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-800">AI Powered</h3>
            <p className="text-sm text-gray-600">97.8% accuracy rate</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm text-center border border-pink-100">
            <Shield className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-800">Privacy First</h3>
            <p className="text-sm text-gray-600">No data leaves device</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 mb-8 border border-pink-100">
          <div className="flex items-center justify-between mb-6">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step <= currentStep
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">
              {currentStep === 1 && 'Step 1: Upload Test Strip Image'}
              {currentStep === 2 && 'Step 2: Review Image'}
              {currentStep === 3 && 'Step 3: AI Analysis in Progress'}
              {currentStep === 4 && 'Step 4: Results Ready'}
            </h3>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 border border-pink-100">
          {currentStep === 1 && (
            <div className="text-center">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6">
                <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Upload Test Strip Image</h3>
                <p className="text-gray-600 mb-4">
                  Take a photo of your methyl orange test strip after applying finger sweat
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  Choose Image
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Instructions:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Press your finger firmly on the methyl orange test strip</li>
                      <li>Wait 30 seconds for color changes to develop</li>
                      <li>Take a clear photo in good lighting</li>
                      <li>Ensure the entire strip is visible in the image</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && selectedImage && (
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Review Your Image</h3>
              <div className="max-w-md mx-auto mb-6">
                <img
                  src={selectedImage}
                  alt="Test strip"
                  className="w-full h-64 object-cover rounded-lg border"
                />
              </div>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={resetTest}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Retake Photo
                </button>
                <button
                  onClick={simulateAnalysis}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  Analyze Image
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && isAnalyzing && (
            <div className="text-center">
              <div className="animate-spin w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">Analyzing Biomarkers</h3>
              <p className="text-gray-600 mb-4">
                AI is processing protein patterns and VOC signatures...
              </p>
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 border border-gray-200">
                <p>• Analyzing color changes in methyl orange indicators</p>
                <p>• Detecting protein biomarker concentrations</p>
                <p>• Comparing patterns with trained model</p>
              </div>
            </div>
          )}

          {currentStep === 4 && result && (
            <div className="text-center">
              <div className="mb-6">
                {result === 'positive' ? (
                  <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                ) : (
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                )}
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${result === 'positive' ? 'text-red-600' : 'text-green-600'}`}>
                {result === 'positive' ? 'Abnormal Patterns Detected' : 'No Abnormalities Detected'}
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Confidence Score</p>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                  <div
                    className={`h-4 rounded-full ${
                      result === 'positive' ? 'bg-red-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${confidence}%` }}
                  ></div>
                </div>
                <p className="text-lg font-semibold">{confidence.toFixed(1)}%</p>
              </div>
              
              <div className={`rounded-lg p-4 mb-6 ${
                result === 'positive' ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
              }`}>
                <h4 className="font-semibold mb-2">Recommendation:</h4>
                <p className="text-sm">
                  {result === 'positive' 
                    ? 'Please consult with a healthcare provider for further evaluation. This is a screening tool and not a diagnostic test.'
                    : 'Continue regular screening as recommended by your healthcare provider. This test should be repeated monthly for optimal monitoring.'
                  }
                </p>
              </div>
              
              <button
                onClick={resetTestStripOnly}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 mr-4"
              >
                Take Another Test
              </button>
              <button
                onClick={goToRiskAssessment}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Risk Assessment Form
              </button>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="flex justify-center gap-4 mb-4">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    ← Back to Test Strip
                  </button>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Risk Assessment
                </h1>
                <p className="text-gray-600">
                  Answer a few questions to understand your risk factors
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  {[1, 2, 3, 4, 5].map((step) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full ${
                          step <= formStep
                            ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {step}
                      </div>
                      {step < 5 && (
                        <div
                          className={`w-12 h-1 ${
                            step < formStep ? 'bg-gradient-to-r from-pink-500 to-purple-600' : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {formStep === 1 && 'Personal Information'}
                    {formStep === 2 && 'Reproductive History'}
                    {formStep === 3 && 'Hormonal Factors'}
                    {formStep === 4 && 'Family & Medical History'}
                    {formStep === 5 && 'Lifestyle Factors'}
                  </h3>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Step 1: Personal Information */}
                  {formStep === 1 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Age</label>
                        <div className="relative">
                          <select
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md appearance-none pr-8"
                            required
                          >
                            <option value="">Select age</option>
                            {Array.from({length: 50}, (_, i) => 18 + i).map(age => (
                              <option key={age} value={age}>{age} years</option>
                            ))}
                          </select>
                          <ChevronDown className="w-5 h-5 text-gray-400 absolute right-2 top-2.5 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Race/Ethnicity</label>
                        <div className="relative">
                          <select
                            name="race"
                            value={formData.race}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md appearance-none pr-8"
                          >
                            <option value="Asian">Asian</option>
                            <option value="Black">Black</option>
                            <option value="Hispanic">Hispanic</option>
                            <option value="White">White</option>
                            <option value="Other">Other</option>
                          </select>
                          <ChevronDown className="w-5 h-5 text-gray-400 absolute right-2 top-2.5 pointer-events-none" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                          <input
                            type="number"
                            name="height"
                            value={formData.height}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter height"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                          <input
                            type="number"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter weight"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Reproductive History */}
                  {formStep === 2 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Age at first period</label>
                        <div className="relative">
                          <select
                            name="periods"
                            value={formData.periods}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md appearance-none pr-8"
                          >
                            <option value="<12">Under 12</option>
                            <option value="12-13">12-13 years</option>
                            <option value="14">14 years</option>
                            <option value="15">15 years</option>
                            <option value="16+">16+ years</option>
                          </select>
                          <ChevronDown className="w-5 h-5 text-gray-400 absolute right-2 top-2.5 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Menstrual cycle regularity</label>
                        <div className="relative">
                          <select
                            name="periodCycle"
                            value={formData.periodCycle}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md appearance-none pr-8"
                          >
                            <option value="Regular">Regular (21-35 days)</option>
                            <option value="Irregular">Irregular</option>
                            <option value="Not applicable">Not applicable</option>
                          </select>
                          <ChevronDown className="w-5 h-5 text-gray-400 absolute right-2 top-2.5 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Painful periods</label>
                        <div className="relative">
                          <select
                            name="periodPain"
                            value={formData.periodPain}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md appearance-none pr-8"
                          >
                            <option value="No">No</option>
                            <option value="Mild">Mild</option>
                            <option value="Moderate">Moderate</option>
                            <option value="Severe">Severe</option>
                          </select>
                          <ChevronDown className="w-5 h-5 text-gray-400 absolute right-2 top-2.5 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Breastfeeding history</label>
                        <div className="relative">
                          <select
                            name="breastfeeding"
                            value={formData.breastfeeding}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md appearance-none pr-8"
                          >
                            <option value="No">No</option>
                            <option value="<6 months">Less than 6 months</option>
                            <option value="6-12 months">6-12 months</option>
                            <option value="1-2 years">1-2 years</option>
                            <option value="2+ years">2+ years</option>
                          </select>
                          <ChevronDown className="w-5 h-5 text-gray-400 absolute right-2 top-2.5 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Hormonal Factors */}
                  {formStep === 3 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Have you used birth control pills?</label>
                        <div className="mt-1">
                          {['Yes', 'No'].map(option => (
                            <label key={option} className="inline-flex items-center mr-4">
                              <input
                                type="radio"
                                name="birthControl"
                                value={option}
                                checked={formData.birthControl === option}
                                onChange={handleChange}
                                className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                              />
                              <span className="ml-2 text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Have you used hormone replacement therapy (HRT)?</label>
                        <div className="mt-1">
                          {['Yes', 'No'].map(option => (
                            <label key={option} className="inline-flex items-center mr-4">
                              <input
                                type="radio"
                                name="hrt"
                                value={option}
                                checked={formData.hrt === option}
                                onChange={handleChange}
                                className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                              />
                              <span className="ml-2 text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">PCOS diagnosis</label>
                        <div className="mt-1">
                          {['Yes', 'No', 'Not sure'].map(option => (
                            <label key={option} className="inline-flex items-center mr-4">
                              <input
                                type="radio"
                                name="pcos"
                                value={option}
                                checked={formData.pcos === option}
                                onChange={handleChange}
                                className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                              />
                              <span className="ml-2 text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Family & Medical History */}
                  {formStep === 4 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Do you have a family history of breast cancer?</label>
                        <div className="mt-1">
                          {['Yes', 'No', 'Not sure'].map(option => (
                            <label key={option} className="inline-flex items-center mr-4">
                              <input
                                type="radio"
                                name="familyHistory"
                                value={option}
                                checked={formData.familyHistory === option}
                                onChange={handleChange}
                                className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                              />
                              <span className="ml-2 text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Have you been previously diagnosed with breast cancer?</label>
                        <div className="mt-1">
                          {['Yes', 'No'].map(option => (
                            <label key={option} className="inline-flex items-center mr-4">
                              <input
                                type="radio"
                                name="previousDiagnosis"
                                value={option}
                                checked={formData.previousDiagnosis === option}
                                onChange={handleChange}
                                className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                              />
                              <span className="ml-2 text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Breast density</label>
                        <div className="relative">
                          <select
                            name="breastDensity"
                            value={formData.breastDensity}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md appearance-none pr-8"
                          >
                            <option value="Not sure">Not sure</option>
                            <option value="Mostly fatty">Mostly fatty</option>
                            <option value="Scattered density">Scattered density</option>
                            <option value="Consistently dense">Consistently dense</option>
                            <option value="Extremely dense">Extremely dense</option>
                          </select>
                          <ChevronDown className="w-5 h-5 text-gray-400 absolute right-2 top-2.5 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Previous breast biopsy</label>
                        <div className="mt-1">
                          {['Yes', 'No'].map(option => (
                            <label key={option} className="inline-flex items-center mr-4">
                              <input
                                type="radio"
                                name="biopsy"
                                value={option}
                                checked={formData.biopsy === option}
                                onChange={handleChange}
                                className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                              />
                              <span className="ml-2 text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 5: Lifestyle Factors */}
                  {formStep === 5 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Alcohol consumption</label>
                        <div className="relative">
                          <select
                            name="alcohol"
                            value={formData.alcohol}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md appearance-none pr-8"
                          >
                            <option value="Never">Never</option>
                            <option value="Occasionally">Occasionally</option>
                            <option value="1-2 drinks/week">1-2 drinks/week</option>
                            <option value="3-7 drinks/week">3-7 drinks/week</option>
                            <option value="8+ drinks/week">8+ drinks/week</option>
                          </select>
                          <ChevronDown className="w-5 h-5 text-gray-400 absolute right-2 top-2.5 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Physical activity</label>
                        <div className="relative">
                          <select
                            name="physicalActivity"
                            value={formData.physicalActivity}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md appearance-none pr-8"
                          >
                            <option value="Rarely">Rarely</option>
                            <option value="1-2 times/week">1-2 times/week</option>
                            <option value="3-4 times/week">3-4 times/week</option>
                            <option value="5+ times/week">5+ times/week</option>
                          </select>
                          <ChevronDown className="w-5 h-5 text-gray-400 absolute right-2 top-2.5 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Diabetes</label>
                        <div className="mt-1">
                          {['Yes', 'No', 'Pre-diabetes'].map(option => (
                            <label key={option} className="inline-flex items-center mr-4">
                              <input
                                type="radio"
                                name="diabetes"
                                value={option}
                                checked={formData.diabetes === option}
                                onChange={handleChange}
                                className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                              />
                              <span className="ml-2 text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Thyroid condition</label>
                        <div className="mt-1">
                          {['Yes', 'No', 'Not sure'].map(option => (
                            <label key={option} className="inline-flex items-center mr-4">
                              <input
                                type="radio"
                                name="thyroid"
                                value={option}
                                checked={formData.thyroid === option}
                                onChange={handleChange}
                                className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                              />
                              <span className="ml-2 text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-8">
                    <button
                      type="button"
                      onClick={prevFormStep}
                      disabled={formStep === 1}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                        formStep === 1
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-500 text-white hover:bg-gray-600'
                      }`}
                    >
                      Previous
                    </button>

                    {formStep === totalFormSteps ? (
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                      >
                        Analyze Risk
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={nextFormStep}
                        className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                      >
                        Next
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Disclaimer */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold mb-1">Important Disclaimer:</p>
                    <p>
                      This is a screening tool for research purposes and should not replace professional medical advice, 
                      diagnosis, or treatment. Always consult with qualified healthcare providers for medical concerns.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BreastCancerScreening;