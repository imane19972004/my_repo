export interface Item {
  name: string;
  description: string;
  imagePath: string;
  category: string;
   // Ajouter cette propriété
  helpText?: string; // Description de l'objet pour l'aide
}

