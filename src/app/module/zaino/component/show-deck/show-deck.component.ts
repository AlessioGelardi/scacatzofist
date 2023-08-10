import { Component, Input } from '@angular/core';
import { Card, Deck } from 'src/app/module/interface/card';
import { MessageService } from 'src/app/module/swalAlert/message.service';

@Component({
  selector: 'show-deck',
  templateUrl: './show-deck.component.html',
  styleUrls: ['./show-deck.component.css']
})
export class ShowDeckComponent {

  @Input() deck: Deck | undefined;

  constructor(private messageService: MessageService) {
    
  }

  showCard(card:Card) {
    this.messageService.showDetailCard(card);
  }
}
