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
    private userService: UserService,  // Service pour l'utilisateur
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Vérification du mode depuis les paramètres de route
    this.route.url.subscribe(urlSegments => {
      if (urlSegments.some(seg => seg.path === 'choose-exercice')) {
        this.mode = 'play'; // Change de mode en 'play' si nécessaire
      }
    });

    // Récupérer l'ID du joueur à partir du service utilisateur
    this.playerId = this.route.snapshot.params['idUser'];
    console.log("This player id: ",this.playerId);

    // Souscription à la liste des exercices pour mettre à jour le tableau dans le composant
    this.exerciceService.getExercices().subscribe((exercices: Exercice[]) => {
      this.exerciceList = exercices;
    });
  }

  ngOnInit(): void {}

  // Méthode pour supprimer un exercice
  deleteExercice(exercice: Exercice): void {
    this.exerciceService.deleteExercice(exercice.id);
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
      // Redirection si l'ID du joueur est indéfini, rediriger vers la page d'erreur ou autre action appropriée
      this.router.navigate(['/user-list']);
    }
  }

  // Méthode pour la navigation vers la création d'un exercice
  navigateToCreateExercice(): void {
    this.router.navigate(['/create-exercice']);
  }
}
