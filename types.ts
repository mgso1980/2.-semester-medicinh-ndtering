
export interface CaseStudy {
  id: number;
  title: string;
  scenario: string;
  reflectionQuestion: string;
  tags: string[];
}

export interface ReflectionResponse {
  caseId: number;
  studentReflection: string;
  aiFeedback?: string;
  timestamp: string;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  CASE_DETAIL = 'CASE_DETAIL',
  RESOURCES = 'RESOURCES',
  QUIZ = 'QUIZ'
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
