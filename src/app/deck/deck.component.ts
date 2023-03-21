import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { HttpPlayer } from '../servicesOld/httpPlayer';
import { DeckEditComponent } from './edit/edit.component';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.css']
})
export class DeckComponent implements OnInit {

  decks: any[] = [];

  deckId: string | undefined;

  viewDeck = false;
  modifyDeck = false;
  viewImport = false;
  viewModifyNameDeck = false;
  newDeck = false;

  modifyDeckName: string | undefined;
  oldDeckName: string | undefined;

  playerId: string | undefined;

  @ViewChild(DeckEditComponent) mngDeckCmpt:DeckEditComponent | undefined;

  constructor(private route: ActivatedRoute, private spinnerService: NgxSpinnerService, private httpPlayerService: HttpPlayer, private router: Router) { }

  ngOnInit(): void {
    this.playerId = this.route.snapshot.paramMap.get('id')!;
    this.spinnerService.show();
    if(this.playerId) {
      this.httpPlayerService.getDecksById(this.playerId).subscribe({
        next: (result:any) => {
          if(result) {
            this.decks = result;
          }
        }, // completeHandler
        error: (error: any) => {
          this.spinnerService.hide();
          if(error.status===402) {
            this.swalAlert('Attenzione!','non ho trovato nulla con questo id, probabilmente non hai nessun deck','error');
            this.viewImport = true;
          }
        },
        complete: () => {
          this.spinnerService.hide();
        }
      });
    }
  }

  buttonOperationHandler(operation: any) {
    if(operation) {
      this.viewDeck = operation.viewDeck;
      this.modifyDeck = operation.updateDeck;
      this.viewModifyNameDeck = operation.updateNameDeck;
      
      if(operation.newDeck) {
        this.newDeck = true;
        this.viewModifyNameDeck = true;
        this.modifyDeckName = "New Deck";
      } else if (operation.importDeck) {
        this.importNewDeck(operation.fileResult);
      } else if (operation.saveDeck) {
        this.saveDeck();
      } else if (operation.backToHome) {
        this.router.navigate(['/home',{id:this.playerId!}]);
      }
      else {
        this.modifyDeckName = "";
      }
    }
  }

  view(id:string) {
    this.deckId = id;
    if(this.deckId !== '0') {
      this.viewDeck = true;
    } else {
      this.modifyDeck = true;
    }
  }

  doModifyDeckName(deckName: string) {
    this.newDeck = false;
    this.oldDeckName = deckName;
    this.modifyDeckName = deckName;
  }

  saveName() {
    if(this.newDeck) {
      if(!this.deckId && !this.checkExistDeck()) {
        this.decks.push({"name":this.modifyDeckName,"id":"0"})
        this.modifyDeck=false;
        this.modifyDeckName="";
        this.swalAlert('Evvai','Aggiunto il deck, ma ricordati di inserire le carte per conculdere il processo','success');
      } else {
        this.swalAlert('Attenzione','Deck gia presente con questo nome','error');
      }
    } else {
      if(this.checkExistDeck()) {
        this.swalAlert('Attenzione','Deck gia presente con questo nome','error');
      } else {
        let deck = this.decks.find(i => i.name === this.oldDeckName);
        if(deck) {
          //modify deck name
          if(!this.newDeck && this.modifyDeckName) {

            deck.name = this.modifyDeckName;
            this.modifyDeck=false;
            this.modifyDeckName="";
            this.spinnerService.show();
            this.httpPlayerService.saveNameDeck(deck).subscribe(
              resultService => {
                this.spinnerService.hide();
                if(resultService) {
                  this.swalAlert('Fatto!','Deck modificato con successo.','success');
                }
                else
                  this.swalAlert('Errore','Qualcosa è andato storto durante la modifica del nome del deck','error');
              }
            );

          }
        }
      }
    }
    
  }

  saveDeck() {
    if(this.mngDeckCmpt) {
      this.spinnerService.show();
      this.httpPlayerService.updateDeck(this.mngDeckCmpt.deck!,this.mngDeckCmpt.deckId!).subscribe(
        result => {
          this.spinnerService.hide();
          if(result) {
            this.swalAlert('Fatto!','Deck salvato con successo.','success');
          }
          else
            this.swalAlert('Errore','Qualcosa è andato storto durante il salvataggio del deck','error');
        }
      );
    }
  }

  importNewDeck(fileResult:any) {
    fileResult["playerId"] = this.playerId;
    this.spinnerService.show();

    this.httpPlayerService.newDeck(fileResult).subscribe({
      next: (result:boolean) => {
        if(result) {
          this.viewImport = false;
          this.swalAlert('Fatto!','Deck creato con successo.','success');
          this.ngOnInit()
        }
      }, // completeHandler
      error: (error: any) => {
        this.spinnerService.hide();
        this.swalAlert('Errore','Qualcosa è andato storto durante la creazione del nuovo deck','error');
      },
      complete: () => {
        this.spinnerService.hide();
      }
    });
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
            this.spinnerService.show();
            this.httpPlayerService.deleteDeck(id).subscribe({
              next: (result:boolean) => {
                if(result) {
                  this.swalAlert('Evvai','Il tuo deck è stato cancellato','success');
                }
              }, // completeHandler
              error: (error: any) => {
                console.log(error)
                this.spinnerService.hide();
                this.swalAlert('Attenzione!','non ho trovato nulla con questo id, probabilmente il deck non esiste','error');
              },
              complete: () => {
                this.spinnerService.hide();
              }
            });
          }
        }
      })
    }
  }

  private checkExistDeck():boolean {
    let deck = this.decks.find(i => i.name === this.modifyDeckName);
    if(deck) {
      return true;
    } else {
      return false;
    }
  }

  private swalAlert(title: string, message: string, icon?: SweetAlertIcon) {
    this.spinnerService.hide();
    Swal.fire(title, message, icon).then((result) => { })
  }

}
