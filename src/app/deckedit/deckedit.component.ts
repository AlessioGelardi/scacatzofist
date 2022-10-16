import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Card, Deck } from '../interface/card';
import { HttpPlayer } from '../services/httpPlayer';

@Component({
  selector: 'app-deckedit',
  templateUrl: './deckedit.component.html',
  styleUrls: ['./deckedit.component.css']
})
export class DeckeditComponent implements OnInit {

  deck: Deck | undefined;

  deckName: string = "";

  viewUpdateDeck: boolean = false;

  zaino: Card[] | undefined;

  constructor(private route: ActivatedRoute,private spinnerService: NgxSpinnerService,private httpPlayerService: HttpPlayer) { }

  ngOnInit(): void {
    this.deckName = "Ingranaggio Antico";
    //const playerId = this.route.snapshot.paramMap.get('id');
    const playerId = '63459b3a4b4c877f5a46f43e'
    this.spinnerService.show();
    if(playerId) {
      this.httpPlayerService.getDeckById(playerId).subscribe({
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
  }

  //Button Deck Edit
  updateDeck() {
    this.viewUpdateDeck = true;
    //const playerId = this.route.snapshot.paramMap.get('id');
    const playerId = '63459b3a4b4c877f5a46f43e'
    if(playerId && this.viewUpdateDeck) {
      this.spinnerService.show();
      this.httpPlayerService.getZainoById(playerId).subscribe({
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

  newDeck() {
    this.swalAlert('In progress...','Questa funzionalità è ancora in sviluppo... mi dispiace','info');
  }

  back() {
    this.viewUpdateDeck = false;
  }

  import() {
    this.swalAlert('In progress...','Questa funzionalità è ancora in sviluppo... mi dispiace','info');
  }

  save() {
    this.swalAlert('In progress...','Questa funzionalità è ancora in sviluppo... mi dispiace','info');
  }

  viewCard(card:Card) {
    this.showCard(card.name,card.description,card.id)
  }

  //Manage deck
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

  private showCard(title: string, text: string, cardId: string) {
    Swal.fire({
    title: title,
    color: '#3e3d3c',
    background: '#cdcccc',
    html: '<label style="font-size:14px">'+text+'</label>',
    imageUrl: 'https://storage.googleapis.com/ygoprodeck.com/pics/'+cardId+'.jpg',
    imageWidth: 160
    })
  }

  private swalAlert(title: string, message: string, icon?: SweetAlertIcon) {
    this.spinnerService.hide();
    Swal.fire(title, message, icon).then((result) => { })
  }

}
