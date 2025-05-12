export interface UserHistory {
  userId?: string;
  exerciceId: string;
  date: string;
  exerciceName: string;
  success: number;
  failure: number;
  itemFailures?: { [itemName: string]: number };
}
