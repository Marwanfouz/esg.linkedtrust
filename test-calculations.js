// Test script to verify ESG calculation fixes
import { ESGCalculationEngine } from './src/services/esgCalculations.js';
import mockData from './src/data/mockData.json' assert { type: 'json' };

// Filter Amazon claims
const amazonClaims = mockData.claims.filter(claim => 
  claim.subject === 'Amazon Inc. (AMZN)'
);

console.log('=== Amazon ESG Calculation Test ===');
console.log('Amazon claims found:', amazonClaims.length);

// Calculate ESG metrics
const esgMetrics = ESGCalculationEngine.calculateESGMetrics(amazonClaims);

console.log('\n=== ESG Pillar Scores ===');
console.log('Environmental:', esgMetrics.environmentalScore + '%');
console.log('Social:', esgMetrics.socialScore + '%');  
console.log('Governance:', esgMetrics.governanceScore + '%');

console.log('\n=== Overall Score ===');
console.log('Overall Percentage:', esgMetrics.overallPercentage + '%');
console.log('Overall Stars:', esgMetrics.overallStars);
console.log('Overall Grade:', esgMetrics.overallGrade);

console.log('\n=== Validation Metrics ===');
console.log('Total Validations:', esgMetrics.totalValidations);
console.log('Endorsements:', esgMetrics.endorsements);
console.log('Endorsement Rate:', esgMetrics.endorsementRate + '%');
console.log('Average Rating:', esgMetrics.averageRating.toFixed(2));
console.log('Consensus:', esgMetrics.consensusPercentage + '%');

// Get calculation breakdown
const breakdown = ESGCalculationEngine.getCalculationBreakdown(amazonClaims);

console.log('\n=== Calculation Breakdown ===');
console.log('Environmental contribution:', breakdown.pillarBreakdown.environmental.weightedContribution);
console.log('Social contribution:', breakdown.pillarBreakdown.social.weightedContribution);  
console.log('Governance contribution:', breakdown.pillarBreakdown.governance.weightedContribution);
console.log('Total weighted sum:', breakdown.overallCalculation.weightedSum);

console.log('\n=== Validation Breakdown ===');
console.log('Rating distribution:', breakdown.validationBreakdown.ratingDistribution);

// Expected results verification
console.log('\n=== Expected Results Verification ===');
console.log('Expected Environmental: 50% - Actual:', esgMetrics.environmentalScore + '%');
console.log('Expected Social: 80% - Actual:', esgMetrics.socialScore + '%');
console.log('Expected Governance: 67% - Actual:', esgMetrics.governanceScore + '%');
console.log('Expected Overall: 64.1% - Actual:', esgMetrics.overallPercentage + '%');

const expectedOverall = (50 * 0.4) + (80 * 0.3) + (67 * 0.3);
console.log('Manual calculation: (50×0.4) + (80×0.3) + (67×0.3) =', expectedOverall + '%');
