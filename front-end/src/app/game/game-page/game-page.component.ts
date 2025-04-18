import { Component, OnInit } from '@angular/core';
import { Exercice } from '../../../models/exercice.model';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss']
})

export class GamePageComponent implements OnInit {
  exercice: Exercice;

  constructor() {
    this.exercice = {
      name: "",
      items: [{name: "", description: "", category: "", imagePath: ""}],
      categories: [{name: "", description: "", imagePath: ""}]
    };
  }
  ngOnInit(): void {}
}
