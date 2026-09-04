export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type DifficultyFilter = Difficulty | "All";

export interface Topic {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  difficulty: Difficulty;
  challengeTypes?: string[];
  interviewType?: "Behavioral" | "HR" | "Technical" | "Case" | "Communication";
}

export interface Category {
  id: string;
  name: string;
  description: string;
  subcategories: string[];
}

export type PracticeMode = "quick-think" | "understand-explain" | "interview";

export interface PracticeSession {
  id: string;
  date: string; // ISO date
  mode: PracticeMode;
  category: string;
  subcategory: string;
  topic: string;
  difficulty?: Difficulty;
  researchTime?: number; // seconds
  preparationTime?: number; // seconds
  explanationTime: number; // seconds
  confidence: number; // 1 - 5
  knowledgeGaps: string[];
  blindSpotNotes?: string;
  interviewReview?: {
    situation?: boolean;
    task?: boolean;
    action?: boolean;
    result?: boolean;
    specificExample?: boolean;
    clearOutcome?: boolean;
    personalContribution?: boolean;
    whatYouLearned?: boolean;
  };
}

export interface UserSettings {
  theme: "system" | "light" | "dark";
  soundEnabled: boolean;
}

export interface CustomTopic {
  id: string;
  title: string;
  createdAt: string;
}

export interface CustomCollection {
  id: string;
  name: string;
  topics: CustomTopic[];
  createdAt: string;
  updatedAt: string;
}
