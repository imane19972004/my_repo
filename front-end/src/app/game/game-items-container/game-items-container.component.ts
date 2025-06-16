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
  @Input() numberOfFailure: number = 0;
  @Output() itemDropped = new EventEmitter<CdkDragDrop<Item[]>>();
  @Input() failedItemName!: string | null;
  @Input() itemFailureTracker!: { [p: string]: number };

  constructor() {}
  ngOnInit(): void {
    console.log(this.numberOfFailure);
  }


  getFails(item: Item): number {
    return this.itemFailureTracker[item.name] ?? 0;
  }

}
