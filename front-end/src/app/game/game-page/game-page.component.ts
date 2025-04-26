import { Component, OnInit } from '@angular/core';
import { Exercice } from '../../../models/exercice.model';
import { v4 as uuidv4 } from 'uuid'; 

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss']
})

export class GamePageComponent implements OnInit {
  exercice: Exercice;

  constructor() {
    this.exercice = {
      id: uuidv4(),
      name: "",
      items: [{name: "", description: "", category: "", imagePath: ""}],
      categories: [{name: "", description: "", imagePath: ""}]
    };
  }
  ngOnInit(): void {}
}
