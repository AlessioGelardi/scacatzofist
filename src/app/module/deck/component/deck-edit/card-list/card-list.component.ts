import { CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Card } from 'src/app/module/interface/card';

@Component({
  selector: 'card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['../../../styles/deck.css','./card-list.component.css']
})
export class CardListComponent implements OnInit {

  @Input() typeDeck!: number;
  @Input() cards!: Card[];
  @Input() dragDrop: boolean = false;
  @Input() dragging: boolean = false;
  @Input('connectedTo') connectedTo!: string[];

  @Output() showCard: EventEmitter<Card> = new EventEmitter();
  @Output() removeCard: EventEmitter<any> = new EventEmitter();

  kindDeck: string | undefined;

  @Output() zainoRemove: EventEmitter<Card> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {

    switch(this.typeDeck) {
      case 1:
        this.kindDeck='main';
        break;
      case 2:
        this.kindDeck='extra';
        break;
      case 3:
        this.kindDeck='side';
        break;
      default:
        break;
    }
  }

  onDragStart(): void {
    this.dragging = true;
  }
  
  onDragEnd(): void {
    setTimeout(() => {
      this.dragging = false;
    }, 10);
  }

  onDrop(event: CdkDragDrop<Card[]>) {
    if(event.previousContainer === event.container) {
      moveItemInArray(event.container.data,event.previousIndex,event.currentIndex)
    } else {
      const previus = [ ...event.previousContainer.data];
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      )
      const nextStep = [...event.previousContainer.data];
      const arrayTwo = previus.filter(item => !nextStep.includes(item));
      this.zainoRemove.emit(arrayTwo[0])
    }
  }

  show(card: Card) {
    if(!this.dragging) {
      this.showCard.emit(card);
    }
  }

  remove(card: Card,type:number) {
    this.removeCard.emit({"card":card,"type":type});
  }
}