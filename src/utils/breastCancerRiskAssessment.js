/**
 * Breast Cancer Family History Risk Assessment Engine
 * Medical Disclaimer: This tool is for educational purposes only and is NOT a medical diagnosis.
 * Always consult with healthcare professionals for medical advice.
 */

export class BreastCancerRiskAssessment {
  constructor() {
    // Medical constants based on epidemiological data
    this.POPULATION_RISK = 0.12; // 12% average lifetime risk
    this.FIRST_DEGREE_MULTIPLIER = 2.0; // Doubles risk
    this.BRCA_RISK_MIN = 0.40; // 40% minimum for BRCA carriers
    this.BRCA_RISK_MAX = 0.70; // 70% maximum for BRCA carriers
  }

  /**
   * Calculate breast cancer risk category based on family history
   * @param {Object} familyData - Family history data
   * @param {Object} lifestyleData - Lifestyle factors (optional)
   * @returns {Object} Risk assessment result
   */
  assessRisk(familyData, lifestyleData = {}) {
    const riskFactors = this.analyzeFamilyHistory(familyData);
    const lifestyleModifiers = this.analyzeLifestyle(lifestyleData);
    
    // Base risk category determination
    let category = this.determineBaseCategory(riskFactors);
    
    // Apply lifestyle modifiers (can only increase risk by one level)
    category = this.applyLifestyleModifiers(category, lifestyleModifiers);
    
    // Generate detailed result
    return {
      category: category.name,
      description: category.description,
      riskRange: category.riskRange,
      recommendations: category.recommendations,
      riskFactors: riskFactors,
      lifestyleModifiers: lifestyleModifiers,
      disclaimer: "This assessment is for educational purposes only and is not a substitute for professional medical advice. Please consult with healthcare providers for personalized risk assessment."
    };
  }

  /**
   * Analyze family history patterns
   * @param {Object} familyData - Family history data
   * @returns {Object} Analyzed risk factors
   */
  analyzeFamilyHistory(familyData) {
    const factors = {
      firstDegreeRelatives: [],
      secondDegreeRelatives: [],
      brcaStatus: null,
      earlyOnsetCases: [],
      multipleCasesSameSide: false
    };

    // Categorize relatives
    Object.entries(familyData).forEach(([relation, data]) => {
      if (!data || !data.hasHadBreastCancer) return;

      const relativeInfo = {
        relation: relation,
        ageAtDiagnosis: data.ageAtDiagnosis,
        side: data.side || 'unknown',
        geneticTest: data.geneticTest || 'unknown'
      };

      // First-degree relatives (mother, sister, daughter)
      if (['mother', 'sister', 'daughter'].includes(relation)) {
        factors.firstDegreeRelatives.push(relativeInfo);
        
        // Check for early onset (<40)
        if (data.ageAtDiagnosis && data.ageAtDiagnosis < 40) {
          factors.earlyOnsetCases.push(relativeInfo);
        }
      }
      // Second-degree relatives (grandmother, aunt, cousin)
      else if (['grandmother', 'aunt', 'cousin'].includes(relation)) {
        factors.secondDegreeRelatives.push(relativeInfo);
      }

      // Check for BRCA mutation
      if (data.geneticTest === 'positive' || data.geneticTest === 'BRCA_positive') {
        factors.brcaStatus = 'positive';
      } else if (data.geneticTest === 'negative' || data.geneticTest === 'BRCA_negative') {
        factors.brcaStatus = 'negative';
      }
    });

    // Check for multiple cases on same side of family
    const maternalSide = [...factors.firstDegreeRelatives, ...factors.secondDegreeRelatives]
      .filter(r => r.side === 'maternal');
    const paternalSide = [...factors.firstDegreeRelatives, ...factors.secondDegreeRelatives]
      .filter(r => r.side === 'paternal');

    factors.multipleCasesSameSide = (maternalSide.length >= 2) || (paternalSide.length >= 2);

    return factors;
  }

  /**
   * Determine base risk category from family history
   * @param {Object} factors - Analyzed risk factors
   * @returns {Object} Risk category
   */
  determineBaseCategory(factors) {
    // Rule 1: Known BRCA mutation - Highest risk
    if (factors.brcaStatus === 'positive') {
      return this.getCategory('HIGH');
    }

    // Rule 2: Early onset in first-degree relative - Highest risk
    if (factors.earlyOnsetCases.length > 0) {
      return this.getCategory('HIGH');
    }

    // Rule 3: Two or more first-degree relatives - Highest risk
    if (factors.firstDegreeRelatives.length >= 2) {
      return this.getCategory('HIGH');
    }

    // Rule 4: Multiple cases on same side - High risk
    if (factors.multipleCasesSameSide && 
        (factors.firstDegreeRelatives.length + factors.secondDegreeRelatives.length) >= 3) {
      return this.getCategory('HIGH');
    }

    // Rule 5: Exactly one first-degree relative - Moderate risk
    if (factors.firstDegreeRelatives.length === 1) {
      return this.getCategory('MODERATE');
    }

    // Rule 6: Two relatives on same side (but no first-degree) - Moderate risk
    if (factors.multipleCasesSameSide) {
      return this.getCategory('MODERATE');
    }

    // Rule 7: One second-degree relative >50 years - Average risk
    if (factors.secondDegreeRelatives.length === 1) {
      const relative = factors.secondDegreeRelatives[0];
      if (!relative.ageAtDiagnosis || relative.ageAtDiagnosis > 50) {
        return this.getCategory('AVERAGE');
      }
    }

    // Default: Average risk
    return this.getCategory('AVERAGE');
  }

  /**
   * Get category details
   * @param {string} level - Risk level (AVERAGE, MODERATE, HIGH)
   * @returns {Object} Category details
   */
  getCategory(level) {
    const categories = {
      AVERAGE: {
        name: "Around average risk",
        description: "Your risk appears to be similar to the general population",
        riskRange: "~12-13%",
        recommendations: [
          "Maintain regular breast health screenings as recommended by your doctor",
          "Know your family health history and update it regularly",
          "Maintain a healthy lifestyle with regular exercise and balanced diet",
          "Limit alcohol intake and avoid smoking"
        ]
      },
      MODERATE: {
        name: "Moderately increased risk",
        description: "Your risk appears to be above average, but not extremely elevated",
        riskRange: "~15-25%",
        recommendations: [
          "Discuss your family history with your healthcare provider",
          "Consider starting breast cancer screening earlier than average",
          "Maintain regular clinical breast exams and mammograms as recommended",
          "Be vigilant about breast health and report any changes promptly",
          "Consider genetic counseling if family history suggests hereditary pattern"
        ]
      },
      HIGH: {
        name: "Clearly higher risk – consider specialist advice",
        description: "Your risk appears to be significantly above average",
        riskRange: ">25% (potentially 40-70% if BRCA-positive)",
        recommendations: [
          "Consult with a breast specialist or genetic counselor",
          "Consider genetic testing if not already done",
          "Discuss enhanced screening protocols with your healthcare provider",
          "Consider risk-reduction strategies if appropriate",
          "Inform family members of relevant family history",
          "Follow personalized surveillance recommendations"
        ]
      }
    };

    return categories[level];
  }

  /**
   * Analyze lifestyle factors
   * @param {Object} lifestyleData - Lifestyle data
   * @returns {Object} Lifestyle modifiers
   */
  analyzeLifestyle(lifestyleData) {
    const modifiers = {
      smoking: false,
      heavyAlcohol: false,
      obesity: false,
      physicalInactivity: false,
      overallModifier: 0
    };

    if (lifestyleData.smoking === 'current' || lifestyleData.smoking === 'heavy') {
      modifiers.smoking = true;
      modifiers.overallModifier += 0.1;
    }

    if (lifestyleData.alcohol === 'heavy' || lifestyleData.alcohol > 14) { // >14 drinks/week
      modifiers.heavyAlcohol = true;
      modifiers.overallModifier += 0.1;
    }

    if (lifestyleData.bmi && lifestyleData.bmi >= 30) {
      modifiers.obesity = true;
      modifiers.overallModifier += 0.1;
    }

    if (lifestyleData.exercise === 'none' || lifestyleData.exercise === 'minimal') {
      modifiers.physicalInactivity = true;
      modifiers.overallModifier += 0.05;
    }

    return modifiers;
  }

  /**
   * Apply lifestyle modifiers to risk category
   * @param {Object} category - Base category
   * @param {Object} modifiers - Lifestyle modifiers
   * @returns {Object} Modified category
   */
  applyLifestyleModifiers(category, modifiers) {
    // Lifestyle factors can only increase risk by one level maximum
    if (modifiers.overallModifier >= 0.2 && category.name === "Around average risk") {
      return this.getCategory('MODERATE');
    }

    return category;
  }

  /**
   * Generate detailed risk explanation
   * @param {Object} result - Assessment result
   * @returns {string} Detailed explanation
   */
  generateExplanation(result) {
    let explanation = `Based on your family history and lifestyle factors, your breast cancer risk assessment is: ${result.category}.\n\n`;
    
    explanation += `Risk Range: ${result.riskRange}\n\n`;
    
    explanation += "Key Factors Considered:\n";
    
    if (result.riskFactors.firstDegreeRelatives.length > 0) {
      explanation += `• ${result.riskFactors.firstDegreeRelatives.length} first-degree relative(s) with breast cancer\n`;
    }
    
    if (result.riskFactors.secondDegreeRelatives.length > 0) {
      explanation += `• ${result.riskFactors.secondDegreeRelatives.length} second-degree relative(s) with breast cancer\n`;
    }
    
    if (result.riskFactors.earlyOnsetCases.length > 0) {
      explanation += `• Early onset cases (diagnosed before age 40)\n`;
    }
    
    if (result.riskFactors.brcaStatus === 'positive') {
      explanation += `• Known BRCA mutation in family\n`;
    }
    
    if (result.riskFactors.multipleCasesSameSide) {
      explanation += `• Multiple cases on same side of family\n`;
    }

    const activeModifiers = Object.values(result.lifestyleModifiers).filter(v => v === true).length;
    if (activeModifiers > 0) {
      explanation += `• ${activeModifiers} lifestyle risk factor(s)\n`;
    }

    return explanation;
  }
}

export default BreastCancerRiskAssessment;
