// TypeScript interfaces matching the exact Prisma schema

export interface Validator {
  name: string;
  role: string;
  rating: number;
  statement: string;
  verified: boolean;
  organization: string;
}

export interface Claim {
  id: number;
  subject: string;              // Company Name/ISIN
  claim: string;               // "rated"
  object?: string;
  statement?: string;
  effectiveDate?: Date;
  
  // ClaimSource fields
  sourceURI?: string;
  howKnown?: 'FIRST_HAND' | 'SECOND_HAND' | 'WEB_DOCUMENT' | 'VERIFIED_LOGIN' | 'BLOCKCHAIN' | 'SIGNED_DOCUMENT' | 'PHYSICAL_DOCUMENT' | 'INTEGRATION' | 'RESEARCH' | 'OPINION' | 'OTHER';
  dateObserved?: Date;
  digestMultibase?: string;
  author?: string;
  curator?: string;
  
  // NormalizedRating fields
  aspect?: string;             // "esg-overall" | "esg-climate"
  score?: number;              // -1 to 1
  stars?: number;              // 0 to 5
  
  // Measure fields
  amt?: number;
  unit?: string;
  howMeasured?: string;
  
  // Sharing fields
  intendedAudience?: string;
  respondAt?: string;
  
  confidence?: number;
  
  // Issuer info
  issuerId?: string;
  issuerIdType?: 'DID' | 'ETH' | 'PUBKEY' | 'URL';
  claimAddress?: string;
  proof?: string;
  
  // Timestamps
  createdAt: Date;
  lastUpdatedAt: Date;
  
  // Validation & Endorsements
  validators?: Validator[];
}

export interface Node {
  id: number;
  nodeUri: string;
  name: string;
  entType: 'PERSON' | 'ORGANIZATION' | 'CLAIM' | 'IMPACT' | 'EVENT' | 'DOCUMENT' | 'PRODUCT' | 'PLACE' | 'UNKNOWN' | 'OTHER' | 'CREDENTIAL';
  descrip: string;
  image?: string;
  thumbnail?: string;
}

export interface User {
  id: number;
  email?: string;
  passwordHash?: string;
  name?: string;
  authType: 'PASSWORD' | 'OAUTH' | 'GITHUB';
  authProviderId?: string;
}

// Utility types for frontend
export interface CompanyCardData {
  id: number;
  subject: string;
  stars: number;
  score: number;
  grade: string;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ApiError {
  message: string;
  status?: number;
}
