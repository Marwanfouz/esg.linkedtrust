#!/usr/bin/env node

/**
 * Test script to validate ESG score synchronization between dashboard and company details
 * Run this to verify that both components calculate the same scores
 */

const path = require('path');
const fs = require('fs');

// Read the mock data
const mockDataPath = path.join(__dirname, 'src/data/mockData.json');
const mockData = JSON.parse(fs.readFileSync(mockDataPath, 'utf8'));

console.log('🔍 ESG Score Synchronization Test');
console.log('==================================\n');

// Extract companies with esg-overall scores
const overallClaims = mockData.claims.filter(claim => 
  claim.aspect === 'esg-overall' && claim.score !== undefined
);

console.log('📊 Individual Company ESG Scores (from mock data):');
console.log('---------------------------------------------------');

let totalPercentage = 0;
let aGradeCount = 0;

overallClaims.forEach(claim => {
  const percentage = Math.round(((claim.score + 1) / 2) * 100);
  const isAGrade = percentage >= 85;
  
  if (isAGrade) aGradeCount++;
  totalPercentage += percentage;
  
  console.log(`${claim.subject}: ${percentage}% (score: ${claim.score}) ${isAGrade ? '⭐ A-grade' : ''}`);
});

const avgPercentage = Math.round(totalPercentage / overallClaims.length);

console.log('\n📈 Expected Dashboard Metrics:');
console.log('------------------------------');
console.log(`Total Companies: ${overallClaims.length}`);
console.log(`Average ESG Score: ${avgPercentage}%`);
console.log(`A-Grade Companies (85%+): ${aGradeCount}`);

console.log('\n📋 Individual Company Breakdown:');
console.log('--------------------------------');
overallClaims.forEach(claim => {
  const percentage = Math.round(((claim.score + 1) / 2) * 100);
  let grade = '';
  
  if (percentage >= 95) grade = 'A+';
  else if (percentage >= 90) grade = 'A';
  else if (percentage >= 85) grade = 'A-';
  else if (percentage >= 80) grade = 'B+';
  else if (percentage >= 75) grade = 'B';
  else if (percentage >= 70) grade = 'B-';
  else if (percentage >= 65) grade = 'C+';
  else if (percentage >= 60) grade = 'C';
  else if (percentage >= 55) grade = 'C-';
  else if (percentage >= 50) grade = 'D+';
  else if (percentage >= 45) grade = 'D';
  else if (percentage >= 40) grade = 'D-';
  else grade = 'F';
  
  const stars = percentage >= 90 ? 5 : percentage >= 75 ? 4 : percentage >= 60 ? 3 : percentage >= 40 ? 2 : 1;
  
  console.log(`• ${claim.subject}:`);
  console.log(`  Score: ${claim.score} → ${percentage}% → Grade: ${grade} → Stars: ${stars}`);
});

console.log('\n✅ Test completed! Compare these values with the dashboard when running the app.');
console.log('The dashboard should show:');
console.log(`- Average ESG Score: ${avgPercentage}%`);
console.log(`- A-Grade Companies: ${aGradeCount}`);
console.log(`- Total Companies: ${overallClaims.length}`);

// Check for Amazon's multiple claims
const amazonClaims = mockData.claims.filter(claim => 
  claim.subject === 'Amazon Inc. (AMZN)'
);

console.log('\n🔍 Amazon Multi-Claim Analysis:');
console.log('-------------------------------');
console.log(`Amazon has ${amazonClaims.length} claims:`);
amazonClaims.forEach(claim => {
  const percentage = claim.score ? Math.round(((claim.score + 1) / 2) * 100) : 'N/A';
  console.log(`• ${claim.aspect}: ${percentage}% (score: ${claim.score})`);
});

console.log('\nThe ESG calculation engine should aggregate these into a single company score.');
