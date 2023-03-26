import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Card, SellCard } from 'src/app/module/interface/card';

@Component({
  selector: 'marketplace-vendita',
  templateUrl: './vendita.component.html',
  styleUrls: ['./vendita.component.css']
})
export class MarketPlaceVenditaComponent implements OnInit {
  @Input() viewHistory: boolean = false;
  @Input() history: SellCard[] = [];

  @Input() zaino: Card[]=[];
  @Input() sliceLimit: number | undefined;

  @Output() showCard: EventEmitter<Card> = new EventEmitter();
  @Output() sellCard: EventEmitter<Card> = new EventEmitter();
  @Output() deleteCard: EventEmitter<any> = new EventEmitter();
  
  viewFilter = false;
  filterName:string | undefined;
  flagFilterGO = false;

  sliceStart: number = 0;
  sliceEnd: number = 60;
  slice: number = 60;

  constructor() { }

  ngOnInit(): void {
    this.sliceLimit = this.zaino.length;
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

  backSlice() {
    this.sliceEnd -= this.slice;
    this.sliceStart -= this.slice;
  }

  continueSlice() {
    this.sliceStart += this.slice;
    this.sliceEnd += this.slice;
  }

}
