import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Card, Deck } from 'src/app/interface/card';
import { HttpPlayer } from 'src/app/services/httpPlayer';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'deck-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class DeckEditComponent implements OnInit {

  @Input() deckId: string | undefined;
  @Input() playerId: string | undefined;

  deck: Deck | undefined;

  zaino: Card[]=[];

  viewFilter = false;
  filterName:string | undefined;
  flagFilterGO = false;

  constructor(private httpPlayerService: HttpPlayer,private spinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinnerService.show();
    if(this.deckId) {
      this.takeDeck(this.deckId);
    }

    if(this.playerId) {
      this.takeZaino(this.playerId);
    }
  }

  add(card:Card) {
    if(card && card.type == 8388641 || card.type === 97 || card.type === 8225) {
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

  showCard(card:Card) {
    Swal.fire({
    title: card.name,
    color: '#3e3d3c',
    background: '#cdcccc',
    html: '<label style="font-size:14px">'+card.description+'</label>',
    imageUrl: 'https://storage.googleapis.com/ygoprodeck.com/pics/'+card.id+'.jpg',
    imageWidth: 160
    })
  }

  doFilter() {
    this.viewFilter=!this.viewFilter;
  }

  private async takeDeck(deckId: string) {
    await new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        this.httpPlayerService.getDeckById(deckId).subscribe({
          next: (result:Deck) => {
            if(result) {
              this.deck = result;
            }
          }, // completeHandler
          error: (error: any) => {
            this.spinnerService.hide();
            if(error.status===402) {
              this.swalAlert('Attenzione!','non ho trovato nulla con questo id, probabilmente è presente un problema con il deck','error');
            }
          },
          complete: () => {
            this.spinnerService.hide();
          }
        });
        resolve()
      }, 10);
    });
  }

  private async takeZaino(playerId: string) {
    await new Promise<void>((resolve, reject) => {
      setTimeout(() => {
          this.httpPlayerService.getZainoById(playerId).subscribe({
            next: (result: Card[]) => {
              if (result) {
                this.zaino = result;
              }
            },
            error: (error: any) => {
              this.spinnerService.hide();
              if (error.status === 402) {
                this.swalAlert('Attenzione!', 'non ho trovato nulla con questo id, probabilmente è presente un problema con lo zaino', 'error');
              }
            },
            complete: () => {
              this.spinnerService.hide();
            }
          });
          resolve()
      }, 10);
    });
  }

  private swalAlert(title: string, message: string, icon?: SweetAlertIcon) {
    this.spinnerService.hide();
    Swal.fire(title, message, icon).then((result) => { })
  }

}
