import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Button } from 'src/app/module/interface/button';
import { Card, Deck } from 'src/app/module/interface/card';
import { MessageService } from 'src/app/services/swalAlert/message.service';
import { DeckService } from '../../services/httpservices/deck.service';
import { StateDeckService } from '../../services/state/state-deck.service';
import { StatePlayerService } from 'src/app/services/state/state-player.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-deck-edit',
  templateUrl: './deck-edit.component.html',
  styleUrls: ['./deck-edit.component.css']
})
export class DeckEditComponent implements OnInit {

  buttons: Button[] = [];

  deck: Deck | undefined;
  deckId: string | undefined;
  playerId: string | undefined;

  viewFilter = false;
  filterName:string | undefined;

  zaino: Card[]=[];

  sliceLimit: number | undefined;
  sliceStart: number = 0;
  sliceEnd: number = 60;
  slice: number = 60;

  constructor(private router: Router,
    private deckStateService: StateDeckService,
    private playerStateService: StatePlayerService,
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

    this.playerId = "63459b3a4b4c877f5a46f43e"; //this.route.snapshot.paramMap.get('playerId')

    this.playerStateService.getZaino(this.playerId!).then((resp) => {
      if(resp) {
        this.zaino = resp;
        this.sliceLimit = this.zaino.length;
      } else {
        //TO-DO gestione degli errori
        /*
        if(resp.status===402) {
          this.swalAlert('Attenzione!','non ho trovato nulla con questo id, probabilmente devi fare la registrazione','error');
        }
        */

        this.messageService.alert('Attenzione!','Errore durante la chiamata getZaino','error');
      }
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

  addCard(card:Card) {
    if(card && card.type == 8388641 || card.type === 97 || card.type === 8225) { //TO-DO
      this.deck?.extra.push(card);
    } else if (card) {
      Swal.fire({
        title: 'Dove vuoi aggiungere questa carta?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Main',
        denyButtonText: 'Side',
        cancelButtonText: 'Annulla',
      }).then((result) => {
        if (result.isConfirmed) {
          this.deck?.main.push(card)
        } else if (result.isDenied) {
          this.deck?.side.push(card)
        }
      })
      
    }

  }

  backSlice() {
    this.sliceEnd -= this.slice;
    this.sliceStart -= this.slice;
  }

  continueSlice() {
    this.sliceStart += this.slice;
    this.sliceEnd += this.slice;
  }

}