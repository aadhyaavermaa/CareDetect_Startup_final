import React, { useState, useEffect } from 'react';
import { getBreastCancerRiskLevel } from '../utils/breastCancerRiskLevel';

const FamilyHealthDashboard = () => {
  const [riskResult, setRiskResult] = useState({
    level: 'around_average',
    labelText: 'Around average',
    disclaimer: 'This is an educational estimate based on family history and lifestyle. It does not replace a doctor or official medical calculators.'
  });
  const [userData, setUserData] = useState({
    smoking: false,
    heavyDrinking: false,
    unhealthyLifestyle: false
  });
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'genetic'
  const [showRisk, setShowRisk] = useState(true); // when false, hide risk until genetic form submitted
  const [geneticSubmitted, setGeneticSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState([]);
  const [geneticForm, setGeneticForm] = useState({
    self: { hasBreastCancer: false, ageAtDiagnosis: null, brcaStatus: 'unknown', side: 'unknown' },
    mother: { hasBreastCancer: false, ageAtDiagnosis: null, side: 'maternal' },
    sister: { hasBreastCancer: false, ageAtDiagnosis: null, side: 'unknown' },
    grandmother: { hasBreastCancer: false, ageAtDiagnosis: null, side: 'maternal' },
    lifestyle: { smoking: false, heavyDrinking: false, unhealthyLifestyle: false }
  });
  
  const [relatives, setRelatives] = useState([
    { relation: 'self', hasBreastCancer: false, ageAtDiagnosis: null, brcaStatus: 'unknown', side: 'unknown' },
    { relation: 'mother', hasBreastCancer: false, ageAtDiagnosis: null, brcaStatus: 'unknown', side: 'maternal' },
    { relation: 'grandmother', hasBreastCancer: false, ageAtDiagnosis: null, brcaStatus: 'unknown', side: 'maternal' },
    { relation: 'sister', hasBreastCancer: false, ageAtDiagnosis: null, brcaStatus: 'unknown', side: 'maternal' },
    { relation: 'daughter', hasBreastCancer: false, ageAtDiagnosis: null, brcaStatus: 'unknown', side: 'maternal' },
    { relation: 'aunt', hasBreastCancer: false, ageAtDiagnosis: null, brcaStatus: 'unknown', side: 'maternal' }
  ]);

  // Calculate risk whenever data changes (only when showRisk is true)
  useEffect(() => {
    if (!showRisk) return;
    const calculatedRisk = getBreastCancerRiskLevel(userData, relatives);
    setRiskResult(calculatedRisk);
  }, [userData, relatives, showRisk]);

  const validateGeneticForm = (form = null) => {
    const errors = [];
    const data = form || relatives;

    if (form) {
      // form is the focused genetic helper structure
      const self = form.self;
      if (!self || !self.brcaStatus || self.brcaStatus === 'unknown') {
        errors.push('Please select your BRCA status.');
      }

      ['mother', 'sister', 'grandmother'].forEach(key => {
        const r = form[key];
        if (typeof r.hasBreastCancer !== 'boolean') {
          errors.push(`Please specify if ${key} had breast cancer.`);
        }
        if (r.hasBreastCancer) {
          if (!r.ageAtDiagnosis) errors.push(`Please enter age at diagnosis for ${key}.`);
          if (!r.side || r.side === 'unknown') errors.push(`Please select family side for ${key}.`);
        }
      });

      // lifestyle are optional flags but included in form
      return errors;
    }

    // Fallback: validate global relatives array
    const selfRel = relatives.find(r => r.relation === 'self');
    if (!selfRel || !selfRel.brcaStatus || selfRel.brcaStatus === 'unknown') {
      errors.push('Please select your BRCA status.');
    }
    relatives.forEach(r => {
      if (typeof r.hasBreastCancer !== 'boolean') {
        errors.push(`Please specify if ${r.relation} had breast cancer.`);
      }
      if (r.hasBreastCancer) {
        if (!r.ageAtDiagnosis) errors.push(`Please enter age at diagnosis for ${r.relation}.`);
        if (!r.side || r.side === 'unknown') errors.push(`Please select family side for ${r.relation}.`);
      }
    });
    return errors;
  };

  const calculateGeneticRisk = () => {
    const errors = validateGeneticForm(geneticForm);
    setFormErrors(errors);
    if (errors.length > 0) {
      setShowRisk(false);
      setGeneticSubmitted(false);
      return;
    }

    // Build relatives array and userData from geneticForm and compute risk
    const updatedRelatives = [...relatives];
    // update or insert entries for self, mother, sister, grandmother
    const upsert = (relationKey, values) => {
      const idx = updatedRelatives.findIndex(r => r.relation === relationKey || r.relation === relationKey);
      const entry = {
        relation: relationKey,
        hasBreastCancer: !!values.hasBreastCancer,
        ageAtDiagnosis: values.ageAtDiagnosis || null,
        brcaStatus: values.brcaStatus || 'unknown',
        side: values.side || 'unknown'
      };
      if (idx >= 0) updatedRelatives[idx] = { ...updatedRelatives[idx], ...entry };
      else updatedRelatives.push(entry);
    };

    upsert('self', geneticForm.self);
    upsert('mother', geneticForm.mother);
    upsert('sister', geneticForm.sister);
    upsert('grandmother', geneticForm.grandmother);

    const newUserData = {
      smoking: !!geneticForm.lifestyle.smoking,
      heavyDrinking: !!geneticForm.lifestyle.heavyDrinking,
      unhealthyLifestyle: !!geneticForm.lifestyle.unhealthyLifestyle
    };

    setRelatives(updatedRelatives);
    setUserData(newUserData);

    const calculatedRisk = getBreastCancerRiskLevel(newUserData, updatedRelatives);
    setRiskResult(calculatedRisk);
    setShowRisk(true);
    setGeneticSubmitted(true);
  };

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

  const getRiskLevelColor = (level) => {
    if (level === 'high') return "text-red-600";
    if (level === 'moderate') return "text-orange-600";
    return "text-green-600";
  };

  const getRiskLevelBgColor = (level) => {
    if (level === 'high') return "bg-red-50 border-red-200";
    if (level === 'moderate') return "bg-orange-50 border-orange-200";
    return "bg-green-50 border-green-200";
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Family Health Dashboard
      </h1>

      {/* Tabs */}
      <div className="mb-4 flex gap-3">
        <button
          className={`px-4 py-2 rounded ${activeTab === 'overview' ? 'bg-pink-500 text-white' : 'bg-white border'}`}
          onClick={() => { setActiveTab('overview'); setShowRisk(true); setFormErrors([]); }}
        >Overview</button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'genetic' ? 'bg-pink-500 text-white' : 'bg-white border'}`}
          onClick={() => { setActiveTab('genetic'); setShowRisk(false); setFormErrors([]); }}
        >Genetic Risk</button>
      </div>

      {/* Risk Level Display (hidden while filling genetic tab until submitted) */}
      {showRisk && riskResult && (
        <div className={`p-6 rounded-lg border-2 mb-8 ${getRiskLevelBgColor(riskResult.level)}`}>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Your Risk Level</h2>
          <p className={`text-2xl font-bold ${getRiskLevelColor(riskResult.level)} mb-2`}>
            {riskResult.labelText}
          </p>
          <p className="text-sm text-gray-600 mt-4">
            {riskResult.disclaimer}
          </p>
        </div>
      )}

      {/* Family History Input */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Family History</h3>
        
        {activeTab === 'overview' && relatives.map((relative, index) => (
          <div key={relative.relation} className="mb-4 p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium capitalize mb-3">{relative.relation}</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Had breast cancer?
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded"
                  value={relative.hasBreastCancer}
                  onChange={(e) => handleRelativeChange(index, 'hasBreastCancer', e.target.value === 'true')}
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>

              {relative.hasBreastCancer && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age at diagnosis
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Age"
                      value={relative.ageAtDiagnosis || ''}
                      onChange={(e) => handleRelativeChange(index, 'ageAtDiagnosis', parseInt(e.target.value) || null)}
                    />
                  </div>

                  {relative.relation === 'self' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        BRCA Status
                      </label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded"
                        value={relative.brcaStatus}
                        onChange={(e) => handleRelativeChange(index, 'brcaStatus', e.target.value)}
                      >
                        <option value="unknown">Unknown</option>
                        <option value="negative">Negative</option>
                        <option value="positive">Positive</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Family side
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded"
                      value={relative.side}
                      onChange={(e) => handleRelativeChange(index, 'side', e.target.value)}
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

      {/* Genetic helper form shown when Genetic tab active */}
      {activeTab === 'genetic' && (
        <div className="mb-8 p-4 border border-pink-100 rounded bg-white">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Quick Family-history Helper</h3>

          {formErrors.length > 0 && (
            <div className="mb-3 text-sm text-red-600">
              <ul className="list-disc pl-5">
                {formErrors.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            </div>
          )}

          {['mother', 'sister', 'grandmother', 'self'].map((key) => {
            const label = key === 'self' ? 'You' : key.charAt(0).toUpperCase() + key.slice(1);
            const rel = geneticForm[key];
            return (
              <div key={key} className="mb-4 p-3 border border-gray-100 rounded">
                <h4 className="font-medium mb-2">{label}</h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Had breast cancer?</label>
                    <select className="w-full p-2 border rounded" value={String(!!rel.hasBreastCancer)} onChange={(e) => setGeneticForm(prev => ({ ...prev, [key]: { ...prev[key], hasBreastCancer: e.target.value === 'true' } }))}>
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  </div>

                  {rel.hasBreastCancer && (
                    <>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Age at diagnosis</label>
                        <input type="number" min="0" className="w-full p-2 border rounded" value={rel.ageAtDiagnosis || ''} onChange={(e) => setGeneticForm(prev => ({ ...prev, [key]: { ...prev[key], ageAtDiagnosis: parseInt(e.target.value) || null } }))} />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Family side</label>
                        <select className="w-full p-2 border rounded" value={rel.side || 'unknown'} onChange={(e) => setGeneticForm(prev => ({ ...prev, [key]: { ...prev[key], side: e.target.value } }))}>
                          <option value="maternal">Maternal</option>
                          <option value="paternal">Paternal</option>
                          <option value="unknown">Unknown</option>
                        </select>
                      </div>
                    </>
                  )}

                  {key === 'self' && (
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">BRCA status</label>
                      <select className="w-full p-2 border rounded" value={geneticForm.self.brcaStatus} onChange={(e) => setGeneticForm(prev => ({ ...prev, self: { ...prev.self, brcaStatus: e.target.value } }))}>
                        <option value="unknown">Unknown</option>
                        <option value="negative">Negative</option>
                        <option value="positive">Positive</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <div className="mb-4">
            <h4 className="font-medium mb-2">Lifestyle</h4>
            <div className="flex gap-4">
              <label className="flex items-center gap-2"><input type="checkbox" checked={geneticForm.lifestyle.smoking} onChange={(e) => setGeneticForm(prev => ({ ...prev, lifestyle: { ...prev.lifestyle, smoking: e.target.checked } }))} /> Smoking</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={geneticForm.lifestyle.heavyDrinking} onChange={(e) => setGeneticForm(prev => ({ ...prev, lifestyle: { ...prev.lifestyle, heavyDrinking: e.target.checked } }))} /> Heavy Drinking</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={geneticForm.lifestyle.unhealthyLifestyle} onChange={(e) => setGeneticForm(prev => ({ ...prev, lifestyle: { ...prev.lifestyle, unhealthyLifestyle: e.target.checked } }))} /> Unhealthy Lifestyle</label>
            </div>
          </div>

          <div className="flex gap-3">
            <button className={`px-4 py-2 rounded ${validateGeneticForm(geneticForm).length === 0 ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-500 cursor-not-allowed'}`} onClick={calculateGeneticRisk} disabled={validateGeneticForm(geneticForm).length !== 0}>Calculate risk</button>
            <button className="px-4 py-2 bg-white border rounded" onClick={() => { setActiveTab('overview'); setShowRisk(true); setFormErrors([]); setGeneticSubmitted(false); }}>Cancel</button>
          </div>

          {geneticSubmitted && (<div className="mt-3 text-sm text-green-700">Genetic info submitted — risk calculated.</div>)}
        </div>
      )}

      

      {/* Lifestyle Factors */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Lifestyle Factors</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="smoking"
              className="mr-2"
              checked={userData.smoking}
              onChange={(e) => handleLifestyleChange('smoking', e.target.checked)}
            />
            <label htmlFor="smoking" className="text-sm font-medium text-gray-700">
              Smoking
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="heavyDrinking"
              className="mr-2"
              checked={userData.heavyDrinking}
              onChange={(e) => handleLifestyleChange('heavyDrinking', e.target.checked)}
            />
            <label htmlFor="heavyDrinking" className="text-sm font-medium text-gray-700">
              Heavy Drinking
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="unhealthyLifestyle"
              className="mr-2"
              checked={userData.unhealthyLifestyle}
              onChange={(e) => handleLifestyleChange('unhealthyLifestyle', e.target.checked)}
            />
            <label htmlFor="unhealthyLifestyle" className="text-sm font-medium text-gray-700">
              Unhealthy Lifestyle
            </label>
          </div>
        </div>
      </div>

      {/* Real-time Risk Display */}
      {riskResult && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Current Risk Level:</h3>
          <p className={`text-xl font-bold ${getRiskLevelColor(riskResult.level)} mb-2`}>
            {riskResult.labelText}
          </p>
          <p className="text-sm text-gray-600">
            {riskResult.disclaimer}
          </p>
        </div>
      )}
    </div>
  );
};

export default FamilyHealthDashboard;
