import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Button } from 'src/app/module/interface/button';
import { MessageService } from 'src/app/module/services/swalAlert/message.service';
import Swal from 'sweetalert2';
import { StateDeckService } from '../../services/state/state-deck.service';
//import { DeckEditComponent } from './edit/edit.component';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['../../styles/deck.css','./deck.component.css']
})
export class DeckComponent implements OnInit {

  buttons: Button[] = [];

  modifyDeck = false;
  newDeckName: string = "";

  decks: any[] = [];

  deckId: string | undefined;

  viewModifyNameDeck = false;
  newDeck = false;

  
  oldDeckName: string | undefined;

  playerId: string | undefined;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private spinnerService: NgxSpinnerService,
    private messageService: MessageService,
    private deckStateService: StateDeckService) {

  }

  ngOnInit(): void {
    this.buttons = [
      {
        name: "HOME-BUTTON",
        code: "HOME",
        class: "fa fa-home"
      },
      {
        name: "NEW-BUTTON",
        code: "NEW",
        class: "fa fa-plus"
      },
      {
        name: "EDIT-BUTTON",
        code: "EDIT",
        class: "fa fa-pencil"
      }/*,
      {
        name: "IMPORT-BUTTON",
        code: "IMPORT",
        class: "fa fa-download"
      }*/
    ];

    
    this.playerId = '63459b3a4b4c877f5a46f43e'; //this.route.snapshot.paramMap.get('id')!;
    this.takeDecks();

  }

  buttonOperationHandler(code: any) {
    if(code) {
      switch(code) {
        case 'HOME':
          this.router.navigate(['/home']);
          break;
        case 'NEW':
          if(this.newDeck) {
            this.newDeck = false;
            this.newDeckName = "";
          } else {
            this.newDeck = true;
            this.newDeckName = "Nuovo Deck";
          }
          break;
        case 'EDIT':
          this.modifyDeck = !this.modifyDeck;
          this.newDeckName = "";
          break;
        /*case 'IMPORT':
          break;*/
      }
    }
  }

  viewDeck(id:string) {
    this.router.navigate(['/deckDetail',{id:id}]);
  }

  doModifyDeckName(deckName: string) {
    this.newDeck = false;
    this.oldDeckName = deckName;
    this.newDeckName = deckName;
  }

  saveName() {
    if(this.newDeck) {
      if(!this.deckId && !this.checkExistDeck()) {
        this.decks.push({"name":this.newDeckName,"id":"0"})
        this.newDeckName="";
        this.messageService.alert('Evvai','Il deck è stato aggiunto, ma ricordati di inserire le carte per confermare il salvataggio','success');
      } else {
        this.messageService.alert('Attenzione','Deck gia presente con questo nome','error');
      }
    } else {
      if(this.checkExistDeck()) {
        this.messageService.alert('Attenzione','Deck gia presente con questo nome','error');
      } else {

        if(!this.newDeck && this.newDeckName) {

          this.deckStateService.saveName(this.oldDeckName!,this.newDeckName).then((resp) => {
            if(resp && resp.status===200) {
              this.takeDecks();
              this.newDeckName="";
              this.messageService.alert('Fatto!','Deck modificato con successo.','success');
            } else {
              this.messageService.alert('Errore','Qualcosa è andato storto durante la modifica del nome del deck','error');
            }
          })
        }
      }
    }
  }

  doDeleteDeck(id:string) {
    let deck = this.decks.find(i => i.id === id);
    if(deck) {
      const index = this.decks.indexOf(deck, 0);
      //messaggio di conferma
      Swal.fire({
        title: 'Sei sicuro?',
        text: "Una volta cancellato non verrà mai più ripristinato!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, cancella!',
        cancelButtonText: 'Non cancellare!'
      }).then((result) => {
        if (result.isConfirmed) {
          if (index > -1) {
            this.decks.splice(index, 1);

            this.deckStateService.deleteDeck(id).then((resp) => {
              if(resp && resp.status===200) {
                this.messageService.alert('Evviva','Il tuo deck è stato cancellato','success');
              } else {
                this.messageService.alert('Attenzione!','non ho trovato nulla con questo id, probabilmente il deck non esiste','error');
              }
            })
          }
        }
      })
    }
  }

  private takeDecks() {
    if(this.playerId) {
      this.deckStateService.getDecks(this.playerId).then((resp) => {
        this.decks = resp!;
      });
    }
  }

  private checkExistDeck():boolean {
    let deck = this.decks.find(i => i.name === this.newDeckName);
    if(deck) {
      return true;
    } else {
      return false;
    }
  }

}
