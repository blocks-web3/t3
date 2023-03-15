export interface Proposal {
  title: string;
  content: string;
  hiring_number: number;
  required_token_number: number;
  required_total_days: number;
  impl_period_from_date: Date;
  impl_period_to_date: Date;
}

export interface Result {
  content: string;
}

export interface Project {
  project_id: string;
  project_member_address: string;
  contract_address: string;
  type: "pj" | "user";
  quarter: string;
  status: string;
  proposal?: Proposal;
  result?: Result;
  created_at: string;
  updated_at: string;
}

export interface Member {
  project_member_address: string;
  type: string;
  member_name: string;
  project_id: string;
  member_role: string;
}

export interface User {
  employee_id: string;
  wallet_address: string;
  employee_name: string;
}

export interface Comment {
  comment_id: string;
  project_id: string;
  author_name: string;
  author_address: string;
  comment: string;
  created_at: string;
  updated_at?: string;
}
