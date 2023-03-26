import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Card } from 'src/app/module/interface/card';

@Component({
  selector: 'deck-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class DeckListComponent implements OnInit {

  @Input() type!: number;
  @Input() cards!: Card[];

  @Output() showCard: EventEmitter<Card> = new EventEmitter();
  @Output() removeCard: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {


  }

  show(card: Card) {
    this.showCard.emit(card);
  }

  remove(card: Card,type:number) {
    this.removeCard.emit({"card":card,"type":type});
  }

}
