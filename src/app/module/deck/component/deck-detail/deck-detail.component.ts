import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from 'src/app/module/interface/button';
import { Card, Deck } from 'src/app/module/interface/card';
import { StateDeckService } from '../../services/state/state-deck.service';
import { MessageService } from 'src/app/module/swalAlert/message.service';

@Component({
  selector: 'app-deck-detail',
  templateUrl: './deck-detail.component.html',
  styleUrls: ['./deck-detail.component.css']
})
export class DeckDetailComponent implements OnInit {

  buttons: Button[] = [];

  deckId: string | undefined;
  deck: Deck | undefined;

  constructor(private router: Router,
    private deckStateService: StateDeckService,
    private messageService: MessageService) {
    
  }

  ngOnInit(): void {
    this.buttons = [
      {
        name: "BACK-BUTTON",
        code: "BACK",
        class: "fa fa-undo"
      },
      {
        name: "EDIT-BUTTON",
        code: "EDIT",
        class: "fa fa-pencil"
      }
    ];

    this.deckId = '634ebd932a1bb2f2d4f921ef'; //this.route.snapshot.paramMap.get('id')!;
    this.deckStateService.getDeck(this.deckId).then((resp) => {
      this.deck = resp;
    });
  }

  showCard(card:Card) {
    this.messageService.showDetailCard(card);
  }

  buttonOperationHandler(code: any) {
    if(code) {
      switch(code) {
        case 'BACK':
          this.router.navigate(['/']);
          break;
        case 'EDIT':
          this.router.navigate(['/deckEdit',{id:this.deckId}]);
          break;
      }
    }
  }

}
