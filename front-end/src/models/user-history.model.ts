import {Category} from "./category.model";
import {Item} from "./item.model";

export interface UserHistory {
  userId: string;
  category: Category;
  items: Item[]; // List of items with names and descriptions
  success: number; // Number of successful actions
  failure: number; // Number of failed actions
}
