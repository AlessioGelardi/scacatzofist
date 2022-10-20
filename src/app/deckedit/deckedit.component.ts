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
            //this.deck.main.sort((a, b) => a.type - b.type)
          }
        }, // completeHandler
        error: (error: any) => {
          this.spinnerService.hide();
          if(error.status===402) {
            //this.swalAlert('Attenzione!','non ho trovato nulla con questo id, probabilmente devi fare la registrazione','error');
          }
        },
        complete: () => {
          this.spinnerService.hide();
        }
      });
    }
  }

}
