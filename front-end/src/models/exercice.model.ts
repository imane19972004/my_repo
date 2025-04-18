import { Item } from './item.model';
import { Category } from './category.model';

export interface Exercice {
  name: string;
  items: Item[];
  categories: Category[];
  id?:String;
}
