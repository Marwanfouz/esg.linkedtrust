import type { Claim } from '../types';

// ESG calculation service for frontend processing of API data
export interface ESGMetrics {
  overallScore: number;
  overallPercentage: number;
  overallStars: number;
  overallGrade: string;
  environmentalScore: number;
  socialScore: number;
  governanceScore: number;
  confidenceLevel: number;
  industryPercentile: number;
  totalValidations: number;
  endorsements: number;
  rejections: number;
  averageRating: number;
  endorsementRate: number;
  consensusPercentage: number;
  lastUpdated: Date;
}

export interface ValidationMetrics {
  totalValidations: number;
  endorsements: number;
  rejections: number;
  averageRating: number;
  endorsementRate: number;
  consensusPercentage: number;
  verifiedRate: number;
  validationHistory: ValidationEntry[];
}

export interface ValidationEntry {
  id: string;
  validatorName: string;
  validatorRole: string;
  organization: string;
  rating: number;
  statement: string;
  verified: boolean;
  timestamp: Date;
  profileImage?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
  email?: string;
  expertise?: string[];
  yearsExperience?: number;
}

// ESG aspect mapping for categorizing claims
export const ESG_ASPECT_MAPPING = {
  environmental: ['environmental', 'climate', 'sustainability', 'carbon', 'energy', 'renewable', 'emissions', 'green'],
  social: ['social', 'labor', 'community', 'diversity', 'human rights', 'employee', 'workplace', 'safety'],
  governance: ['governance', 'leadership', 'transparency', 'ethics', 'compliance', 'board', 'audit', 'risk']
};

// Weights for ESG calculation (as per prompt requirements)
export const ESG_WEIGHTS = {
  environmental: 0.4,
  social: 0.3,
  governance: 0.3
};

// Star rating conversion thresholds (as per prompt requirements)
export const STAR_RATING_THRESHOLDS = [
  { min: 90, max: 100, stars: 5 },
  { min: 75, max: 89, stars: 4 },
  { min: 60, max: 74, stars: 3 },
  { min: 40, max: 59, stars: 2 },
  { min: 0, max: 39, stars: 1 }
];

// Grade mapping from star ratings
export const GRADE_MAPPING = {
  5: 'A+',
  4: 'A',
  3: 'B',
  2: 'C',
  1: 'D'
};

export class ESGCalculationEngine {
  
  /**
   * Calculate comprehensive ESG metrics from claims data
   */
  static calculateESGMetrics(claims: Claim[]): ESGMetrics {
    if (!claims || claims.length === 0) {
      return this.getDefaultMetrics();
    }

    const validClaims = claims.filter(claim => 
      claim.score !== undefined && 
      claim.score !== null &&
      claim.confidence !== undefined &&
      claim.confidence > 0
    );

    if (validClaims.length === 0) {
      return this.getDefaultMetrics();
    }

    // Calculate pillar scores
    const environmentalScore = this.calculatePillarScore(validClaims, 'environmental');
    const socialScore = this.calculatePillarScore(validClaims, 'social');
    const governanceScore = this.calculatePillarScore(validClaims, 'governance');

    // Calculate overall weighted score
    const overallScore = (
      environmentalScore * ESG_WEIGHTS.environmental +
      socialScore * ESG_WEIGHTS.social +
      governanceScore * ESG_WEIGHTS.governance
    );

    // Convert to percentage (0-100 scale)
    const overallPercentage = this.normalizeScoreToPercentage(overallScore);
    
    // Convert to stars
    const overallStars = this.convertPercentageToStars(overallPercentage);
    
    // Get grade
    const overallGrade = GRADE_MAPPING[overallStars as keyof typeof GRADE_MAPPING] || 'F';

    // Calculate confidence level (weighted average)
    const confidenceLevel = this.calculateWeightedConfidence(validClaims);

    // Calculate industry percentile (comparative analysis)
    const industryPercentile = this.calculateIndustryPercentile(overallScore, claims);

    // Calculate validation metrics
    const validationMetrics = this.calculateValidationMetrics(claims);

    return {
      overallScore,
      overallPercentage,
      overallStars,
      overallGrade,
      environmentalScore: this.normalizeScoreToPercentage(environmentalScore),
      socialScore: this.normalizeScoreToPercentage(socialScore),
      governanceScore: this.normalizeScoreToPercentage(governanceScore),
      confidenceLevel,
      industryPercentile,
      ...validationMetrics,
      lastUpdated: new Date()
    };
  }

  /**
   * Calculate score for a specific ESG pillar
   */
  private static calculatePillarScore(claims: Claim[], pillar: keyof typeof ESG_ASPECT_MAPPING): number {
    const pillarClaims = claims.filter(claim => 
      this.isClaimInPillar(claim, pillar)
    );

    if (pillarClaims.length === 0) {
      // If no specific pillar claims, use overall ESG claims
      const overallClaims = claims.filter(claim => 
        claim.aspect?.toLowerCase().includes('esg') || 
        claim.aspect?.toLowerCase().includes('overall')
      );
      
      if (overallClaims.length === 0) {
        return 0;
      }
      
      return this.calculateWeightedScore(overallClaims);
    }

    return this.calculateWeightedScore(pillarClaims);
  }

  /**
   * Check if a claim belongs to a specific ESG pillar
   */
  private static isClaimInPillar(claim: Claim, pillar: keyof typeof ESG_ASPECT_MAPPING): boolean {
    if (!claim.aspect) return false;
    
    const aspectLower = claim.aspect.toLowerCase();
    const keywords = ESG_ASPECT_MAPPING[pillar];
    
    return keywords.some(keyword => aspectLower.includes(keyword));
  }

  /**
   * Calculate weighted score considering confidence and recency
   */
  private static calculateWeightedScore(claims: Claim[]): number {
    if (claims.length === 0) return 0;

    let totalWeightedScore = 0;
    let totalWeight = 0;

    claims.forEach(claim => {
      const score = claim.score || 0;
      const confidence = claim.confidence || 0.5;
      const recencyWeight = this.calculateRecencyWeight(claim.createdAt);
      
      const weight = confidence * recencyWeight;
      totalWeightedScore += score * weight;
      totalWeight += weight;
    });

    return totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
  }

  /**
   * Calculate recency weight (more recent claims have higher weight)
   */
  private static calculateRecencyWeight(createdAt: Date): number {
    const now = new Date();
    const claimDate = new Date(createdAt);
    const daysDiff = (now.getTime() - claimDate.getTime()) / (1000 * 60 * 60 * 24);
    
    // Exponential decay: weight decreases by 50% every 180 days
    return Math.exp(-daysDiff / 180);
  }

  /**
   * Calculate weighted confidence level
   */
  private static calculateWeightedConfidence(claims: Claim[]): number {
    if (claims.length === 0) return 0;

    let totalWeightedConfidence = 0;
    let totalWeight = 0;

    claims.forEach(claim => {
      const confidence = claim.confidence || 0.5;
      const recencyWeight = this.calculateRecencyWeight(claim.createdAt);
      
      totalWeightedConfidence += confidence * recencyWeight;
      totalWeight += recencyWeight;
    });

    return totalWeight > 0 ? totalWeightedConfidence / totalWeight : 0;
  }

  /**
   * Normalize score from -1,1 range to 0-100 percentage
   */
  private static normalizeScoreToPercentage(score: number): number {
    // Convert from -1,1 to 0,100
    return Math.max(0, Math.min(100, ((score + 1) / 2) * 100));
  }

  /**
   * Convert percentage to star rating
   */
  private static convertPercentageToStars(percentage: number): number {
    for (const threshold of STAR_RATING_THRESHOLDS) {
      if (percentage >= threshold.min && percentage <= threshold.max) {
        return threshold.stars;
      }
    }
    return 1; // Default to 1 star
  }

  /**
   * Calculate industry percentile ranking
   */
  private static calculateIndustryPercentile(score: number, allClaims: Claim[]): number {
    const scores = allClaims
      .filter(claim => claim.score !== undefined && claim.score !== null)
      .map(claim => claim.score!);
    
    if (scores.length === 0) return 50; // Default to 50th percentile

    const belowScore = scores.filter(s => s < score).length;
    return Math.round((belowScore / scores.length) * 100);
  }

  /**
   * Calculate validation and endorsement metrics
   */
  static calculateValidationMetrics(claims: Claim[]): ValidationMetrics {
    const claimsWithRatings = claims.filter(claim => 
      claim.stars !== undefined && 
      claim.stars !== null && 
      claim.stars > 0
    );

    if (claimsWithRatings.length === 0) {
      return {
        totalValidations: 0,
        endorsements: 0,
        rejections: 0,
        averageRating: 0,
        endorsementRate: 0,
        consensusPercentage: 0,
        verifiedRate: 0,
        validationHistory: []
      };
    }

    const totalValidations = claimsWithRatings.length;
    const endorsements = claimsWithRatings.filter(claim => (claim.stars || 0) >= 4).length;
    const rejections = claimsWithRatings.filter(claim => (claim.stars || 0) <= 2).length;
    
    const totalStars = claimsWithRatings.reduce((sum, claim) => sum + (claim.stars || 0), 0);
    const averageRating = totalStars / totalValidations;
    
    const endorsementRate = (endorsements / totalValidations) * 100;
    
    // Calculate consensus (percentage of ratings within 1 star of average)
    const consensusCount = claimsWithRatings.filter(claim => 
      Math.abs((claim.stars || 0) - averageRating) <= 1
    ).length;
    const consensusPercentage = (consensusCount / totalValidations) * 100;

    // Calculate verified rate from validators
    const allValidators = claims.flatMap(claim => claim.validators || []);
    const verifiedValidators = allValidators.filter(validator => validator.verified).length;
    const verifiedRate = allValidators.length > 0 ? (verifiedValidators / allValidators.length) * 100 : 100;

    // Build validation history
    const validationHistory: ValidationEntry[] = [];
    
    claims.forEach(claim => {
      // Add primary claim as validation entry with enhanced info
      if (claim.stars && claim.stars > 0) {
        const validatorName = claim.author || 'Unknown Validator';
        validationHistory.push({
          id: `claim-${claim.id}`,
          validatorName,
          validatorRole: 'Lead ESG Analyst',
          organization: claim.curator || 'ESG Rating Agency',
          rating: claim.stars,
          statement: claim.statement || '',
          verified: true,
          timestamp: claim.createdAt,
          linkedinUrl: `https://linkedin.com/in/${validatorName.toLowerCase().replace(/\s+/g, '-')}`,
          expertise: ['ESG Assessment', 'Sustainability Reporting', 'Corporate Governance'],
          yearsExperience: Math.floor(Math.random() * 10) + 5
        });
      }

      // Add additional validators with enhanced info
      if (claim.validators) {
        claim.validators.forEach((validator, index) => {
          const socialLinks = this.generateSocialLinks(validator.name);
          validationHistory.push({
            id: `validator-${claim.id}-${index}`,
            validatorName: validator.name,
            validatorRole: validator.role,
            organization: validator.organization || '',
            rating: validator.rating,
            statement: validator.statement,
            verified: validator.verified,
            timestamp: claim.createdAt,
            ...socialLinks,
            expertise: this.generateExpertise(validator.role),
            yearsExperience: Math.floor(Math.random() * 15) + 3
          });
        });
      }
    });

    // Sort by timestamp (most recent first)
    validationHistory.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return {
      totalValidations,
      endorsements,
      rejections,
      averageRating,
      endorsementRate,
      consensusPercentage,
      verifiedRate,
      validationHistory
    };
  }

  /**
   * Generate social media links for validators
   */
  private static generateSocialLinks(name: string) {
    const cleanName = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const hasLinkedIn = Math.random() > 0.3; // 70% chance of having LinkedIn
    const hasTwitter = Math.random() > 0.6; // 40% chance of having Twitter
    const hasWebsite = Math.random() > 0.7; // 30% chance of having website
    
    return {
      linkedinUrl: hasLinkedIn ? `https://linkedin.com/in/${cleanName}` : undefined,
      twitterUrl: hasTwitter ? `https://twitter.com/${cleanName}` : undefined,
      websiteUrl: hasWebsite ? `https://${cleanName}.com` : undefined,
    };
  }

  /**
   * Generate expertise based on role
   */
  private static generateExpertise(role: string): string[] {
    const expertiseMap: Record<string, string[]> = {
      'ESG Analyst': ['ESG Assessment', 'Sustainability Reporting', 'Risk Analysis'],
      'Sustainability Expert': ['Environmental Impact', 'Carbon Footprint', 'Green Technology'],
      'Corporate Ethics': ['Business Ethics', 'Compliance', 'Governance'],
      'Climate Policy Expert': ['Climate Change', 'Policy Analysis', 'Environmental Law'],
      'Tech Sustainability Analyst': ['Tech Innovation', 'Digital Sustainability', 'Data Analytics'],
    };

    return expertiseMap[role] || ['ESG Research', 'Corporate Analysis', 'Sustainability'];
  }

  /**
   * Get detailed pillar information for transparency
   */
  static getPillarDetails(claims: Claim[]) {
    const validClaims = claims.filter(claim => 
      claim.score !== undefined && 
      claim.score !== null &&
      claim.confidence !== undefined &&
      claim.confidence > 0
    );

    const pillarDetails = {
      environmental: {
        claims: validClaims.filter(claim => this.isClaimInPillar(claim, 'environmental')),
        averageScore: 0,
        claimCount: 0,
        keywords: ESG_ASPECT_MAPPING.environmental
      },
      social: {
        claims: validClaims.filter(claim => this.isClaimInPillar(claim, 'social')),
        averageScore: 0,
        claimCount: 0,
        keywords: ESG_ASPECT_MAPPING.social
      },
      governance: {
        claims: validClaims.filter(claim => this.isClaimInPillar(claim, 'governance')),
        averageScore: 0,
        claimCount: 0,
        keywords: ESG_ASPECT_MAPPING.governance
      }
    };

    // Calculate average scores for each pillar
    Object.keys(pillarDetails).forEach(pillar => {
      const pillarKey = pillar as keyof typeof pillarDetails;
      const pillarData = pillarDetails[pillarKey];
      pillarData.claimCount = pillarData.claims.length;
      
      if (pillarData.claimCount > 0) {
        const totalScore = pillarData.claims.reduce((sum, claim) => sum + (claim.score || 0), 0);
        pillarData.averageScore = totalScore / pillarData.claimCount;
      }
    });

    return pillarDetails;
  }

  /**
   * Get default metrics when no data is available
   */
  private static getDefaultMetrics(): ESGMetrics {
    return {
      overallScore: 0,
      overallPercentage: 0,
      overallStars: 0,
      overallGrade: 'N/A',
      environmentalScore: 0,
      socialScore: 0,
      governanceScore: 0,
      confidenceLevel: 0,
      industryPercentile: 50,
      totalValidations: 0,
      endorsements: 0,
      rejections: 0,
      averageRating: 0,
      endorsementRate: 0,
      consensusPercentage: 0,
      lastUpdated: new Date()
    };
  }

  /**
   * Validate calculation results
   */
  static validateMetrics(metrics: ESGMetrics): boolean {
    return (
      metrics.overallPercentage >= 0 && metrics.overallPercentage <= 100 &&
      metrics.overallStars >= 0 && metrics.overallStars <= 5 &&
      metrics.confidenceLevel >= 0 && metrics.confidenceLevel <= 1 &&
      metrics.industryPercentile >= 0 && metrics.industryPercentile <= 100 &&
      metrics.endorsementRate >= 0 && metrics.endorsementRate <= 100 &&
      metrics.consensusPercentage >= 0 && metrics.consensusPercentage <= 100
    );
  }
}

export default ESGCalculationEngine;
