export interface HiringCategoryScore { score: number; max: number; evidence: string; }
export interface GitHubProject { name: string; url: string; description?: string; language?: string; stars: number; forks: number; updatedAt?: string; }
export interface HiringEvaluation {
  version: "hiring-agent-ui-v1";
  overallScore: number;
  scores: { openSource: HiringCategoryScore; selfProjects: HiringCategoryScore; production: HiringCategoryScore; technicalSkills: HiringCategoryScore; };
  bonusPoints: { total: number; breakdown: string };
  deductions: { total: number; reasons: string };
  keyStrengths: string[];
  areasForImprovement: string[];
  jobMatch: { score: number; matchedKeywords: string[]; missingKeywords: string[] };
  parsedResume: Record<string, unknown>;
  github: { username?: string; projects: GitHubProject[]; unavailableReason?: string };
  safety: { suspiciousContent: boolean; note: string };
  fairness: { githubOptional: true; note: string };
  metadata: { provider: string; model: string; analyzedAt: string; pageCount: number };
}

export interface Resume { id: string; companyName?: string; jobTitle?: string; imagePath: string; resumePath: string; feedback: Feedback; }

export interface Feedback {
  overallScore: number;
  ATS: { score: number; tips: { type: "good" | "improve"; tip: string; }[]; };
  toneAndStyle: { score: number; tips: { type: "good" | "improve"; tip: string; explanation: string; }[]; };
  content: { score: number; tips: { type: "good" | "improve"; tip: string; explanation: string; }[]; };
  structure: { score: number; tips: { type: "good" | "improve"; tip: string; explanation: string; }[]; };
  skills: { score: number; tips: { type: "good" | "improve"; tip: string; explanation: string; }[]; };
  hiringEvaluation?: HiringEvaluation;
}
