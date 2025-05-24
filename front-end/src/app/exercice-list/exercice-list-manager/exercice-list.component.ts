import { Component, OnInit } from '@angular/core';
import { Exercice } from "../../../models/exercice.model";
import { ExerciceService } from "../../../services/exercice.service";
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from "../../../services/user.service";

@Component({
  selector: 'app-exercice-list',
  templateUrl: './exercice-list.component.html',
  styleUrls: ['./exercice-list.component.scss']
})
export class ExerciceListComponent implements OnInit {

  public exerciceList: Exercice[] = [];
  public mode: 'play' | 'manage' = 'manage';
  public playerId: string = '';

  public generalExerciceList: Exercice[] = []; // Liste des exercices généraux
  public userPrivateExercices: Exercice[] = []; // Liste privée de l'utilisateur

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

    // Récupérer l'ID du joueur à partir des paramètres de route
    this.playerId = this.route.snapshot.params['idUser'];
    console.log("Player ID:", this.playerId);

    // Charger les exercices selon le mode
    this.loadExercices();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.playerId = params['idUser'] || '';
      console.log("Player ID mis à jour:", this.playerId);
      this.loadExercices();
    });
  }

  private loadExercices(): void {
    console.log("Chargement des exercices, mode:", this.mode, "playerId:", this.playerId);
    
    if (this.mode === 'play' && this.playerId) {
      // Charger les exercices privés de l'utilisateur
      this.exerciceService.getUserExercices(this.playerId).subscribe((exercices: Exercice[]) => {
        this.userPrivateExercices = exercices;
        console.log("Exercices privés chargés:", this.userPrivateExercices);
      });
      
      // Charger tous les exercices généraux disponibles (non assignés)
      this.exerciceService.getAvailableExercicesForUser(this.playerId).subscribe((exercices: Exercice[]) => {
        this.generalExerciceList = exercices;
        console.log("Exercices disponibles chargés:", this.generalExerciceList);
      });
    } else {
      // Mode manage : charger tous les exercices
      this.exerciceService.getAllExercices().subscribe((exercices: Exercice[]) => {
        this.exerciceList = exercices;
        console.log("Tous les exercices chargés:", this.exerciceList);
      });
    }
  }

  // Assigner un exercice à l'utilisateur (l'ajouter à sa liste privée)
  assignExerciceToUser(exercice: Exercice): void {
    console.log("Tentative d'assignation de l'exercice:", exercice.id, "à l'utilisateur:", this.playerId);
    
    if (this.playerId && exercice.id) {
      this.exerciceService.assignExerciceToUser(this.playerId, exercice.id).subscribe({
        next: (response) => {
          console.log("Exercice assigné avec succès:", response);
          // Recharger les listes pour voir les changements
          this.loadExercices();
        },
        error: (error) => {
          console.error("Erreur lors de l'assignation de l'exercice:", error);
        }
      });
    } else {
      console.error("Player ID ou Exercice ID manquant:", { playerId: this.playerId, exerciceId: exercice.id });
    }
  }

  // Retirer un exercice de la liste privée
  removeExerciceFromUser(exercice: Exercice): void {
    console.log("Tentative de suppression de l'exercice:", exercice.id, "de l'utilisateur:", this.playerId);
    
    if (this.playerId && exercice.id) {
      this.exerciceService.removeExerciceFromUser(this.playerId, exercice.id).subscribe({
        next: (response) => {
          console.log("Exercice retiré avec succès:", response);
          // Recharger les listes pour voir les changements
          this.loadExercices();
        },
        error: (error) => {
          console.error("Erreur lors de la suppression de l'exercice:", error);
        }
      });
    } else {
      console.error("Player ID ou Exercice ID manquant:", { playerId: this.playerId, exerciceId: exercice.id });
    }
  }

  // Méthode pour supprimer un exercice (mode manage)
  deleteExercice(exercice: Exercice): void {
    console.log("Suppression de l'exercice:", exercice.id);
    this.exerciceService.deleteExercice(exercice);
  }

  // Méthode pour sélectionner un exercice et lancer le jeu
  selectExercice(exercice: Exercice): void {
    console.log("Sélection de l'exercice:", exercice.id);
    this.exerciceService.setSelectedExercice(exercice.id);

    if (this.playerId) {
      console.log('Player ID avant navigation:', this.playerId);
      console.log('Exercice ID:', exercice.id);

      // Redirection selon le mode 'play' avec l'ID du joueur et l'ID de l'exercice
      if (this.mode === 'play') {
        this.router.navigate([`/${this.playerId}/game/${exercice.id}`]);
      } else {
        this.router.navigate(['/exercice-list-manager']);
      }
    } else {
      console.log('Player ID non défini, redirection vers la liste des utilisateurs');
      this.router.navigate(['/user-list']);
    }
  }
}