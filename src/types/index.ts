export type Grade = 'A' | 'B' | 'C' | 'D' | 'E';

export interface StudentInfo {
  studentId: string;
  name: string;
}

export interface ConceptItem {
  id: string;
  category: string;
  subElement: string;
  description: string;
  targetAnswer: string;
  keywords: string[];
  maxPoints: number;
  hint: string;
  explanation: string;
}

export interface CaseStudyItem {
  id: number;
  caseText: string;
  question: string;
  targetAnswer: string;
  keywords: string[];
  maxPoints: number;
  hint: string;
  explanation: string;
  isCreative?: boolean;
  isInvestigation?: boolean;
}

export interface AnswerItemFeedback {
  id: string | number;
  title: string;
  userAnswer: string;
  targetAnswer: string;
  isCorrect: boolean;
  score: number;
  maxScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  feedbackText: string;
}

export interface SubmissionResult {
  studentId: string;
  name: string;
  submittedAt: string;
  totalScore: number;
  grade: Grade;
  feedbacks: AnswerItemFeedback[];
  conceptAnswers: Record<string, string>;
  caseAnswers: Record<number, string>;
}
