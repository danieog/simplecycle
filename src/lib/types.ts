export interface Profile {
  id: string;
  full_name: string | null;
  mcat_score: number | null;
  gpa: number | null;
  created_at: string;
}

export type SchoolStatus =
  | "considering"
  | "applied"
  | "secondary_pending"
  | "interview"
  | "waitlist"
  | "accepted"
  | "rejected"
  | "withdrawn";

export type Residency = "in_state" | "out_state" | "unknown";

export interface School {
  id: string;
  user_id: string;
  name: string;
  city: string | null;
  state: string | null;
  in_state_tuition: number | null;
  out_state_tuition: number | null;
  residency: Residency;
  national_ranking: number | null;
  combined_program: string | null;
  pros: string | null;
  cons: string | null;
  alignment_notes: string | null;
  clubs_of_interest: string | null;
  status: SchoolStatus;
  user_ranking: number | null;
  primary_submitted_date: string | null;
  created_at: string;
}

export interface Secondary {
  id: string;
  school_id: string;
  user_id: string;
  received: boolean;
  date_received: string | null;
  date_submitted: string | null;
  deadline: string | null;
  created_at: string;
}

export interface ExamScore {
  id: string;
  user_id: string;
  exam_name: string;
  score: string;
  date_taken: string | null;
  created_at: string;
}

export interface Interview {
  id: string;
  school_id: string;
  user_id: string;
  invited: boolean;
  invite_date: string | null;
  interview_date: string | null;
  format: "in_person" | "virtual" | "mmi" | "traditional" | "unknown";
  notes: string | null;
  created_at: string;
}

export interface EssayPrompt {
  id: string;
  school_id: string | null;
  user_id: string;
  prompt: string;
  response: string | null;
  word_limit: number | null;
  ai_feedback: string | null;
  created_at: string;
}
