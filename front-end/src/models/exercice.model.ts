import { Item } from './item.model';
import { Category } from './category.model';

// models/exercice.model.ts
export interface Exercice {
  id: string;
  name: string;
  theme:string;
  description?:string;
  categories: Category[];
  items: Item[];
}

