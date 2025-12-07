import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getBreastCancerRiskLevel } from '../../utils/breastCancerRiskLevel';

const GeneticRiskForm = ({ open, onClose }) => {
  const [relatives, setRelatives] = useState([
    { relation: 'mother', hasBreastCancer: false, ageAtDiagnosis: null, brcaStatus: 'unknown', degree: 'first' },
    { relation: 'sister', hasBreastCancer: false, ageAtDiagnosis: null, brcaStatus: 'unknown', degree: 'first' },
    { relation: 'daughter', hasBreastCancer: false, ageAtDiagnosis: null, brcaStatus: 'unknown', degree: 'first' },
    { relation: 'grandmother', hasBreastCancer: false, ageAtDiagnosis: null, brcaStatus: 'unknown', degree: 'second' },
    { relation: 'aunt', hasBreastCancer: false, ageAtDiagnosis: null, brcaStatus: 'unknown', degree: 'second' },
    { relation: 'self', hasBreastCancer: false, ageAtDiagnosis: null, brcaStatus: 'unknown', degree: 'self' }
  ]);

  const [userData, setUserData] = useState({
    smoking: false,
    heavyDrinking: false,
    unhealthyLifestyle: false
  });

  const [riskResult, setRiskResult] = useState(null);

  // Calculate risk whenever data changes
  useEffect(() => {
    const result = getBreastCancerRiskLevel(userData, relatives);
    setRiskResult(result);
  }, [userData, relatives]);

  const handleRelativeChange = (index, field, value) => {
    const updatedRelatives = [...relatives];
    updatedRelatives[index] = {
      ...updatedRelatives[index],
      [field]: value
    };
    setRelatives(updatedRelatives);
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
      'sister': 'Sister',
      'daughter': 'Daughter',
      'grandmother': 'Grandmother',
      'aunt': 'Aunt',
      'self': 'Self (You)'
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
          {/* Risk Result Display */}
          {riskResult && (
            <div className={`p-6 rounded-lg border-2 mb-8 ${getRiskLevelBgColor(riskResult.level)}`}>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Risk Level</h3>
              <p className={`text-2xl font-bold ${getRiskLevelColor(riskResult.level)} mb-2`}>
                {riskResult.labelText}
              </p>
              <p className="text-sm text-gray-600 mt-4">
                {riskResult.disclaimer}
              </p>
            </div>
          )}

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
                      Breast cancer?
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={relative.hasBreastCancer ? 'yes' : 'no'}
                      onChange={(e) => {
                        const hasCancer = e.target.value === 'yes';
                        handleRelativeChange(index, 'hasBreastCancer', hasCancer);
                        if (!hasCancer) {
                          handleRelativeChange(index, 'ageAtDiagnosis', null);
                        }
                      }}
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>

                  {/* Age at Diagnosis (if Yes) */}
                  {relative.hasBreastCancer && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Age at diagnosis
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="120"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter age"
                        value={relative.ageAtDiagnosis || ''}
                        onChange={(e) => {
                          const age = e.target.value ? parseInt(e.target.value) : null;
                          handleRelativeChange(index, 'ageAtDiagnosis', age);
                        }}
                      />
                    </div>
                  )}

                  {/* BRCA Status (for all relatives) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Genetic testing / BRCA status
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={relative.brcaStatus}
                      onChange={(e) => handleRelativeChange(index, 'brcaStatus', e.target.value)}
                    >
                      <option value="unknown">Unknown</option>
                      <option value="negative">Negative</option>
                      <option value="positive">Positive</option>
                    </select>
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
                  id="heavyDrinking"
                  className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  checked={userData.heavyDrinking}
                  onChange={(e) => handleLifestyleChange('heavyDrinking', e.target.checked)}
                />
                <label htmlFor="heavyDrinking" className="ml-3 text-sm font-medium text-gray-700 cursor-pointer">
                  Heavy Drinking
                </label>
              </div>

              <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  id="unhealthyLifestyle"
                  className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  checked={userData.unhealthyLifestyle}
                  onChange={(e) => handleLifestyleChange('unhealthyLifestyle', e.target.checked)}
                />
                <label htmlFor="unhealthyLifestyle" className="ml-3 text-sm font-medium text-gray-700 cursor-pointer">
                  Unhealthy Lifestyle
                </label>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneticRiskForm;

