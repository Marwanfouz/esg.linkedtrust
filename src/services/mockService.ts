import { Claim, Node, CompanyCardData } from '../types';
import mockData from '../data/mockData.json';
import { calculateGrade } from '../theme/theme';

// Mock service to simulate API calls during development
export const mockService = {
  // Simulate network delay
  delay: (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms)),

  // Get all claims
  getClaims: async (): Promise<Claim[]> => {
    await mockService.delay();
    return mockData.claims.map(claim => ({
      ...claim,
      effectiveDate: claim.effectiveDate ? new Date(claim.effectiveDate) : undefined,
      dateObserved: claim.dateObserved ? new Date(claim.dateObserved) : undefined,
      createdAt: new Date(claim.createdAt),
      lastUpdatedAt: new Date(claim.lastUpdatedAt),
    }));
  },

  // Get claim by ID
  getClaimById: async (id: number): Promise<Claim | null> => {
    await mockService.delay();
    const claim = mockData.claims.find(c => c.id === id);
    if (!claim) return null;
    
    return {
      ...claim,
      effectiveDate: claim.effectiveDate ? new Date(claim.effectiveDate) : undefined,
      dateObserved: claim.dateObserved ? new Date(claim.dateObserved) : undefined,
      createdAt: new Date(claim.createdAt),
      lastUpdatedAt: new Date(claim.lastUpdatedAt),
    };
  },

  // Get claims for a specific company
  getCompanyClaims: async (subject: string): Promise<Claim[]> => {
    await mockService.delay();
    const claims = mockData.claims
      .filter(claim => claim.subject.toLowerCase().includes(subject.toLowerCase()))
      .map(claim => ({
        ...claim,
        effectiveDate: claim.effectiveDate ? new Date(claim.effectiveDate) : undefined,
        dateObserved: claim.dateObserved ? new Date(claim.dateObserved) : undefined,
        createdAt: new Date(claim.createdAt),
        lastUpdatedAt: new Date(claim.lastUpdatedAt),
      }));
    
    return claims;
  },

  // Get only rated claims (for dashboard)
  getRatedClaims: async (): Promise<Claim[]> => {
    await mockService.delay();
    return mockData.claims
      .filter(claim => claim.claim === 'rated')
      .map(claim => ({
        ...claim,
        effectiveDate: claim.effectiveDate ? new Date(claim.effectiveDate) : undefined,
        dateObserved: claim.dateObserved ? new Date(claim.dateObserved) : undefined,
        createdAt: new Date(claim.createdAt),
        lastUpdatedAt: new Date(claim.lastUpdatedAt),
      }));
  },

  // Get company card data (transformed for dashboard)
  getCompanyCardData: async (): Promise<CompanyCardData[]> => {
    await mockService.delay();
    return mockData.claims
      .filter(claim => claim.claim === 'rated' && claim.score !== undefined && claim.stars !== undefined)
      .map(claim => ({
        id: claim.id,
        subject: claim.subject,
        stars: claim.stars!,
        score: claim.score!,
        grade: calculateGrade(claim.score!),
      }));
  },

  // Get all nodes
  getNodes: async (): Promise<Node[]> => {
    await mockService.delay();
    return mockData.nodes;
  },

  // Get node by ID
  getNodeById: async (id: number): Promise<Node | null> => {
    await mockService.delay();
    return mockData.nodes.find(n => n.id === id) || null;
  },

  // Get company nodes only
  getCompanyNodes: async (): Promise<Node[]> => {
    await mockService.delay();
    return mockData.nodes.filter(node => node.entType === 'ORGANIZATION');
  },

  // Search claims by query
  searchClaims: async (query: string): Promise<Claim[]> => {
    await mockService.delay();
    const searchTerm = query.toLowerCase();
    return mockData.claims
      .filter(claim => 
        claim.subject.toLowerCase().includes(searchTerm) ||
        claim.statement?.toLowerCase().includes(searchTerm) ||
        claim.author?.toLowerCase().includes(searchTerm)
      )
      .map(claim => ({
        ...claim,
        effectiveDate: claim.effectiveDate ? new Date(claim.effectiveDate) : undefined,
        dateObserved: claim.dateObserved ? new Date(claim.dateObserved) : undefined,
        createdAt: new Date(claim.createdAt),
        lastUpdatedAt: new Date(claim.lastUpdatedAt),
      }));
  },

  // Search nodes by query
  searchNodes: async (query: string): Promise<Node[]> => {
    await mockService.delay();
    const searchTerm = query.toLowerCase();
    return mockData.nodes.filter(node => 
      node.name.toLowerCase().includes(searchTerm) ||
      node.descrip.toLowerCase().includes(searchTerm)
    );
  },
};

export default mockService;
