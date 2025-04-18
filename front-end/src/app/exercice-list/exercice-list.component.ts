// exercice-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ExerciceService } from '../../services/exercice.service';
import { Exercice } from '../../models/exercice.model';

@Component({
  selector: 'app-exercice-list',
  templateUrl: './exercice-list.component.html',
  styleUrls: ['./exercice-list.component.scss']
})
export class ExerciceListComponent implements OnInit {
  exercices: Exercice[] = [];

  constructor(private exerciceService: ExerciceService) {}

  ngOnInit(): void {
    this.exerciceService.getExercices().subscribe(exercices => {
      this.exercices = exercices;
    });
  }

  deleteExercice(id: string): void {
    this.exerciceService.deleteExercice(id);
  }
}
