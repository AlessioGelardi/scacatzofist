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
          name: "HOME-BUTTON",
          code: "HOME",
          class: "fa fa-home"
        },
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
        this.deck = resp;
      });
    }
  }



  buttonOperationHandler(code: any) {
    if(code) {
      switch(code) {
        case 'HOME':
          this.router.navigate(['/home',{id:this.playerId!}]);
          break;
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

}
