/**
 * Research-Based Family History Risk Assessment Engine
 * Based on established medical guidelines and epidemiological data
 * Medical Disclaimer: Educational tool only, not medical advice
 */

export class FamilyHistoryRiskEngine {
  constructor() {
    // Medical constants from NCI/ACS guidelines
    this.BASELINE_LIFETIME_RISK = 0.12; // 12% average population risk
    this.FIRST_DEGREE_MULTIPLIER = 2.0; // Approximate doubling of risk
    this.BRCA_MIN_RISK = 0.40; // 40% minimum for BRCA carriers
    this.BRCA_MAX_RISK = 0.70; // 70% maximum lifetime risk
  }

  /**
   * Calculate risk category based on family history using established medical rules
   * @param {Object} familyData - Family history data
   * @param {Object} lifestyleData - Lifestyle factors
   * @returns {Object} Risk assessment result
   */
  calculateRisk(familyData, lifestyleData = {}) {
    const analysis = this.analyzeFamilyPatterns(familyData);
    const baseCategory = this.determineRiskCategory(analysis);
    const finalCategory = this.applyLifestyleModifiers(baseCategory, lifestyleData);
    
    return {
      category: finalCategory.name,
      description: finalCategory.description,
      riskRange: finalCategory.riskRange,
      recommendations: finalCategory.recommendations,
      familyAnalysis: analysis,
      disclaimer: "Educational estimate only - this does not replace a doctor or official medical risk calculator"
    };
  }

  /**
   * Analyze family history patterns using medical guidelines
   */
  analyzeFamilyPatterns(familyData) {
    const patterns = {
      firstDegreeAffected: [],
      secondDegreeAffected: [],
      earlyOnsetCases: [],
      brcaStatus: 'unknown',
      sameSidePattern: false
    };

    Object.entries(familyData).forEach(([relation, data]) => {
      if (!data?.hasHadBreastCancer) return;

      const relativeInfo = {
        relation,
        ageAtDiagnosis: data.ageAtDiagnosis,
        side: data.side || 'unknown',
        brcaStatus: data.brcaStatus || 'unknown'
      };

      // Categorize by relationship degree
      if (['mother', 'sister', 'daughter'].includes(relation)) {
        patterns.firstDegreeAffected.push(relativeInfo);
        
        // Check for early onset (<40 years)
        if (data.ageAtDiagnosis && data.ageAtDiagnosis < 40) {
          patterns.earlyOnsetCases.push(relativeInfo);
        }
      } else if (['grandmother', 'aunt'].includes(relation)) {
        patterns.secondDegreeAffected.push(relativeInfo);
      }

      // Track BRCA status
      if (data.brcaStatus === 'positive') {
        patterns.brcaStatus = 'positive';
      }
    });

    // Check for same-side family pattern
    const maternalCases = [...patterns.firstDegreeAffected, ...patterns.secondDegreeAffected]
      .filter(r => r.side === 'maternal');
    const paternalCases = [...patterns.firstDegreeAffected, ...patterns.secondDegreeAffected]
      .filter(r => r.side === 'paternal');

    patterns.sameSidePattern = (maternalCases.length >= 2) || (paternalCases.length >= 2);

    return patterns;
  }

  /**
   * Determine risk category using established medical criteria
   */
  determineRiskCategory(analysis) {
    // HIGH RISK CRITERIA
    if (analysis.brcaStatus === 'positive') {
      return this.getCategoryDefinition('HIGH');
    }

    if (analysis.earlyOnsetCases.length > 0) {
      return this.getCategoryDefinition('HIGH');
    }

    if (analysis.firstDegreeAffected.length >= 2) {
      return this.getCategoryDefinition('HIGH');
    }

    if (analysis.sameSidePattern && 
        (analysis.firstDegreeAffected.length + analysis.secondDegreeAffected.length) >= 3) {
      return this.getCategoryDefinition('HIGH');
    }

    // MODERATE RISK CRITERIA
    if (analysis.firstDegreeAffected.length === 1) {
      return this.getCategoryDefinition('MODERATE');
    }

    if (analysis.sameSidePattern) {
      return this.getCategoryDefinition('MODERATE');
    }

    // AVERAGE RISK CRITERIA
    if (analysis.secondDegreeAffected.length === 1) {
      const relative = analysis.secondDegreeAffected[0];
      if (!relative.ageAtDiagnosis || relative.ageAtDiagnosis > 50) {
        return this.getCategoryDefinition('AVERAGE');
      }
    }

    return this.getCategoryDefinition('AVERAGE');
  }

  /**
   * Get category definitions with medical context
   */
  getCategoryDefinition(level) {
    const categories = {
      AVERAGE: {
        name: "Around average risk",
        description: "Risk similar to general population",
        riskRange: "~12-13%",
        recommendations: [
          "Regular screening as per doctor's advice",
          "Maintain healthy lifestyle",
          "Know family health history"
        ]
      },
      MODERATE: {
        name: "Moderately increased risk", 
        description: "Risk above population average",
        riskRange: "~15-25%",
        recommendations: [
          "Discuss family history with healthcare provider",
          "Consider earlier screening",
          "Maintain vigilance about breast health"
        ]
      },
      HIGH: {
        name: "Higher risk - consider specialist advice",
        description: "Significantly elevated risk",
        riskRange: ">25%",
        recommendations: [
          "Consult breast specialist or genetic counselor",
          "Consider genetic testing if indicated",
          "Enhanced screening protocols"
        ]
      }
    };

    return categories[level];
  }

  /**
   * Apply lifestyle modifiers (small effect only)
   */
  applyLifestyleModifiers(baseCategory, lifestyleData) {
    let modifierScore = 0;

    // Small modifiers for lifestyle factors
    if (lifestyleData.smoking === 'current' || lifestyleData.smoking === 'heavy') {
      modifierScore += 0.1;
    }

    if (lifestyleData.alcohol === 'heavy' || lifestyleData.alcohol > 14) {
      modifierScore += 0.1;
    }

    if (lifestyleData.bmi >= 30) {
      modifierScore += 0.1;
    }

    // Lifestyle can only increase risk by one level maximum
    if (modifierScore >= 0.2 && baseCategory.name === "Around average risk") {
      return this.getCategoryDefinition('MODERATE');
    }

    return baseCategory;
  }
}

export default FamilyHistoryRiskEngine;
