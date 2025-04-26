import { Component, OnInit } from '@angular/core';
import { ExerciceService } from '../services/exercice.service';
import { Exercice } from '../models/exercice.model';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public title: string = 'MemoLink';
  public showSuccess = false;
  public exercices: Exercice[] = []; // Stocke la liste des exercices

  constructor(private exerciceService: ExerciceService) {}

  ngOnInit() {
    // Ajouter un exercice de test
    this.exerciceService.addExercice({
      id: uuidv4(),
      name: 'Rangeons notre chambre !', // Nom amusant
      theme: 'Objets et pièces de la maison', // Thème réel
      description: 'Aidez à ranger les objets dans les bonnes pièces de la maison.',
      items: [
        { name: 'Brosse à dents', description: 'Utilisée pour se brosser les dents', imagePath: 'brosse.png', category: 'Salle de bain' },
        { name: 'Poêle', description: 'Pour cuisiner', imagePath: 'poele.png', category: 'Cuisine' },
        { name: 'Télécommande', description: 'Pour changer les chaînes', imagePath: 'telecommande.png', category: 'Salon' },
      ],
      categories: [
        { name: 'Cuisine', description: 'Pièce pour cuisiner', imagePath: 'cuisine.png' },
        { name: 'Salon', description: 'Pièce pour se détendre', imagePath: 'salon.png' },
        { name: 'Salle de bain', description: 'Pièce pour se laver', imagePath: 'salle_de_bain.png' }
      ]
    });

    // Récupérer et afficher les exercices
    this.exerciceService.getExercices().subscribe(exercices => {
      this.exercices = exercices;
      console.log('Liste des exercices :', exercices);
    });
  }

  showHideSuccess() {
    this.showSuccess = !this.showSuccess;
  }
}
