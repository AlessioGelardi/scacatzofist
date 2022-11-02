import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { Card } from 'src/app/interface/card';

@Component({
  selector: 'marketplace-openingpack',
  templateUrl: './openingpack.component.html',
  styleUrls: ['./openingpack.component.css'],
  animations: [
    trigger('cardFlip', [
      state('default', style({
        transform: 'rotateY(180deg)'
      })),
      state('flipped', style({
        transform: 'rotateY(0deg)'
      })),
      transition('default => flipped', [
        animate('400ms')
      ]),
      transition('flipped => default', [
        animate('200ms')
      ])
    ])
  ]
})
export class MarketPlaceOpeningpackComponent implements OnInit {

  @Input() cards!: Card[];

  constructor() { }

  ngOnInit(): void {
  }

  cardClicked(card:Card) {
    if (card.state === "default") {
      card.state = "flipped";
    } else {
      card.state = "default";
    }
  }

}
