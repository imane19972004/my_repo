import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Item } from '../../../models/item.model';
import { Category } from '../../../models/category.model'; // Assure-toi d'avoir ce modèle

@Component({
  selector: 'app-game-category',
  templateUrl: './game-category.component.html',
  styleUrls: ['./game-category.component.scss']
})

export class GameCategoryComponent implements OnInit {
  @Input() category!: Category;
  @Input() items: Item[] = [];
  @Input() connectedDropListsIds: string[] = [];
  @Output() itemDropped = new EventEmitter<{ event: CdkDragDrop<Item[]>, category: string }>();

  constructor() {}
  ngOnInit(): void {}

  onDrop(event: CdkDragDrop<Item[]>) {
    this.itemDropped.emit({ event, category: this.category.name });
  }
}
