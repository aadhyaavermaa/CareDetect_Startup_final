import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { getBreastCancerRiskLevel } from '../../utils/breastCancerRiskLevel';

const GeneticRiskForm = ({ open, onClose }) => {
  const [relatives, setRelatives] = useState([
    { relation: 'grandmother', hasBreastCancer: null, ageAtDiagnosis: null, brcaStatus: '' },
    { relation: 'mother', hasBreastCancer: null, ageAtDiagnosis: null, brcaStatus: '' },
    { relation: 'self', hasBreastCancer: null, ageAtDiagnosis: null, brcaStatus: '' }
  ]);

  const [userData, setUserData] = useState({
    smoking: false,
    drinking: false,
    lifestyleUnhealthy: false
  });

  const [riskResult, setRiskResult] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const resultRef = useRef(null);

  // Calculate risk whenever data changes
  useEffect(() => {
    const result = getBreastCancerRiskLevel(userData, relatives);
    setRiskResult(result);
  }, [userData, relatives]);

  // Check if form is valid (all required fields filled)
  const isFormValid = () => {
    for (const relative of relatives) {
      // Check if breast cancer question is answered
      if (relative.hasBreastCancer === null || relative.hasBreastCancer === undefined) {
        return false;
      }
      
      // If breast cancer is Yes, age at diagnosis is required
      if (relative.hasBreastCancer === true) {
        if (!relative.ageAtDiagnosis || relative.ageAtDiagnosis <= 0 || relative.ageAtDiagnosis > 120) {
          return false;
        }
      }
      
      // BRCA status is required
      if (!relative.brcaStatus || relative.brcaStatus === '') {
        return false;
      }
    }
    return true;
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    relatives.forEach((relative, index) => {
      // Breast cancer question is required (must be answered)
      if (relative.hasBreastCancer === undefined || relative.hasBreastCancer === null) {
        newErrors[`${relative.relation}_hasBreastCancer`] = 'Please select Yes or No';
      }
      
      // If breast cancer is Yes, age at diagnosis is required
      if (relative.hasBreastCancer === true) {
        if (!relative.ageAtDiagnosis || relative.ageAtDiagnosis <= 0 || relative.ageAtDiagnosis > 120) {
          newErrors[`${relative.relation}_ageAtDiagnosis`] = 'Please enter a valid age at diagnosis (1-120)';
        }
      }
      
      // BRCA status is required (cannot be unknown for validation purposes, but we'll allow it)
      // Actually, let's make it required to be selected (not defaulting to unknown)
      if (!relative.brcaStatus || relative.brcaStatus === '') {
        newErrors[`${relative.relation}_brcaStatus`] = 'Please select BRCA status';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setSubmitted(true);
      // Scroll to result after a short delay to ensure it's rendered
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      // You can add additional logic here if needed (e.g., save to backend)
    }
  };

  const handleRelativeChange = (index, field, value) => {
    setRelatives(prevRelatives => {
      const updatedRelatives = [...prevRelatives];
      updatedRelatives[index] = {
        ...updatedRelatives[index],
        [field]: value
      };
      
      // If hasBreastCancer is set to false, clear ageAtDiagnosis
      if (field === 'hasBreastCancer' && value === false) {
        updatedRelatives[index].ageAtDiagnosis = null;
      }
      
      // Clear error for this field
      if (errors[`${updatedRelatives[index].relation}_${field}`]) {
        const newErrors = { ...errors };
        delete newErrors[`${updatedRelatives[index].relation}_${field}`];
        if (field === 'hasBreastCancer' && !value) {
          delete newErrors[`${updatedRelatives[index].relation}_ageAtDiagnosis`];
        }
        setErrors(newErrors);
      }
      
      return updatedRelatives;
    });
  };

  const handleLifestyleChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getRelationLabel = (relation) => {
    const labels = {
      'mother': 'Mother',
      'grandmother': 'Grandmother',
      'self': 'Me'
    };
    return labels[relation] || relation;
  };

  const getRiskLevelColor = (level) => {
    if (level === 'high') return 'text-red-600';
    if (level === 'moderate') return 'text-orange-600';
    return 'text-green-600';
  };

  const getRiskLevelBgColor = (level) => {
    if (level === 'high') return 'bg-red-50 border-red-200';
    if (level === 'moderate') return 'bg-orange-50 border-orange-200';
    return 'bg-green-50 border-green-200';
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Genetic Risk Assessment</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Family History Form */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Family History</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide information about your family members' breast cancer history.
            </p>

            {relatives.map((relative, index) => (
              <div key={relative.relation} className="mb-6 p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-3 capitalize">
                  {getRelationLabel(relative.relation)}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Breast Cancer Yes/No */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Has this relative had breast cancer? <span className="text-red-500">*</span>
                    </label>
                    <select
                      className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors[`${relative.relation}_hasBreastCancer`] 
                          ? 'border-red-500' 
                          : 'border-gray-300'
                      }`}
                      value={relative.hasBreastCancer === true ? 'yes' : relative.hasBreastCancer === false ? 'no' : ''}
                      onChange={(e) => {
                        const hasCancer = e.target.value === 'yes';
                        handleRelativeChange(index, 'hasBreastCancer', hasCancer);
                      }}
                      required
                    >
                      <option value="">Select...</option>
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                    {errors[`${relative.relation}_hasBreastCancer`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`${relative.relation}_hasBreastCancer`]}</p>
                    )}
                  </div>

                  {/* Age at Diagnosis (if Yes) */}
                  {relative.hasBreastCancer && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Age at diagnosis <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                          errors[`${relative.relation}_ageAtDiagnosis`] 
                            ? 'border-red-500' 
                            : 'border-gray-300'
                        }`}
                        placeholder="Enter age"
                        value={relative.ageAtDiagnosis || ''}
                        onChange={(e) => {
                          const age = e.target.value ? parseInt(e.target.value) : null;
                          handleRelativeChange(index, 'ageAtDiagnosis', age);
                        }}
                        required
                      />
                      {errors[`${relative.relation}_ageAtDiagnosis`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`${relative.relation}_ageAtDiagnosis`]}</p>
                      )}
                    </div>
                  )}

                  {/* BRCA Status (for all relatives) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Genetic testing / BRCA status <span className="text-red-500">*</span>
                    </label>
                    <select
                      className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors[`${relative.relation}_brcaStatus`] 
                          ? 'border-red-500' 
                          : 'border-gray-300'
                      }`}
                      value={relative.brcaStatus || ''}
                      onChange={(e) => handleRelativeChange(index, 'brcaStatus', e.target.value)}
                      required
                    >
                      <option value="">Select...</option>
                      <option value="unknown">Unknown</option>
                      <option value="negative">Negative</option>
                      <option value="positive">Positive</option>
                    </select>
                    {errors[`${relative.relation}_brcaStatus`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`${relative.relation}_brcaStatus`]}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Lifestyle Factors */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Lifestyle Factors</h3>
            <p className="text-sm text-gray-600 mb-4">
              Select any lifestyle factors that apply to you.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  id="smoking"
                  className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  checked={userData.smoking}
                  onChange={(e) => handleLifestyleChange('smoking', e.target.checked)}
                />
                <label htmlFor="smoking" className="ml-3 text-sm font-medium text-gray-700 cursor-pointer">
                  Smoking
                </label>
              </div>

              <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  id="drinking"
                  className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  checked={userData.drinking}
                  onChange={(e) => handleLifestyleChange('drinking', e.target.checked)}
                />
                <label htmlFor="drinking" className="ml-3 text-sm font-medium text-gray-700 cursor-pointer">
                  Drinking
                </label>
              </div>

              <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  id="lifestyleUnhealthy"
                  className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  checked={userData.lifestyleUnhealthy}
                  onChange={(e) => handleLifestyleChange('lifestyleUnhealthy', e.target.checked)}
                />
                <label htmlFor="lifestyleUnhealthy" className="ml-3 text-sm font-medium text-gray-700 cursor-pointer">
                  Unhealthy Lifestyle
                </label>
              </div>
            </div>
          </div>

          {/* Validation Errors Summary */}
          {Object.keys(errors).length > 0 && !submitted && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-semibold mb-2">Please fix the following errors:</p>
              <ul className="text-red-600 text-sm list-disc list-inside">
                {Object.values(errors).map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-3 mb-8">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isFormValid()}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                !isFormValid()
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              Submit
            </button>
          </div>

          {/* Risk Result Display - Show after submit at the bottom */}
          {submitted && riskResult && (
            <div 
              ref={resultRef}
              className={`p-6 rounded-lg border-2 mb-4 ${getRiskLevelBgColor(riskResult.level)} transition-all duration-300`}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Your Risk Assessment</h3>
              <p className={`text-lg font-semibold ${getRiskLevelColor(riskResult.level)} mb-3`}>
                {riskResult.labelText}
              </p>
              <p className="text-sm text-gray-600 mt-4">
                {riskResult.disclaimer}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneticRiskForm;

