import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Button } from 'src/app/module/interface/button';
import { Card, Deck } from 'src/app/module/interface/card';
import { MessageService } from 'src/app/module/services/swalAlert/message.service';
import Swal from 'sweetalert2';
import { DeckService } from '../../services/httpservices/deck.service';
import { StateDeckService } from '../../services/state/state-deck.service';

@Component({
  selector: 'app-deck-edit',
  templateUrl: './deck-edit.component.html',
  styleUrls: ['./deck-edit.component.css']
})
export class DeckEditComponent implements OnInit {

  buttons: Button[] = [];

  deck: Deck | undefined;
  deckId: string | undefined;

  viewFilter = false;
  filterName:string | undefined;

  constructor(private router: Router,
    private spinnerService: NgxSpinnerService,
    private deckStateService: StateDeckService,
    private deckService: DeckService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.buttons = [
      {
        name: "BACK-BUTTON",
        code: "BACK",
        class: "fa fa-undo"
      },
      {
        name: "SAVE-BUTTON",
        code: "SAVE",
        class: "fa fa-save"
      }
    ];

    this.deckId = '634ebd932a1bb2f2d4f921ef'; //this.route.snapshot.paramMap.get('id')!;
    this.deckStateService.getDeck(this.deckId).then((resp) => {
      this.deck = resp;
    });
  }

  buttonOperationHandler(code: any) {
    if(code) {
      switch(code) {
        case 'BACK':
          this.router.navigate(['/deckDetail',{id:this.deckId}]);
          break;
        case 'SAVE':
          this.deckStateService.updateDeck(this.deck!,this.deckId!).then((resp) => {
            if(resp && resp.status===200) {
              this.messageService.alert('Fatto!','Deck salvato con successo.','success');
            } else {
              this.messageService.alert('Errore','Qualcosa è andato storto durante il salvataggio del deck','error');
            }
          });
          break;
      }
    }
  }

  removeCard(removeObject:any) {
    const card = removeObject.card;
    const type = removeObject.type;
    
    if(card) {
      let indice = -1;
      switch(type) {
        case 1:
          indice = this.deck?.main.indexOf(card, 0)!;
          if (indice !== undefined && indice > -1) {
            this.deck?.main.splice(indice, 1);
          }
          break;
        case 2:
          indice = this.deck?.extra.indexOf(card, 0)!;
          if (indice !== undefined && indice > -1) {
            this.deck?.extra.splice(indice, 1);
          }
          break;
        case 3:
          indice = this.deck?.side.indexOf(card, 0)!;
          if (indice !== undefined && indice > -1) {
            this.deck?.side.splice(indice, 1);
          }
          break;
      }
    }
  }

  doFilter() {
    this.viewFilter=!this.viewFilter;
  }
  
  showCard(card:Card) {
    this.messageService.showDetailCard(card);
  }

}