/**
 * Family History Data Model for Breast Cancer Risk Assessment
 * Defines the structure and validation for family history data
 */

export class FamilyHistoryModel {
  constructor() {
    this.relatives = {
      // First-degree relatives
      mother: null,
      sister: null,
      daughter: null,
      
      // Second-degree relatives
      maternalGrandmother: null,
      paternalGrandmother: null,
      maternalAunt: null,
      paternalAunt: null,
      cousin: null
    };
    
    this.lifestyle = {
      smoking: null,      // 'never', 'former', 'current', 'heavy'
      alcohol: null,      // 'none', 'light', 'moderate', 'heavy', or number of drinks/week
      bmi: null,         // Body Mass Index
      exercise: null,    // 'none', 'minimal', 'moderate', 'regular'
      hormoneTherapy: null // 'never', 'former', 'current'
    };
  }

  /**
   * Validate family history data
   * @param {Object} data - Family history data
   * @returns {Object} Validation result
   */
  static validateFamilyData(data) {
    const errors = [];
    const warnings = [];

    if (!data || typeof data !== 'object') {
      errors.push('Family data must be an object');
      return { valid: false, errors, warnings };
    }

    // Validate each relative
    Object.keys(data).forEach(relation => {
      const relativeData = data[relation];
      
      if (relativeData && relativeData.hasHadBreastCancer) {
        // Validate age at diagnosis
        if (relativeData.ageAtDiagnosis) {
          if (typeof relativeData.ageAtDiagnosis !== 'number' || 
              relativeData.ageAtDiagnosis < 15 || 
              relativeData.ageAtDiagnosis > 100) {
            errors.push(`Invalid age at diagnosis for ${relation}: ${relativeData.ageAtDiagnosis}`);
          }
        }

        // Validate genetic test status
        if (relativeData.geneticTest) {
          const validTests = ['unknown', 'negative', 'positive', 'BRCA_negative', 'BRCA_positive', 'not_tested'];
          if (!validTests.includes(relativeData.geneticTest)) {
            warnings.push(`Unknown genetic test status for ${relation}: ${relativeData.geneticTest}`);
          }
        }

        // Validate side of family
        if (relativeData.side) {
          const validSides = ['maternal', 'paternal', 'unknown'];
          if (!validSides.includes(relativeData.side)) {
            errors.push(`Invalid family side for ${relation}: ${relativeData.side}`);
          }
        }
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Sanitize and normalize family history data
   * @param {Object} data - Raw family data
   * @returns {Object} Sanitized data
   */
  static sanitizeFamilyData(data) {
    const sanitized = {};

    Object.keys(data).forEach(relation => {
      const relativeData = data[relation];
      
      if (relativeData) {
        sanitized[relation] = {
          hasHadBreastCancer: Boolean(relativeData.hasHadBreastCancer),
          ageAtDiagnosis: relativeData.ageAtDiagnosis ? Number(relativeData.ageAtDiagnosis) : null,
          geneticTest: relativeData.geneticTest || 'unknown',
          side: relativeData.side || 'unknown',
          yearOfDiagnosis: relativeData.yearOfDiagnosis ? Number(relativeData.yearOfDiagnosis) : null
        };
      }
    });

    return sanitized;
  }

  /**
   * Get relationship type (first-degree vs second-degree)
   * @param {string} relation - Relationship name
   * @returns {string} Relationship type
   */
  static getRelationshipType(relation) {
    const firstDegree = ['mother', 'sister', 'daughter'];
    const secondDegree = ['grandmother', 'aunt', 'cousin'];
    
    if (firstDegree.includes(relation)) return 'first-degree';
    if (secondDegree.includes(relation)) return 'second-degree';
    return 'unknown';
  }

  /**
   * Validate lifestyle data
   * @param {Object} data - Lifestyle data
   * @returns {Object} Validation result
   */
  static validateLifestyleData(data) {
    const errors = [];
    const warnings = [];

    if (!data || typeof data !== 'object') {
      errors.push('Lifestyle data must be an object');
      return { valid: false, errors, warnings };
    }

    // Validate BMI
    if (data.bmi !== null && data.bmi !== undefined) {
      if (typeof data.bmi !== 'number' || data.bmi < 10 || data.bmi > 50) {
        errors.push(`Invalid BMI: ${data.bmi}. Must be between 10 and 50.`);
      }
    }

    // Validate alcohol
    if (data.alcohol !== null && data.alcohol !== undefined) {
      if (typeof data.alcohol === 'number') {
        if (data.alcohol < 0 || data.alcohol > 100) {
          errors.push(`Invalid alcohol consumption: ${data.alcohol}. Must be between 0 and 100 drinks/week.`);
        }
      } else if (typeof data.alcohol === 'string') {
        const validLevels = ['none', 'light', 'moderate', 'heavy'];
        if (!validLevels.includes(data.alcohol)) {
          warnings.push(`Unknown alcohol level: ${data.alcohol}`);
        }
      }
    }

    // Validate smoking
    if (data.smoking) {
      const validSmoking = ['never', 'former', 'current', 'heavy'];
      if (!validSmoking.includes(data.smoking)) {
        warnings.push(`Unknown smoking status: ${data.smoking}`);
      }
    }

    // Validate exercise
    if (data.exercise) {
      const validExercise = ['none', 'minimal', 'moderate', 'regular'];
      if (!validExercise.includes(data.exercise)) {
        warnings.push(`Unknown exercise level: ${data.exercise}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Generate example family history data for testing
   * @returns {Object} Example data
   */
  static generateExampleData() {
    return {
      mother: {
        hasHadBreastCancer: true,
        ageAtDiagnosis: 52,
        geneticTest: 'unknown',
        side: 'maternal'
      },
      sister: {
        hasHadBreastCancer: false,
        geneticTest: 'unknown',
        side: 'maternal'
      },
      maternalGrandmother: {
        hasHadBreastCancer: true,
        ageAtDiagnosis: 68,
        geneticTest: 'not_tested',
        side: 'maternal'
      },
      lifestyle: {
        smoking: 'never',
        alcohol: 'light',
        bmi: 24.5,
        exercise: 'moderate',
        hormoneTherapy: 'never'
      }
    };
  }

  /**
   * Export data to JSON format
   * @param {Object} familyData - Family history data
   * @param {Object} lifestyleData - Lifestyle data
   * @returns {Object} Export-ready data
   */
  static exportData(familyData, lifestyleData) {
    return {
      timestamp: new Date().toISOString(),
      version: '1.0',
      familyHistory: familyData,
      lifestyle: lifestyleData,
      metadata: {
        totalRelatives: Object.keys(familyData).length,
        affectedRelatives: Object.values(familyData).filter(r => r && r.hasHadBreastCancer).length,
        firstDegreeAffected: Object.entries(familyData)
          .filter(([key, value]) => value && value.hasHadBreastCancer && 
            ['mother', 'sister', 'daughter'].includes(key)).length
      }
    };
  }
}

export default FamilyHistoryModel;
