import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { Card } from 'src/app/module/interface/card';
import { MessageService } from 'src/app/module/swalAlert/message.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'opening-pack',
  templateUrl: './opening-pack.component.html',
  styleUrls: ['./opening-pack.component.css'],
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
export class OpeningPackComponent implements OnInit {

  @Input() cards!: Card[];
  @Input() zaino!: Card[];

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
  }

  cardClicked(card:Card) {
    if (card.state === "default") {
      card.state = "flipped";
    } else if(card.state === "flipped") {
      this.messageService.showDetailCard(card);
    } else {
      card.state = "default";
    }
  }

  checkExist(card:Card) {
    return this.zaino.some(item => item.id === card.id);
  }

}
