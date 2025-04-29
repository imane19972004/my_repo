export interface UserHistory {
  userId?: string;
  exerciceId: string;
  date: string;
  exerciceName: string;
  success: number; // Number of successful actions
  failure: number; // Number of failed actions
}
