export interface Profile {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: 'pending' | 'completed';
  created_at: string;
  updated_at: string;
}