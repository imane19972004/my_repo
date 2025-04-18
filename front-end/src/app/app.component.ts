import { Component ,OnInit} from '@angular/core';
import { ExerciceService } from '../services/exercice.service';
import { Exercice } from '../models/exercice.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  public title: string = 'Hello world!';
  public showSuccess = false;
  public exercices: Exercice[] = []; // Stocke la liste des exercices


  constructor(private exerciceService: ExerciceService) {}
  ngOnInit() {
    // Tester l'ajout d'un exercice
    this.exerciceService.addExercice({
      name: 'Vêtements et saisons',
      items: [
        { name: 'Écharpe', description: 'Protège du froid', imagePath: 'echarpe.png', category: 'Hiver' }
      ],
      categories: [{ name: 'Hiver', description: '', imagePath: '' }]
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
