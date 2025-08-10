// Manual test for margin calculator functionality
import {
  calculateMargin,
  validateCalculationInput,
  formatCurrency,
  formatPercentage,
} from '../utils/marginCalculations';
import { MarginCalculationInput } from '../types/marginCalculator';

// Test data
const testCases: Array<{
  name: string;
  input: MarginCalculationInput;
  expectedResult?: Partial<{
    finalCompany: number;
    profitMargin: number;
    candidateRate: number;
  }>;
}> = [
  {
    name: 'W2 Hourly - Standard Case',
    input: {
      clientBudget: 120,
      vendorCommissionPercent: 3,
      companySplitPercent: 80,
      employerTaxPercent: 10,
      overheadFee: 5,
      recruiterCommissionFlat: 300,
      sourceType: 'internal-recruiter',
      engagementType: 'w2-hourly',
      hasReferralFee: false,
      requiresApproval: false,
    },
    expectedResult: {
      // Available: 120 - (120 * 0.03) = 116.4
      // CompanyShare: 116.4 * 0.8 = 93.12
      // EmployerTax: 93.12 * 0.1 = 9.312
      // NetMargin: 93.12 - 9.312 - 5 = 78.808
      // FinalCompany: 78.808 - 300 = -221.192 (negative margin)
      finalCompany: -221.192,
      candidateRate: 23.28, // 116.4 - 93.12
    },
  },
  {
    name: 'W2 Salary - Standard Case',
    input: {
      clientBudget: 120,
      vendorCommissionPercent: 3,
      employerTaxPercent: 10,
      overheadFee: 5,
      recruiterCommissionFlat: 300,
      sourceType: 'internal-recruiter',
      engagementType: 'w2-salary',
      annualSalary: 150000,
      hasReferralFee: false,
      requiresApproval: false,
    },
    expectedResult: {
      // HourlySalary: 150000 / 2080 = 72.115
      // EmployerTax: 72.115 * 0.1 = 7.2115
      // CompanyCost: 72.115 + 7.2115 = 79.3265
      // Available: 120 - (120 * 0.03) = 116.4
      // NetMargin: 116.4 - 79.3265 - 5 = 32.0735
      // FinalCompany: 32.0735 - 300 = -267.9265 (negative margin)
      finalCompany: -267.9265,
    },
  },
  {
    name: '1099 Contractor - Standard Case',
    input: {
      clientBudget: 120,
      vendorCommissionPercent: 3,
      companySplitPercent: 80,
      employerTaxPercent: 10,
      overheadFee: 5,
      recruiterCommissionFlat: 300,
      sourceType: 'internal-recruiter',
      engagementType: '1099',
      hasReferralFee: false,
      requiresApproval: false,
    },
    expectedResult: {
      // Available: 120 - (120 * 0.03) = 116.4
      // CompanyShare: 116.4 * 0.8 = 93.12
      // EmployerTax: 0 (no employer tax for 1099)
      // NetMargin: 93.12 - 0 - 5 = 88.12
      // FinalCompany: 88.12 - 300 = -211.88 (negative margin)
      finalCompany: -211.88,
      candidateRate: 23.28, // 116.4 - 93.12
    },
  },
  {
    name: 'C2C - High Budget Case',
    input: {
      clientBudget: 200,
      vendorCommissionPercent: 3,
      companySplitPercent: 75,
      employerTaxPercent: 10,
      overheadFee: 7,
      recruiterCommissionFlat: 0, // Sub-vendor, no recruiter commission
      sourceType: 'sub-vendor',
      engagementType: 'c2c',
      hasReferralFee: false,
      requiresApproval: false,
    },
    expectedResult: {
      // Available: 200 - (200 * 0.03) = 194
      // CompanyShare: 194 * 0.75 = 145.5
      // EmployerTax: 0 (no employer tax for C2C)
      // NetMargin: 145.5 - 0 - 7 = 138.5
      // FinalCompany: 138.5 - 0 = 138.5 (positive margin!)
      finalCompany: 138.5,
      candidateRate: 48.5, // 194 - 145.5
    },
  },
];

// Run tests
export function runMarginCalculatorTests() {
  console.log('🧪 Running Margin Calculator Tests...\n');
  
  let passedTests = 0;
  let totalTests = testCases.length;
  
  testCases.forEach((testCase, index) => {
    console.log(`Test ${index + 1}: ${testCase.name}`);
    console.log('Input:', testCase.input);
    
    // Validate input
    const validationErrors = validateCalculationInput(testCase.input);
    if (validationErrors.length > 0) {
      console.log('❌ Validation Errors:', validationErrors);
      return;
    }
    
    try {
      // Calculate result
      const result = calculateMargin(testCase.input);
      console.log('Result:', {
        clientBudget: formatCurrency(result.clientBudget),
        vendorFee: formatCurrency(result.vendorFee),
        available: formatCurrency(result.available),
        companyShare: formatCurrency(result.companyShare),
        employerTax: formatCurrency(result.employerTax),
        netMargin: formatCurrency(result.netMargin),
        finalCompany: formatCurrency(result.finalCompany),
        candidateRate: formatCurrency(result.candidateRate),
        profitMargin: formatPercentage(result.profitMargin),
      });
      
      // Check expected results
      if (testCase.expectedResult) {
        let testPassed = true;
        
        if (testCase.expectedResult.finalCompany !== undefined) {
          const expectedFinal = testCase.expectedResult.finalCompany;
          const actualFinal = Math.round(result.finalCompany * 1000) / 1000; // Round to 3 decimal places
          if (Math.abs(actualFinal - expectedFinal) > 0.01) {
            console.log(`❌ Final Company mismatch: expected ${expectedFinal}, got ${actualFinal}`);
            testPassed = false;
          }
        }
        
        if (testCase.expectedResult.candidateRate !== undefined) {
          const expectedRate = testCase.expectedResult.candidateRate;
          const actualRate = Math.round(result.candidateRate * 100) / 100; // Round to 2 decimal places
          if (Math.abs(actualRate - expectedRate) > 0.01) {
            console.log(`❌ Candidate Rate mismatch: expected ${expectedRate}, got ${actualRate}`);
            testPassed = false;
          }
        }
        
        if (testPassed) {
          console.log('✅ Test passed!');
          passedTests++;
        }
      } else {
        console.log('✅ Calculation completed successfully!');
        passedTests++;
      }
      
    } catch (error) {
      console.log('❌ Error:', error);
    }
    
    console.log('---\n');
  });
  
  console.log(`📊 Test Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed!');
  } else {
    console.log('⚠️ Some tests failed. Please review the calculations.');
  }
  
  return { passed: passedTests, total: totalTests };
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).runMarginCalculatorTests = runMarginCalculatorTests;
}
