import { Item } from './item.model';
import { Category } from './category.model';

export interface Exercice {
  id:string;
  name: string;
  theme:string;
  description?:string;
  categories: Category[];
  items: Item[];
  assignedPatients?: string[]; // ID des patients auxquels cet exercice est assigné
}
