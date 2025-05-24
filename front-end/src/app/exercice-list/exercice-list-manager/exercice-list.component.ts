import { Component, OnInit } from '@angular/core';
import { Exercice } from "../../../models/exercice.model";
import { ExerciceService } from "../../../services/exercice.service";
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from "../../../services/user.service"; // Service pour récupérer l'utilisateur

@Component({
  selector: 'app-exercice-list',
  templateUrl: './exercice-list.component.html',
  styleUrls: ['./exercice-list.component.scss']
})
export class ExerciceListComponent implements OnInit {

  public exerciceList: Exercice[] = [];
  public mode: 'play' | 'manage' = 'manage'; // Définition du mode
  public playerId: string = ''; // Variable pour stocker l'ID du joueur

  constructor(
      private exerciceService: ExerciceService,
      private userService: UserService,
      private router: Router,
      private route: ActivatedRoute
  ) {
    // Vérification du mode depuis les paramètres de route
  this.route.url.subscribe(urlSegments => {
    if (urlSegments.some(seg => seg.path === 'choose-exercice')) {
      this.mode = 'play';
    }
  });

  // Récupérer l'ID du joueur à partir du service utilisateur
  this.playerId = this.route.snapshot.params['idUser'];
  console.log("This player id: ", this.playerId);

  // Charger les exercices selon le mode
  this.loadExercices();
  }


   ngOnInit(): void {
     this.route.params.subscribe(params => {
    this.playerId = params['idUser'] || '';
    this.loadExercices();
  });
  }

 private loadExercices(): void {
  if (this.mode === 'play' && this.playerId) {
    this.exerciceService.getUserExercices(this.playerId).subscribe((exercices: Exercice[]) => {
      this.exerciceList = exercices;
    });
  } else {
    this.exerciceService.getAllExercices().subscribe((exercices: Exercice[]) => {
      this.exerciceList = exercices;
    });
  }
}



 

  // Méthode pour supprimer un exercice
  deleteExercice(exercice: Exercice): void {
    this.exerciceService.deleteExercice(exercice);
  }

  // Méthode pour sélectionner un exercice
  selectExercice(exercice: Exercice): void {
    this.exerciceService.setSelectedExercice(exercice.id);

    if (this.playerId) {
      console.log('Player ID before navigation:', this.playerId);
      console.log('Exercice ID:', exercice.id);

      // Redirection selon le mode 'play' avec l'ID du joueur et l'ID de l'exercice
      if (this.mode === 'play') {
        this.router.navigate([`/${this.playerId}/game/${exercice.id}`]);
      } else {
        this.router.navigate(['/exercice-list-manager']);
      }
    } else {
      console.log('Player ID is not defined');
      this.router.navigate(['/user-list']);
    }
  }
}
