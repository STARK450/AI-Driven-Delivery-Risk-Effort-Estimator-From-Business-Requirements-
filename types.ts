export interface AnalysisRequest {
  requirements: string;
  timelines: string;
  constraints: string;
}

export enum RiskLevel {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
  CRITICAL = "Critical"
}

export enum EffortLevel {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High"
}

export interface AnalysisResult {
  id: string;
  timestamp: number;
  projectTitle: string;
  understanding: string;
  functionalComplexity: string;
  nonFunctionalConstraints: string;
  riskLevel: RiskLevel;
  riskJustification: string;
  highRiskModules: string[];
  effort: EffortLevel;
  architectureRecommendation: string;
  techStack: string[];
  automationStrategy: string;
  qualityGates: string[];
  finalRecommendations: string[];
}

export interface HistoryItem {
  id: string;
  title: string;
  timestamp: number;
  riskLevel: RiskLevel;
}