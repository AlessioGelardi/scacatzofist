import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { Card } from 'src/app/module/interface/card';
import Swal from 'sweetalert2';

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
    } else if(card.state === "flipped") {
      Swal.fire({
        title: card.name,
        color: '#3e3d3c',
        background: '#cdcccc',
        html: '<label style="font-size:14px">'+card.description+'</label>',
        imageUrl: 'https://images.ygoprodeck.com/images/cards/'+card.id+'.jpg',
        imageWidth: 160
        })
    } else {
      card.state = "default";
    }
  }

}
