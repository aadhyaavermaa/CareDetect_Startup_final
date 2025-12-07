import React, { useState } from 'react';
import FamilyHistoryRiskEngine from '../utils/familyHistoryRiskEngine';

const RiskAssessmentForm = () => {
  const [familyData, setFamilyData] = useState({
    mother: { hasHadBreastCancer: false, ageAtDiagnosis: '', brcaStatus: 'unknown', side: 'maternal' },
    sister: { hasHadBreastCancer: false, ageAtDiagnosis: '', brcaStatus: 'unknown', side: 'maternal' },
    daughter: { hasHadBreastCancer: false, ageAtDiagnosis: '', brcaStatus: 'unknown', side: 'maternal' },
    grandmother: { hasHadBreastCancer: false, ageAtDiagnosis: '', brcaStatus: 'unknown', side: 'maternal' },
    aunt: { hasHadBreastCancer: false, ageAtDiagnosis: '', brcaStatus: 'unknown', side: 'maternal' }
  });

  const [lifestyleData, setLifestyleData] = useState({
    smoking: 'never',
    alcohol: 'none',
    bmi: '',
    exercise: 'moderate'
  });

  const [riskResult, setRiskResult] = useState(null);
  const riskEngine = new FamilyHistoryRiskEngine();

  const handleFamilyChange = (relation, field, value) => {
    setFamilyData(prev => ({
      ...prev,
      [relation]: {
        ...prev[relation],
        [field]: value
      }
    }));
  };

  const handleLifestyleChange = (field, value) => {
    setLifestyleData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateRisk = () => {
    const result = riskEngine.calculateRisk(familyData, lifestyleData);
    setRiskResult(result);
  };

  const getBRCAOptions = () => [
    { value: 'not_done', label: 'Not done' },
    { value: 'positive', label: 'Yes - BRCA positive' },
    { value: 'negative', label: 'Yes - BRCA negative' },
    { value: 'unknown_result', label: 'Done - result unknown' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header with Disclaimer */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Approximate Risk Category Based on Family and Lifestyle Info
        </h2>
        <p className="text-sm text-gray-600 italic">
          Educational estimate only - this does not replace a doctor or official medical risk calculator
        </p>
      </div>

      {/* Family History Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Family History</h3>
        
        {Object.entries(familyData).map(([relation, data]) => (
          <div key={relation} className="mb-6 p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium capitalize mb-3">{relation.replace('_', ' ')}</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Had breast cancer?
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded"
                  value={data.hasHadBreastCancer}
                  onChange={(e) => handleFamilyChange(relation, 'hasHadBreastCancer', e.target.value === 'true')}
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>

              {data.hasHadBreastCancer && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age at diagnosis
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Age"
                      value={data.ageAtDiagnosis}
                      onChange={(e) => handleFamilyChange(relation, 'ageAtDiagnosis', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Genetic Testing?
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded"
                      value={data.brcaStatus}
                      onChange={(e) => handleFamilyChange(relation, 'brcaStatus', e.target.value)}
                    >
                      {getBRCAOptions().map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Family side
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded"
                      value={data.side}
                      onChange={(e) => handleFamilyChange(relation, 'side', e.target.value)}
                    >
                      <option value="maternal">Maternal</option>
                      <option value="paternal">Paternal</option>
                      <option value="unknown">Unknown</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lifestyle Factors Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Lifestyle Factors</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Smoking</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={lifestyleData.smoking}
              onChange={(e) => handleLifestyleChange('smoking', e.target.value)}
            >
              <option value="never">Never</option>
              <option value="former">Former</option>
              <option value="current">Current</option>
              <option value="heavy">Heavy</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alcohol</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={lifestyleData.alcohol}
              onChange={(e) => handleLifestyleChange('alcohol', e.target.value)}
            >
              <option value="none">None</option>
              <option value="light">Light (&le;7 drinks/week)</option>
              <option value="moderate">Moderate (8-14 drinks/week)</option>
              <option value="heavy">Heavy (&gt;14 drinks/week)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">BMI</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Body Mass Index"
              value={lifestyleData.bmi}
              onChange={(e) => handleLifestyleChange('bmi', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Exercise</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={lifestyleData.exercise}
              onChange={(e) => handleLifestyleChange('exercise', e.target.value)}
            >
              <option value="none">None</option>
              <option value="minimal">Minimal</option>
              <option value="moderate">Moderate</option>
              <option value="regular">Regular</option>
            </select>
          </div>
        </div>
      </div>

      {/* Calculate Button */}
      <div className="text-center mb-8">
        <button
          onClick={calculateRisk}
          className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all"
        >
          Calculate Risk Category
        </button>
      </div>

      {/* Results Section */}
      {riskResult && (
        <div className="p-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg border border-pink-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Risk Assessment Result</h3>
          
          <div className="mb-4">
            <span className="text-lg font-semibold text-pink-600">
              {riskResult.category}
            </span>
            <span className="text-gray-600 ml-2">({riskResult.riskRange})</span>
          </div>

          <p className="text-gray-700 mb-4">{riskResult.description}</p>

          <div className="mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">Recommendations:</h4>
            <ul className="list-disc list-inside text-gray-700">
              {riskResult.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>

          <div className="text-sm text-gray-600 italic mt-4 pt-4 border-t border-gray-300">
            {riskResult.disclaimer}
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskAssessmentForm;
