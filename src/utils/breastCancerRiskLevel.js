/**
 * Pure Rule-Based Breast Cancer Risk Level Function
 * Returns object with level, labelText, and disclaimer
 * 
 * @param {Object} userData - User lifestyle data
 * @param {Array} relatives - Array of relative objects
 * @returns {Object} { level: string, labelText: string, disclaimer: string }
 */
export function getBreastCancerRiskLevel(userData, relatives) {
  // Normalize relatives array (ensure relation keys are lowercase)
  const rels = (relatives || []).map(r => ({ ...r, relation: (r.relation || '').toLowerCase() }));

  // 1. Count first-degree relatives with breast cancer
  const firstDegreeRelations = ['mother', 'sister', 'daughter'];
  const secondDegreeRelations = ['grandmother', 'aunt'];

  const firstDegreeWithCancer = rels.filter(r => firstDegreeRelations.includes(r.relation) && r.hasBreastCancer);
  const firstDegreeCount = firstDegreeWithCancer.length;

  // 2. Minimum age at diagnosis among first-degree relatives (null if none)
  const firstAges = firstDegreeWithCancer
    .map(r => (typeof r.ageAtDiagnosis === 'number' && r.ageAtDiagnosis > 0) ? r.ageAtDiagnosis : null)
    .filter(a => a !== null);
  const minFirstDegreeAge = firstAges.length > 0 ? Math.min(...firstAges) : null;

  // 3. Count total relatives with cancer (first + second degree only)
  const secondDegreeWithCancer = rels.filter(r => secondDegreeRelations.includes(r.relation) && r.hasBreastCancer);
  const secondDegreeCount = secondDegreeWithCancer.length;
  const totalWithCancer = firstDegreeCount + secondDegreeCount;

  // 4. Check user's own BRCA status (look for relation 'self')
  const self = rels.find(r => r.relation === 'self');
  const userBrcaStatus = self && typeof self.brcaStatus === 'string' ? self.brcaStatus.toLowerCase() : 'unknown';

  // 5. Lifestyle flags count
  const lifestyleFlags = [
    !!(userData && userData.smoking),
    !!(userData && userData.heavyDrinking),
    !!(userData && userData.unhealthyLifestyle)
  ].filter(Boolean).length;

  // Helper: check same-side pattern among first/second degree relatives
  const maternalSide = rels.filter(r => (firstDegreeRelations.concat(secondDegreeRelations).includes(r.relation)) && r.hasBreastCancer && r.side === 'maternal').length;
  const paternalSide = rels.filter(r => (firstDegreeRelations.concat(secondDegreeRelations).includes(r.relation)) && r.hasBreastCancer && r.side === 'paternal').length;
  const twoOnSameSide = maternalSide >= 2 || paternalSide >= 2;

  const disclaimer = "This is an educational estimate based on family history and lifestyle. It does not replace a doctor or official medical calculators.";

  // Apply rules in clear priority order and return object with level, labelText, and disclaimer

  // HIGH RISK
  if (userBrcaStatus === 'positive') {
    return {
      level: 'high',
      labelText: 'High – talk to a doctor or genetic counselor.',
      disclaimer: disclaimer
    };
  }

  if (firstDegreeCount >= 2) {
    return {
      level: 'high',
      labelText: 'High – talk to a doctor or genetic counselor.',
      disclaimer: disclaimer
    };
  }

  if (minFirstDegreeAge !== null && minFirstDegreeAge < 40) {
    return {
      level: 'high',
      labelText: 'High – talk to a doctor or genetic counselor.',
      disclaimer: disclaimer
    };
  }

  // MODERATELY INCREASED RISK
  if (firstDegreeCount === 1) {
    return {
      level: 'moderate',
      labelText: 'Moderately increased',
      disclaimer: disclaimer
    };
  }

  if (twoOnSameSide && totalWithCancer >= 2) {
    return {
      level: 'moderate',
      labelText: 'Moderately increased',
      disclaimer: disclaimer
    };
  }

  // No strong family history but >=2 lifestyle flags
  // Define "no strong family history" as zero first-degree relatives and at most one second-degree
  if (firstDegreeCount === 0 && secondDegreeCount <= 1 && lifestyleFlags >= 2) {
    return {
      level: 'moderate',
      labelText: 'Moderately increased',
      disclaimer: disclaimer
    };
  }

  // AROUND AVERAGE RISK
  // No first-degree relatives with breast cancer
  if (firstDegreeCount === 0) {
    if (secondDegreeCount === 0) {
      return {
        level: 'around_average',
        labelText: 'Around average',
        disclaimer: disclaimer
      };
    }

    if (secondDegreeCount === 1) {
      const sd = secondDegreeWithCancer[0];
      // If age at diagnosis is unknown or >=50, classify as around average
      if (!sd.ageAtDiagnosis || sd.ageAtDiagnosis >= 50) {
        return {
          level: 'around_average',
          labelText: 'Around average',
          disclaimer: disclaimer
        };
      }
    }
  }

  // Default fallback
  return {
    level: 'around_average',
    labelText: 'Around average',
    disclaimer: disclaimer
  };
}

/**
 * Helper function to test the risk level function
 */
export function testRiskLevelFunction() {
  // Test case 1: Average risk - no family history
  const userData1 = { smoking: false, heavyDrinking: false, unhealthyLifestyle: false };
  const relatives1 = [
    { relation: 'mother', hasBreastCancer: false, ageAtDiagnosis: null, brcaStatus: 'unknown', side: 'maternal' },
    { relation: 'grandmother', hasBreastCancer: false, ageAtDiagnosis: null, brcaStatus: 'unknown', side: 'maternal' },
    { relation: 'self', hasBreastCancer: false, ageAtDiagnosis: null, brcaStatus: 'unknown', side: 'unknown' }
  ];
  
  // Test case 2: Moderate risk - one first-degree relative
  const userData2 = { smoking: false, heavyDrinking: false, unhealthyLifestyle: false };
  const relatives2 = [
    { relation: 'mother', hasBreastCancer: true, ageAtDiagnosis: 55, brcaStatus: 'unknown', side: 'maternal' },
    { relation: 'grandmother', hasBreastCancer: false, ageAtDiagnosis: null, brcaStatus: 'unknown', side: 'maternal' },
    { relation: 'self', hasBreastCancer: false, ageAtDiagnosis: null, brcaStatus: 'unknown', side: 'unknown' }
  ];
  
  // Test case 3: High risk - BRCA positive
  const userData3 = { smoking: false, heavyDrinking: false, unhealthyLifestyle: false };
  const relatives3 = [
    { relation: 'mother', hasBreastCancer: false, ageAtDiagnosis: null, brcaStatus: 'unknown', side: 'maternal' },
    { relation: 'self', hasBreastCancer: false, ageAtDiagnosis: null, brcaStatus: 'positive', side: 'unknown' }
  ];
  
  console.log('Test 1 (Average):', getBreastCancerRiskLevel(userData1, relatives1));
  console.log('Test 2 (Moderate):', getBreastCancerRiskLevel(userData2, relatives2));
  console.log('Test 3 (High):', getBreastCancerRiskLevel(userData3, relatives3));
}

export default getBreastCancerRiskLevel;
