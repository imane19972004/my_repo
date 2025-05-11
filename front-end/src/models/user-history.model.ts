export interface UserHistory {
  id?: string;
  userId?: string;
  exerciceId: string;
  date: string;
  exerciceName: string;
  success: number; // Number of successful actions
  failure: number; // Number of failed actions
  timeExpired?: boolean; // Indique si le temps a expiré
}
