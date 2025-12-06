import React, { useState } from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';

const BreastCancerRiskAssessment = ({ onBack }) => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 font-sans p-4">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">CB</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Risk Assessment</h1>
                <p className="text-xs text-gray-600">Breast Cancer Risk Evaluation</p>
              </div>
            </div>
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Risk Assessment
          </h1>
          <p className="text-gray-600">
            Answer a few questions to understand your risk factors
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal & Reproductive */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-pink-600">1. Personal & Reproductive</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Age at first period</label>
                <div className="relative">
                  <select
                    name="ageAtFirstPeriod"
                    value={formData.ageAtFirstPeriod}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md appearance-none pr-8"
                    required
                  >
                    <option value="">Select age</option>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Age at first child</label>
                <div className="relative">
                  <select
                    name="ageAtFirstChild"
                    value={formData.ageAtFirstChild}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md appearance-none pr-8"
                  >
                    <option value="">Select age</option>
                    <option value="<20">Under 20</option>
                    <option value="20-29">20-29 years</option>
                    <option value="30-39">30-39 years</option>
                    <option value="40+">40+ years</option>
                    <option value="No children">No children</option>
                  </select>
                  <ChevronDown className="w-5 h-5 text-gray-400 absolute right-2 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age at menopause</label>
                <div className="relative">
                  <select
                    name="ageAtMenopause"
                    value={formData.ageAtMenopause}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md appearance-none pr-8"
                  >
                    <option value="">Select age</option>
                    <option value="<45">Under 45</option>
                    <option value="45-49">45-49 years</option>
                    <option value="50-54">50-54 years</option>
                    <option value="55+">55+ years</option>
                    <option value="Not applicable">Not applicable</option>
                  </select>
                  <ChevronDown className="w-5 h-5 text-gray-400 absolute right-2 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Hormonal Factors */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-pink-600">2. Hormonal Factors</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Have you ever used birth control pills?</label>
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
            </div>
          </div>

          {/* Family & Personal History */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-pink-600">3. Family & Personal History</h2>
            
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
            </div>
          </div>

          {/* Additional Health Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-pink-600">4. Additional Health Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          {/* Lifestyle Factors */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-pink-600">5. Lifestyle Factors</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Analyze Risk
            </button>
          </div>
        </form>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-8">
          <div className="flex items-start gap-3">
            <div className="text-sm text-yellow-800">
              <p className="font-semibold mb-1">Important Disclaimer:</p>
              <p>
                This risk assessment tool is for informational purposes only and is not a substitute for professional medical advice, 
                diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any 
                questions you may have regarding a medical condition.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreastCancerRiskAssessment;
