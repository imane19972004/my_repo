export interface ExerciceAssignment {
  id: string;
  userId: string;
  exerciceId: string; // ID de l'exercice général
  assignedAt: Date;
  personalizedExerciceId?: string; // ID de l'exercice personnalisé créé
}