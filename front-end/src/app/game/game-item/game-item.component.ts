import { Component, OnInit, Input } from '@angular/core';
import { Item } from '../../../models/item.model';

@Component({
  selector: 'app-game-item',
  templateUrl: './game-item.component.html',
  styleUrls: ['./game-item.component.scss']
})
export class GameItemComponent implements OnInit {
  @Input() item!: Item;

  ngOnInit(): void {
  }
}
