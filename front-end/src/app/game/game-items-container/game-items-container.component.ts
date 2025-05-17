import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Item } from '../../../models/item.model';

@Component({
  selector: 'app-game-items-container',
  templateUrl: './game-items-container.component.html',
  styleUrls: ['./game-items-container.component.scss']
})

export class GameItemsContainerComponent implements OnInit {
  @Input() itemsInBulk: Item[] = [];
  @Input() connectedDropListsIds: string[] = [];
  @Output() itemDropped = new EventEmitter<CdkDragDrop<Item[]>>();

  static numberOfFailure: number = 0;
  numberOfFailure: number = GameItemsContainerComponent.numberOfFailure;

  constructor() {}
  ngOnInit(): void {
    this.numberOfFailure = GameItemsContainerComponent.numberOfFailure;
    console.log(this.numberOfFailure);
  }

  setNumberOfFailure(num: number): void {
    this.numberOfFailure = num;
    console.log(this.numberOfFailure);
  }

  setItemsInBulk(items: Item[]): void {
    this.itemsInBulk = items;
    console.log(this.itemsInBulk);
  }


}
