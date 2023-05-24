import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  playerId: string | undefined;
  permission: boolean = true;
  deck: Deck | undefined;

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
          class: "fa fa-undo"
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

    this.deckId = this.route.snapshot.paramMap.get('id')!;
    this.playerId = this.route.snapshot.paramMap.get('playerId')!;
    
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
          this.router.navigate(['/deck',{id:this.playerId!, permission: this.permission}]);
          break;
        case 'EDIT':
          this.router.navigate(['/deckEdit',{id:this.deckId,playerId:this.playerId!}]);
          break;
      }
    }
  }

}
