import { Component, Input, OnInit } from '@angular/core';
import { Card } from 'src/app/module/interface/card';
import { Attributi } from '../../enum/attribute';
import { Razze } from '../../enum/races';

@Component({
  selector: 'view-card',
  templateUrl: './view-card.component.html',
  styleUrls: ['./view-card.component.css']
})
export class ViewCardComponent implements OnInit {

  @Input() cards: Card[] = [];
  @Input() zaino: Card[] | undefined = [];

  @Input() searchFilter: any | undefined;

  constructor() { }

  ngOnInit(): void {
  }

  public get Attributi() {
    return Attributi; 
  }

  public get Razze() {
    return Razze; 
  }

  checkExist(card:Card) {
    return this.zaino!.some(item => item.id === card.id);
  }

}
