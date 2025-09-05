// types/analysis.types.ts
export type PersonalityLevel = 'Low' | 'Medium' | 'High' | '낮음' | '보통' | '높음';

export interface PersonalityTrait {
  name: string;
  score: number;
  level: PersonalityLevel;
  description: string;
}

export type RedFlagType = 'warning' | 'minor' | 'major' | 'critical';

export interface RedFlag {
  type: RedFlagType;
  description: string;
  detected: boolean;
}

export interface EmotionalTone {
  positive: number;
  playful: number;
  serious: number;
}

export interface AnalysisResult {
  compatibilityScore: number;
  personalityTraits: PersonalityTrait[];
  attachmentStyle: string;
  attachmentDescription: string;
  emotionalTone: EmotionalTone;
  redFlags: RedFlag[];
  summary: string;
  id?: number;
}

export type SupportedLanguage = 'en' | 'ko' | 'pt' | 'ja' | 'es';

export interface LanguagePattern {
  chars: RegExp;
  words: RegExp;
  threshold: number;
}

export interface OCRResult {
  text: string;
  confidence: number;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface ChallengeTask {
  id: string;
  title: string;
  description: string;
  timeEstimate?: string;
  difficulty?: Difficulty;
  category?: string;
}

export interface ChallengeOutcome {
  title: string;
  description: string;
  metric?: string;
}

export interface ChallengeTip {
  title: string;
  description: string;
  isImportant?: boolean;
}

export type ChallengeCategory =
  | 'communication'
  | 'emotional_intelligence'
  | 'conflict_resolution'
  | 'intimacy'
  | 'trust';

export type ChallengeDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type ChallengeTimeframe = 'daily' | 'weekly' | 'monthly';

export interface Challenge {
  analysisId: number;
  title: string;
  description: string;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  timeframe: ChallengeTimeframe;
  tasks: ChallengeTask[];
  expectedOutcomes: ChallengeOutcome[];
  tips: ChallengeTip[];
  personalizedInsights: string;
}
