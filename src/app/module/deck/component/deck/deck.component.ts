import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'src/app/module/interface/button';
import Swal from 'sweetalert2';
import { StateDeckService } from '../../services/state/state-deck.service';
import { MessageService } from 'src/app/module/swalAlert/message.service';

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
  permission: boolean = true;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private deckStateService: StateDeckService) {

  }

  ngOnInit(): void {
    this.messageService.alert('Benvenuto!','Ricorda di aprire il terminale locale per le modifiche sui deck','warning');
    this.permission = this.route.snapshot.paramMap.get('permission') === "true";
    if(this.permission) {
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
          name: "ALIGN-BUTTON",
          code: "ALIGN",
          class: "fa fa-retweet"
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
    } else {
      this.buttons = [
        {
          name: "HOME-BUTTON",
          code: "HOME",
          class: "fa fa-home"
        }
      ];
    }


    
    this.playerId = this.route.snapshot.paramMap.get('id')!;
    
    this.takeDecks();

  }

  buttonOperationHandler(code: any) {
    if(code) {
      switch(code) {
        case 'HOME':
          this.router.navigate(['/home',{id:this.playerId!}]);
          break;
        case 'NEW':
          if(this.newDeck) {
            this.newDeck = false;
            this.newDeckName = "";
          } else {
            this.newDeck = true;
            this.newDeckName = "NuovoDeck";
          }
          break;
        case 'ALIGN':
          this.alignDecks();
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

  viewDeck(id:string, newDeck:boolean, newNameDeck:string) {
    if(newDeck) {
      this.router.navigate(['/deckDetail',{id:id,newNameDeck:newNameDeck,playerId:this.playerId!, permission: this.permission}]);
    } else {
      this.router.navigate(['/deckDetail',{id:id,playerId:this.playerId!, permission: this.permission}]);
    }
  }

  doModifyDeckName(deckName: string) {
    this.newDeck = false;
    this.oldDeckName = deckName;
    this.newDeckName = deckName;
  }

  saveName() {
    if(this.newDeck) {
      if(!this.deckId && !this.checkExistDeck()) {

        let newDeck = {
          playerId: this.playerId,
          name: this.newDeckName,
          new: true
        };

        this.deckStateService.addDeck(newDeck).then((resp) => {
          if(resp) {
            this.newDeck = !this.newDeck;
            this.newDeckName="";
            this.deckStateService.resetPlayerDecks();
            this.takeDecks();
            this.messageService.alert('Evvai','Il deck è stato aggiunto, ma ricordati di inserire le carte per confermare il salvataggio','success');
          } else {
            this.messageService.alert('Errore','Qualcosa è andato storto durante il salvataggio del deck','error');
          }
        });

        
      } else {
        this.messageService.alert('Attenzione','Deck gia presente con questo nome','error');
      }
    } else {
      if(this.checkExistDeck()) {
        this.messageService.alert('Attenzione','Deck gia presente con questo nome','error');
      } else {

        if(!this.newDeck && this.newDeckName) {

          this.deckStateService.saveName(this.oldDeckName!,this.newDeckName).then((resp) => {
            if(resp) {
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
              if(resp) {
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

  private alignDecks() {
    this.deckStateService.alignDecks(this.playerId!).then((resp) => {
      if(resp === true) {
        this.messageService.alert('Fatto!','I deck sono stati allineati!','success');
        this.deckStateService.resetDeck();
        this.deckStateService.resetPlayerDecks();
        this.takeDecks();
      } else {
        this.messageService.alert('Errore',"Errore durante l'allineamento dei deck",'error');
      }
    });
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
