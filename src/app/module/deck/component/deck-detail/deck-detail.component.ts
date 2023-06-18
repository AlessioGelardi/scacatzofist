import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'src/app/module/interface/button';
import { Card, Deck } from 'src/app/module/interface/card';
import { StateDeckService } from '../../services/state/state-deck.service';
import { MessageService } from 'src/app/module/swalAlert/message.service';

@Component({
  selector: 'app-deck-detail',
  templateUrl: './deck-detail.component.html',
  styleUrls: ['../../styles/deck.css','./deck-detail.component.css']
})
export class DeckDetailComponent implements OnInit {

  buttons: Button[] = [];

  deckId: string | undefined;
  playerId: string | undefined;
  permission: boolean = true;
  newNameDeck: string | undefined;
  showDeck: Deck | undefined;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private deckStateService: StateDeckService,
    private messageService: MessageService) {
    
  }

  ngOnInit(): void {
    this.permission = this.route.snapshot.paramMap.get('permission')! === "true";

    if(this.permission) {
      this.buttons = [
        {
          name: "BACK-BUTTON",
          code: "BACK",
          class: "fa fa-arrow-left"
        },
        {
          name: "EDIT-BUTTON",
          code: "EDIT",
          class: "fa fa-pencil"
        }
      ];
    } else {
      this.buttons = [
        {
          name: "BACK-BUTTON",
          code: "BACK",
          class: "fa fa-undo"
        }
      ];
    }

    this.playerId = this.route.snapshot.paramMap.get('playerId')!;
    this.deckId = this.route.snapshot.paramMap.get('id')!;
    this.newNameDeck = this.route.snapshot.paramMap.get('newNameDeck')!;
    if(this.newNameDeck) {
      this.buttonOperationHandler('EDIT');
    } else {
      this.deckStateService.getDeck(this.deckId).then((resp) => {
        if(resp) {
          const copyResp = { ...resp }
          this.showDeck = copyResp;
          this.showDeck.main = this.fillShowCard(resp.main);
          this.showDeck.extra = this.fillShowCard(resp.extra);
          this.showDeck.side = this.fillShowCard(resp.side);
        }
      });
    }
  }

  showCard(card:Card) {
    this.messageService.showDetailCard(card);
  }

  buttonOperationHandler(code: any) {
    if(code) {
      switch(code) {
        case 'BACK':
          this.router.navigate(['/deck',{id:this.playerId!, permission: this.permission}]);
          break;
        case 'EDIT':
          if(this.newNameDeck) {
            this.router.navigate(['/deckEdit',{id:this.deckId,newNameDeck:this.newNameDeck,playerId:this.playerId!, permission: this.permission}]);
          } else {
            this.router.navigate(['/deckEdit',{id:this.deckId,playerId:this.playerId!, permission: this.permission}]);
          }
          break;
      }
    }
  }

  private fillShowCard(cards: Card[]): Card[] {
    let showCards: Card[] = [];

    for(let card of cards) {
      for(let x of [].constructor(card.qnt)) {
        showCards.push(card);
      }
    }

    return showCards;
  }

}
