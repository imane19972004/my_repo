export interface User {
  id: string;
  firstName: string;
  lastName: string;
  age?: number;
  particularity?: string;
  role: string;
  assignedExercices?: string[]; // IDs des exercices assignés au patient
}
