
export interface CriterionAnalysis {
  criterion: string;
  isFulfilled: boolean;
  explanation: string;
}

export interface AnalysisResult {
  achievedGrade: 'Distinction' | 'Merit' | 'Pass' | 'Not Achieved';
  criteriaAnalysis: CriterionAnalysis[];
  completionPercentage: number;
  suggestionsForImprovement: string;
  tipsAndTricks: string;
}
