import { Component, Input, OnInit } from '@angular/core';
import { Card } from 'src/app/module/interface/card';

@Component({
  selector: 'view-card',
  templateUrl: './view-card.component.html',
  styleUrls: ['./view-card.component.css']
})
export class ViewCardComponent implements OnInit {

  @Input() cards: Card[] = [];
  @Input() zaino: Card[] = [];

  @Input() searchFilter: any | undefined;

  constructor() { }

  ngOnInit(): void {
  }

  checkExist(card:Card) {
    return this.zaino.some(item => item.id === card.id);
  }

}
