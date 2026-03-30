// Type definitions for Demo Tracker

export type Industry =
  | 'Finance'
  | 'HR'
  | 'Retail'
  | 'Healthcare'
  | 'Legal'
  | 'Manufacturing'
  | 'Education'
  | 'Real Estate'
  | 'Insurance'
  | 'Other';

export type DemoStatus = 'Ready' | 'In Progress' | 'Not Started';

export type Frequency = 'One-time' | 'Monthly' | 'Annual' | 'Per Run';

export interface UseCase {
  Id: number;
  Title: string;
  Industry: Industry[];
  ProblemStatement: string;
  SolutionDescription: string;
  KeyBenefits: string | string[]; // Stored as JSON string in DB, parsed to array in frontend
  DemoStatus: DemoStatus;
  DemoUrl?: string;
  DemoAccessInstructions?: string;
  CostingNotes: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface CostComponent {
  Id: number;
  UseCaseId: number;
  Label: string;
  UnitCost: number;
  Quantity: number;
  Unit: string;
  Frequency: Frequency;
  Notes?: string;
  CreatedAt?: string;
  UpdatedAt?: string;
}

export interface DashboardStats {
  totalUseCases: number;
  byStatus: {
    Ready: number;
    'In Progress': number;
    'Not Started': number;
  };
  byIndustry: {
    [key in Industry]?: number;
  };
}

export interface NoCodBResponse<T> {
  list: T[];
  pageInfo?: {
    totalRows: number;
    page: number;
    pageSize: number;
  };
}
