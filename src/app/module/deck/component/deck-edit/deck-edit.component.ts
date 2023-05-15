import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Button } from 'src/app/module/interface/button';
import { Card, Deck } from 'src/app/module/interface/card';
import { StateDeckService } from '../../services/state/state-deck.service';
import Swal from 'sweetalert2';
import { StatePlayerService } from 'src/app/module/player/services/state/state-player.service';
import { MessageService } from 'src/app/module/swalAlert/message.service';

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
  newNameDeck: string | undefined;

  viewFilter = false;
  filterName:string | undefined;

  zaino: Card[]=[];

  sliceLimit: number | undefined;
  sliceStart: number = 0;
  sliceEnd: number = 60;
  slice: number = 60;

  constructor(private router: Router,
    private deckStateService: StateDeckService,
    private route: ActivatedRoute,
    private playerStateService: StatePlayerService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.buttons = [
      {
        name: "BACK-BUTTON",
        code: "BACK",
        class: "fa fa-arrow-left"
      },
      {
        name: "REFRESH-BUTTON",
        code: "REFRESH",
        class: "fa fa-refresh"
      },
      {
        name: "SAVE-BUTTON",
        code: "SAVE",
        class: "fa fa-save"
      }
    ];

    this.deckId = this.route.snapshot.paramMap.get('id')!;
    this.playerId = this.route.snapshot.paramMap.get('playerId')!;
    this.newNameDeck = this.route.snapshot.paramMap.get('newNameDeck')!;
    this.takeDeck();
  }

  buttonOperationHandler(code: any) {
    if(code) {
      switch(code) {
        case 'BACK':
          this.router.navigate(['/deckDetail',{id:this.deckId}]);
          break;
        case 'REFRESH': {
          this.deckStateService.resetDeck();
          this.playerStateService.resetZaino();
          this.takeDeck();
          break;
        }
        case 'SAVE':
          this.deck!.new=false;
          this.deckStateService.updateDeck(this.deck!,this.deckId!).then((resp) => {
            if(resp) {
              this.deckStateService.resetPlayerDecks();
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
          if(card.qnt>1) {
            let cardIntoMain = this.deck?.main.find(i => i.id === card.id);
            cardIntoMain!.qnt!--;
          } else {
            indice = this.deck?.main.indexOf(card, 0)!;
            if (indice !== undefined && indice > -1) {
              this.deck?.main.splice(indice, 1);
            }
          }

          break;
        case 2:
          if(card.qnt>1) {
            let cardIntoExtra = this.deck?.extra.find(i => i.id === card.id);
            cardIntoExtra!.qnt!--;
          } else {
            indice = this.deck?.extra.indexOf(card, 0)!;
            if (indice !== undefined && indice > -1) {
              this.deck?.extra.splice(indice, 1);
            }
          }

          break;
        case 3:
          if(card.qnt>1) {
            let cardIntoSide = this.deck?.side.find(i => i.id === card.id);
            cardIntoSide!.qnt!--;
          } else {
            indice = this.deck?.side.indexOf(card, 0)!;
            if (indice !== undefined && indice > -1) {
              this.deck?.side.splice(indice, 1);
            }
          }

          break;
      }

      this.addCardZaino(card);
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

      this.deleteCardZaino(card);

      //verifico se la carta che sto aggiungendo nel main è già presente almeno una volta
      let cardIntoExtra = this.deck?.extra.find(i => i.id === card.id);
      if(cardIntoExtra) {
        cardIntoExtra!.qnt!++;
      } else {
        let newCard = {...card }
        newCard.qnt=1
        this.deck?.extra.push(newCard);
      }
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

          this.deleteCardZaino(card);

          //verifico se la carta che sto aggiungendo nel main è già presente almeno una volta
          let cardIntoMain = this.deck?.main.find(i => i.id === card.id);
          if(cardIntoMain) {
            cardIntoMain!.qnt!++;
          } else {
            let newCard = {...card }
            newCard.qnt=1
            this.deck?.main.push(newCard);
          }
        } else if (result.isDenied) {

          this.deleteCardZaino(card);

          //verifico se la carta che sto aggiungendo nel side è già presente almeno una volta
          let cardIntoSide = this.deck?.side.find(i => i.id === card.id);
          if(cardIntoSide) {
            cardIntoSide!.qnt!++;
          } else {
            let newCard = {...card }
            newCard.qnt=1;
            this.deck?.side.push(newCard);
          }
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

  private takeDeck() {
    if(this.newNameDeck!=="") {
      this.deck = {
        id: this.deckId!,
        playerId: this.playerId!,
        name: this.newNameDeck!,
        new: false,
        main: [],
        extra: [],
        side: []
      }
      this.takeZaino();
    } else {
      this.deckStateService.getDeck(this.deckId!).then((resp) => {
        if(resp) {
          this.deck=resp;
          this.takeZaino();
        }
      });
    }
  }

  private takeZaino() {
    this.playerStateService.getZaino(this.playerId!).then((resp) => {
      if(resp) {
        this.zaino = [];
        for(let card of resp) {

          if(card && card.type == 8388641 || card.type === 97 || card.type === 8225) { //TO-DO

            //check extra
            let cardIntoExtra = this.deck?.extra.find(i => i.id === card.id);
            if(cardIntoExtra) {
              let cardIntoZaino = this.zaino.find(i => i.id === card.id);
              if(!cardIntoZaino) {
                if(card.qnt!>cardIntoExtra.qnt!) {
                  card.qnt=card.qnt!-cardIntoExtra.qnt!;
                  this.zaino.push(card)
                }
              }
            } else {
              this.zaino.push(card)
            }
          } else {

            //check main
            let cardIntoMain = this.deck?.main.find(i => i.id === card.id);
            let cardIntoSide = this.deck?.side.find(i => i.id === card.id);
            if(cardIntoMain || cardIntoSide) {
              let cardIntoZaino = this.zaino.find(i => i.id === card.id);
              if(!cardIntoZaino) {

                if(cardIntoMain) {
                  if(card.qnt!>cardIntoMain.qnt!) {
                    card.qnt=card.qnt!-cardIntoMain.qnt!;
                    this.zaino.push(card)
                  }
                }

                if(cardIntoSide) {
                  if(card.qnt!>cardIntoSide.qnt!) {
                    card.qnt=card.qnt!-cardIntoSide.qnt!;
                    this.zaino.push(card)
                  }
                }
              }
            } else {
              this.zaino.push(card)
            }
          }
        }
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

  private deleteCardZaino(card: Card) {
    //verifico se la carta che ho nell'inventario ha più di una quantità
    if(card.qnt!>1) {
      card.qnt!--;
    } else {
      let indice = this.zaino.indexOf(card, 0)!;
      if (indice !== undefined && indice > -1) {
        this.zaino.splice(indice, 1);
      }
    }
  }

  private addCardZaino(card: Card) {
    let cardIntoZaino = this.zaino.find(i => i.id === card.id);
    if(cardIntoZaino) {
      cardIntoZaino.qnt!++;
    } else {
      let newCard = {...card }
      newCard.qnt=1;
      this.zaino.push(newCard);
    }
  }

}