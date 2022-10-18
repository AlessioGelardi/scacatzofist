import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Deck } from '../interface/card';
import { HttpPlayer } from '../services/httpPlayer';

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

  playerId = '63459b3a4b4c877f5a46f43e';

  constructor(private route: ActivatedRoute, private spinnerService: NgxSpinnerService, private httpPlayerService: HttpPlayer) { }

  ngOnInit(): void {
    //this.deckName = "Ingranaggio Antico";
    //const playerId = this.route.snapshot.paramMap.get('id');
    //const playerId = 
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
            this.swalAlert('Attenzione!','non ho trovato nulla con questo id, probabilmente devi fare la registrazione','error');
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
    }
  }

  view(id:string) {
    this.deckId = id;
    this.viewDeck = true;
  }

  private swalAlert(title: string, message: string, icon?: SweetAlertIcon) {
    this.spinnerService.hide();
    Swal.fire(title, message, icon).then((result) => { })
  }

}
