import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Card } from 'src/app/module/interface/card';

@Component({
  selector: 'card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.css']
})
export class CardListComponent implements OnInit {

  @Input() typeDeck!: number;
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