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

  constructor(private httpPlayerService: HttpPlayer,private spinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinnerService.show();
    if(this.deckId) {
      this.httpPlayerService.getDeckById(this.deckId).subscribe({
        next: (result:Deck) => {
          if(result) {
            this.deck = result;
          }
        }, // completeHandler
        error: (error: any) => {
          this.spinnerService.hide();
          if(error.status===402) {
            this.swalAlert('Attenzione!','non ho trovato nulla con questo id, probabilmente devi fare la registrazione','error');
          }
        },
        complete: () => {
          this.spinnerService.hide();
        }
      });
    }

    if(this.playerId) {
      this.httpPlayerService.getZainoById(this.playerId).subscribe({
        next: (result:Card[]) => {
          if(result) {
            this.zaino = result;
          }
        }, // completeHandler
        error: (error: any) => {
          this.spinnerService.hide();
          if(error.status===402) {
            this.swalAlert('Attenzione!','non ho trovato nulla con questo id, probabilmente devi fare la registrazione','error');
          }
        },
        complete: () => {
          this.spinnerService.hide();
        }
      });
    }
  }

  add(card:Card) {
    if(card && true) { //se è da extra o da side
      this.deck?.main.push(card)
    }
  }

  remove(card:Card) {
    if(card && true) { //se è da extra o da side
      const index = this.deck?.main.indexOf(card, 0);
      if (index && index > -1) {
        this.deck?.main.splice(index, 1);
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

  private swalAlert(title: string, message: string, icon?: SweetAlertIcon) {
    this.spinnerService.hide();
    Swal.fire(title, message, icon).then((result) => { })
  }

}
