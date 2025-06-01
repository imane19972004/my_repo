import { Item } from './item.model';
import { Category } from './category.model';

export interface PersonalExercice {
  id: string;
  userId: string; // ID de l'utilisateur propriétaire
  name: string;
  theme: string;
  description?: string;
  categories: Category[];
  items: Item[];
  isFromGeneral?: boolean; // Pour savoir si c'est assigné depuis la liste générale
  originalExerciceId?: string; // ID de l'exercice original si assigné
  createdAt: Date;
  modifiedAt: Date;
}