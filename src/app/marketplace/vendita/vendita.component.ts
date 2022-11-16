import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Card, SellCard } from 'src/app/interface/card';

@Component({
  selector: 'marketplace-vendita',
  templateUrl: './vendita.component.html',
  styleUrls: ['./vendita.component.css']
})
export class MarketPlaceVenditaComponent implements OnInit {
  @Input() viewHistory: boolean = false;
  @Input() history: SellCard[] = [];

  @Input() zaino: Card[]=[];

  @Output() showCard: EventEmitter<Card> = new EventEmitter();
  @Output() sellCard: EventEmitter<Card> = new EventEmitter();
  @Output() deleteCard: EventEmitter<any> = new EventEmitter();
  
  viewFilter = false;
  filterName:string | undefined;
  flagFilterGO = false;

  constructor() { }

  ngOnInit(): void {
  }

  doFilter() {
    this.viewFilter=!this.viewFilter;
  }

  sell(card: Card){
    this.sellCard.emit(card);
  }

  show(card: Card) {
    this.showCard.emit(card);
  }

  deleteSell(idSellCard:string, cardId:string) {
    this.deleteCard.emit({'id':idSellCard,'cardId':cardId});
  }

}
