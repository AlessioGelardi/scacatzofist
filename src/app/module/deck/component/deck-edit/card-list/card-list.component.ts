import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
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

  constructor() { }

  ngOnInit(): void {


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
    console.log(event)
    if(event.previousContainer === event.container) {
      moveItemInArray(event.container.data,event.previousIndex,event.currentIndex)
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      )
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