//The current exercices are saved in this mocked file exercices-data.ts

export const DEFAULT_EXERCISE_DATA = [
  {
    id: 'exo-1',
    name: 'Rangeons notre maison !',
    theme: 'Objets et pièces de la maison',
    description: 'Placez chaque objet dans la pièce où il appartient.',
    categories: [
      { name: 'Cuisine', description: 'Là où on prépare les repas', imagePath: 'cuisine.png' },
      { name: 'Salon', description: 'Pièce de détente et de convivialité', imagePath: 'salon.png' },
      { name: 'Salle de bain', description: 'Lieu d\'hygiène personnelle', imagePath: 'salle-de-bain.png' }
    ],
    items: [
      { name: 'Télécommande', description: 'Pour regarder des émissions', imagePath: 'telecommande.png', category: 'Salon' },
      { name: 'Brosse à dents', description: 'Pour l\'hygiène dentaire', imagePath: 'brosse-a-dent.png', category: 'Salle de bain' },
      { name: 'Couteau', description: 'Pour découper les aliments', imagePath: 'couteau.png', category: 'Cuisine' },
      { name: 'Canapé', description: 'Meuble pour s\'asseoir', imagePath: 'canape.png', category: 'Salon' },
      { name: 'Poèle', description: 'Pour faire cuire les aliments', imagePath: 'poele.png', category: 'Cuisine' },
      { name: 'Peigne', description: 'Pour se coiffer', imagePath: 'peigne.png', category: 'Salle de bain' },
      { name: 'Livre', description:'Se cultiver intéllectuellement', imagePath: 'livre.png', category: 'Salon'},
    ]
  }
];
