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
  public mode: 'play' | 'manage' = 'manage'; // Définition du mode
  public playerId: string = '';

  constructor(
    private exerciceService: ExerciceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.url.subscribe(urlSegments => {
      if (urlSegments.some(seg => seg.path === 'choose-exercice')) {
        this.mode = 'play'; // Change de mode en 'play' si nécessaire
      }
    });
    this.playerId = this.route.snapshot.params['idUser'];
    this.exerciceService.exercices$.subscribe((exercices: Exercice[]) => {
      this.exerciceList = exercices;
    });
  }

  ngOnInit(): void {}

  deleteExercice(exercice: Exercice): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette exercice ?')) {
      this.exerciceService.deleteExercice(exercice);
    }
  }

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
      this.router.navigate(['/choose-user']);
    }
  }

  editExercice(exercice: Exercice): void {
    this.router.navigate(['/edit-exercice', exercice.id]);
  }

}
