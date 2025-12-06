import React, { useState } from 'react';

const RiskAssessment = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
    ageAtFirstPeriod: '',
    hasBeenPregnant: '',
    hasBreastfed: '',
    
    // Step 2
    usesBirthControl: '',
    usesHRT: '',
    
    // Step 3
    hasFamilyHistory: '',
    previousDiagnosis: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Personal & Reproductive History</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Age at first period
              </label>
              <input
                type="number"
                name="ageAtFirstPeriod"
                value={formData.ageAtFirstPeriod}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="hasBeenPregnant"
                  checked={formData.hasBeenPregnant}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Have you ever been pregnant?</span>
              </label>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="hasBreastfed"
                  checked={formData.hasBreastfed}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Have you ever breastfed?</span>
              </label>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Hormonal Factors</h3>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="usesBirthControl"
                  checked={formData.usesBirthControl}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Do you use birth control?</span>
              </label>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="usesHRT"
                  checked={formData.usesHRT}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Are you on Hormone Replacement Therapy (HRT)?</span>
              </label>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Family & Personal History</h3>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="hasFamilyHistory"
                  checked={formData.hasFamilyHistory}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Do you have a family history of breast cancer?</span>
              </label>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="previousDiagnosis"
                  checked={formData.previousDiagnosis}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Have you been previously diagnosed with breast cancer?</span>
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Breast Cancer Risk Assessment</h2>
      
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Step {step} of 3</span>
          <span className="text-sm font-medium">
            {step === 1 ? 'Personal & Reproductive' : step === 2 ? 'Hormonal Factors' : 'Family & Personal History'}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full" 
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Form Steps */}
      <div className="mb-6">
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={step === 1}
          className={`px-4 py-2 rounded-md ${step === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Previous
        </button>
        {step < 3 ? (
          <button
            onClick={nextStep}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Next
          </button>
        ) : (
          <button
            onClick={() => alert('Assessment submitted!')}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Submit Assessment
          </button>
        )}
      </div>
    </div>
  );
};

export default RiskAssessment;
